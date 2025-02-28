import { Kafka, type Producer } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import type { UserSiteAnalyticsEvent } from "../../types/analytics/types";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class KafkaProducerManager {
  private static instance: KafkaProducerManager;
  private producer: Producer | null = null;
  private readonly MAX_RETRIES = 3;

  private constructor() {}

  public static getInstance(): KafkaProducerManager {
    if (!KafkaProducerManager.instance) {
      KafkaProducerManager.instance = new KafkaProducerManager();
    }
    return KafkaProducerManager.instance;
  }

  private getKafkaConfig() {
    return new Kafka({
      brokers: process.env.KAFKA_BROKERS!.split(","),
      clientId: "proxy-analytics-producer",
      retry: {
        initialRetryTime: 100,
        retries: 8,
        maxRetryTime: 30000,
      },
      ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
      },
      sasl: {
        username: process.env.KAFKA_USER!,
        password: process.env.KAFKA_PASS!,
        mechanism: "plain",
      },
    });
  }

  private async getProducer(): Promise<Producer> {
    if (!this.producer) {
      const kafka = this.getKafkaConfig();
      this.producer = kafka.producer();

      try {
        await this.producer.connect();
        console.log("Producer connected");
        this.producer.on("producer.disconnect", () => {
          console.warn("Producer disconnected");
          this.producer = null;
        });
      } catch (error) {
        console.error("Failed to connect to Kafka:", error);
        this.producer = null;
        throw error;
      }
    }
    return this.producer;
  }

  public async sendUserSiteAnalyticsEvent(
    event: UserSiteAnalyticsEvent
  ): Promise<void> {
    let attempts = 0;

    while (attempts < this.MAX_RETRIES) {
      try {
        const producer = await this.getProducer();

        await producer.send({
          topic: "site-analytics",
          messages: [
            {
              key: uuidv4(),
              value: JSON.stringify(event),
              timestamp: Date.now().toString(),
            },
          ],
        });

        console.log("Analytics event sent successfully");
        return;
      } catch (error) {
        attempts++;
        console.warn(
          `Failed to send analytics event (attempt ${attempts}/${this.MAX_RETRIES}):`,
          error
        );

        this.producer = null;

        if (attempts < this.MAX_RETRIES) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempts), 10000);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
        }
      }
    }

    console.error("Failed to send analytics event after all retries");
  }
}

const kafkaManager = KafkaProducerManager.getInstance();

export const sendUserSiteAnalyticsEvent = (event: UserSiteAnalyticsEvent) =>
  kafkaManager.sendUserSiteAnalyticsEvent(event);
