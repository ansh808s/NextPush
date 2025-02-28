import { Kafka, type Consumer } from "kafkajs";
import { client } from "../clickhouse/client";
import { v4 } from "uuid";
import type { LogEvent, UserSiteAnalyticsEvent } from "../../types/app.types";
import prisma from "../../../prisma/db";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class KafkaConsumerManager {
  private kafka: Kafka;
  private logConsumer: Consumer;
  private analyticsConsumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: process.env.KAFKA_BROKERS!.split(","),
      clientId: "api-server",
      ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
      },
      sasl: {
        username: process.env.KAFKA_USER!,
        password: process.env.KAFKA_PASS!,
        mechanism: "plain",
      },
    });

    this.logConsumer = this.kafka.consumer({
      groupId: "api-server-logs-consumer",
    });

    this.analyticsConsumer = this.kafka.consumer({
      groupId: "analytics-consumer-group",
    });
  }

  private async findProjectByNameAndSubdomain(
    slug: string
  ): Promise<string | null> {
    try {
      const project = await prisma.project.findFirst({
        where: {
          slug,
        },
        select: { id: true },
      });

      return project?.id || null;
    } catch (error) {
      console.error("Error finding project:", error);
      return null;
    }
  }

  private async processAnalyticsMessage(message: any) {
    console.log(message);
    if (!message.value) return;

    try {
      const stringMessage = message.value.toString();
      const event: UserSiteAnalyticsEvent = JSON.parse(stringMessage);
      const projectId = await this.findProjectByNameAndSubdomain(
        event.siteSlug
      );

      if (!projectId) {
        console.error(`No project found for name_subdomain: ${event.siteSlug}`);
        return;
      }
      console.log({
        id: event.eventId,
        site_id: event.siteSlug,
      });

      await prisma.userSiteAnalytics.upsert({
        where: { id: event.eventId },
        update: {
          eventType: event.eventType,
          hostname: event.hostname,
          path: event.path,
          projectId,
        },
        create: {
          id: event.eventId,
          eventType: event.eventType,
          hostname: event.hostname,
          path: event.path,
          projectId,
        },
      });
    } catch (error) {
      console.error("Error processing analytics message:", error);
    }
  }

  private async processLogMessage(message: any) {
    if (!message.value) return;

    try {
      const stringMessage = message.value.toString();
      const logEvent: LogEvent = JSON.parse(stringMessage);

      console.log({
        type: logEvent.type,
        message: logEvent.message,
        timestamp: logEvent.timestamp,
      });

      if (logEvent.type === "error" || logEvent.type === "success") {
        try {
          await prisma.deployment.update({
            where: { id: logEvent.deployment_id },
            data: { status: logEvent.type === "error" ? "FAILED" : "READY" },
          });
        } catch (error) {
          console.error(
            `Error updating deployment (${logEvent.type} type):`,
            error
          );
        }
      }

      const { query_id } = await client.insert({
        table: "log_events",
        values: [
          {
            event_id: v4(),
            deployment_id: logEvent.deployment_id,
            type: logEvent.type,
            message: logEvent.message,
            timestamp: logEvent.timestamp,
          },
        ],
        format: "JSONEachRow",
      });

      return query_id;
    } catch (error) {
      console.error("Error processing log message:", error);
    }
  }

  public async initConsumer() {
    try {
      await this.logConsumer.connect();
      await this.logConsumer.subscribe({
        topics: ["container-logs"],
        fromBeginning: false,
      });

      await this.analyticsConsumer.connect();
      await this.analyticsConsumer.subscribe({
        topics: ["site-analytics"],
        fromBeginning: false,
      });

      await this.logConsumer.run({
        eachMessage: async ({ message }) => {
          try {
            await this.processLogMessage(message);
          } catch (error) {
            console.error("Error processing log message:", error);
          }
        },
      });

      await this.analyticsConsumer.run({
        eachMessage: async ({ message }) => {
          try {
            await this.processAnalyticsMessage(message);
          } catch (error) {
            console.error("Error processing analytics message:", error);
          }
        },
      });

      console.log("Kafka consumers initialized successfully");
    } catch (error) {
      console.error("Error initializing Kafka consumers:", error);
      console.log("Retrying in 5 seconds...");
      setTimeout(() => this.initConsumer(), 5000);
    }
  }

  public async shutdown() {
    try {
      await Promise.all([
        this.logConsumer.disconnect(),
        this.analyticsConsumer.disconnect(),
      ]);
      console.log("Kafka consumers disconnected");
    } catch (error) {
      console.error("Error shutting down Kafka consumers:", error);
    }
  }
}

export async function initKafkaConsumer() {
  const consumerManager = new KafkaConsumerManager();
  await consumerManager.initConsumer();
  return consumerManager;
}
