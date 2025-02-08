import { Kafka, type Consumer } from "kafkajs";
import { client } from "../clickhouse/client";
import { v4 } from "uuid";
import type { LogEvent, UserSiteAnalyticsEvent } from "../../types/app.types";
import prisma from "../../../prisma/db";

class KafkaConsumerManager {
  private kafka: Kafka;
  private logConsumer: Consumer;
  private analyticsConsumer: Consumer;
  private isConnected: boolean = false;
  private heartbeatInterval: NodeJS.Timer | null = null;
  private readonly HEARTBEAT_INTERVAL = 3000;
  private readonly MAX_RETRIES = 5;
  private retryCount = 0;

  constructor() {
    this.kafka = new Kafka({
      brokers: process.env.KAFKA_BROKERS!.split(","),
      clientId: "api-server",
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.logConsumer = this.kafka.consumer({
      groupId: "api-server-logs-consumer",
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    this.analyticsConsumer = this.kafka.consumer({
      groupId: "analytics-consumer-group",
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    [this.logConsumer, this.analyticsConsumer].forEach((consumer) => {
      consumer.on("consumer.crash", async (event) => {
        console.error("Consumer crashed:", event);
        this.isConnected = false;
        await this.handleCrash();
      });

      consumer.on("consumer.disconnect", async () => {
        console.log("Consumer disconnected");
        this.isConnected = false;
        await this.handleDisconnect();
      });
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
        type: event.eventId,
        site_id: event.siteSlug,
      });

      await prisma.userSiteAnalytics.create({
        data: {
          id: event.eventId,
          eventType: event.eventType,
          hostname: event.hostname,
          path: event.path,
          projectId,
        },
      });
    } catch (error) {
      console.error("Error processing analytics message:", error);
      throw error;
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
      throw error;
    }
  }

  public async initConsumer() {
    try {
      await this.logConsumer.connect();
      await this.logConsumer.subscribe({
        topics: ["container-logs"],
        fromBeginning: true,
      });

      await this.analyticsConsumer.connect();
      await this.analyticsConsumer.subscribe({
        topics: ["site-analytics"],
        fromBeginning: true,
      });

      this.isConnected = true;
      this.startHeartbeat();

      await this.logConsumer.run({
        autoCommit: false,
        eachBatch: async ({
          batch,
          resolveOffset,
          heartbeat,
          commitOffsetsIfNecessary,
        }) => {
          const messages = batch.messages;
          console.log(`Received ${messages.length} log messages`);

          for (const message of messages) {
            try {
              await this.processLogMessage(message);
              resolveOffset(message.offset);
              await commitOffsetsIfNecessary();
              await heartbeat();
            } catch (error) {
              console.error("Error in log batch processing:", error);
            }
          }
        },
      });

      await this.analyticsConsumer.run({
        autoCommit: false,
        eachBatch: async ({
          batch,
          resolveOffset,
          heartbeat,
          commitOffsetsIfNecessary,
        }) => {
          const messages = batch.messages;
          console.log(`Received ${messages.length} analytics messages`);

          for (const message of messages) {
            try {
              await this.processAnalyticsMessage(message);
              resolveOffset(message.offset);
              await commitOffsetsIfNecessary();
              await heartbeat();
            } catch (error) {
              console.error("Error in analytics batch processing:", error);
            }
          }
        },
      });
    } catch (error) {
      console.error("Error initializing consumer:", error);
      this.isConnected = false;
      // @ts-ignore
      if (error.code === "ECONNRESET") {
        await this.handleDisconnect();
      } else {
        throw error;
      }
    }
  }

  public async shutdown() {
    this.isConnected = false;
    await this.stopHeartbeat();
    await Promise.all([
      this.logConsumer.disconnect(),
      this.analyticsConsumer.disconnect(),
    ]);
  }

  private async handleCrash() {
    if (this.retryCount < this.MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `Attempting reconnect ${this.retryCount}/${this.MAX_RETRIES}`
      );
      await this.reconnect();
    } else {
      console.error("Max retries reached. Manual intervention required.");
      process.exit(1);
    }
  }

  private async handleDisconnect() {
    try {
      await this.stopHeartbeat();
      await this.reconnect();
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  private async reconnect() {
    try {
      if (this.isConnected) {
        await Promise.all([
          this.logConsumer.disconnect(),
          this.analyticsConsumer.disconnect(),
        ]);
      }
      await this.initConsumer();
    } catch (error) {
      console.error("Error during reconnection:", error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      if (!this.isConnected) return;

      try {
        await this.kafka.admin().listTopics();
      } catch (error) {
        console.error("Connection check failed:", error);
        this.isConnected = false;
        await this.handleDisconnect();
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private async stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export async function initKafkaConsumer() {
  const consumerManager = new KafkaConsumerManager();
  await consumerManager.initConsumer();
  return consumerManager;
}
