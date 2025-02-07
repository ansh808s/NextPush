import { Kafka, type Producer, type RetryOptions } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import type { UserSiteAnalyticsEvent } from "../../types/analytics/types";

class KafkaProducerManager {
  private static instance: KafkaProducerManager;
  private producer: Producer | null = null;
  private lastActiveTimestamp: number = Date.now();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly MAX_IDLE_TIME = 5 * 60 * 1000;
  private readonly RECONNECT_INTERVAL = 5000;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    setInterval(() => this.checkConnection(), 60000);
  }

  public static getInstance(): KafkaProducerManager {
    if (!KafkaProducerManager.instance) {
      KafkaProducerManager.instance = new KafkaProducerManager();
    }
    return KafkaProducerManager.instance;
  }

  private getKafkaConfig() {
    const retryOptions: RetryOptions = {
      initialRetryTime: 100,
      retries: 8,
      maxRetryTime: 30000,
    };

    return new Kafka({
      brokers: process.env.KAFKA_BROKERS!.split(","),
      clientId: "proxy-analytics-producer",
      retry: retryOptions,
      connectionTimeout: 3000,
      authenticationTimeout: 3000,
    });
  }

  private async checkConnection() {
    const timeSinceLastActive = Date.now() - this.lastActiveTimestamp;

    if (this.producer && timeSinceLastActive > this.MAX_IDLE_TIME) {
      console.log("Producer idle for too long, disconnecting...");
      await this.disconnect();
    }
  }

  private async connect(): Promise<Producer> {
    try {
      if (!this.producer) {
        const kafka = this.getKafkaConfig();
        this.producer = kafka.producer();
        await this.producer.connect();

        this.producer.on("producer.disconnect", () => {
          console.warn("Producer disconnected");
          this.scheduleReconnect();
        });

        this.producer.on("producer.connect", () => {
          console.log("Producer connected");
          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
        });
      }
      return this.producer;
    } catch (error) {
      console.error("Failed to connect to Kafka:", error);
      this.scheduleReconnect();
      throw error;
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        this.producer = null;
        this.connect().catch(console.error);
      }, this.RECONNECT_INTERVAL);
    }
  }

  private async disconnect() {
    if (this.producer) {
      try {
        await this.producer.disconnect();
      } catch (error) {
        console.error("Error disconnecting producer:", error);
      } finally {
        this.producer = null;
      }
    }
  }

  public async sendUserSiteAnalyticsEvent(
    event: UserSiteAnalyticsEvent
  ): Promise<void> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < this.MAX_RETRIES) {
      try {
        const currentProducer = await this.connect();
        console.log(event);
        await currentProducer.send({
          topic: "site-analytics",
          messages: [
            {
              key: uuidv4(),
              value: JSON.stringify(event),
              timestamp: Date.now().toString(),
            },
          ],
        });

        this.lastActiveTimestamp = Date.now();
        return;
      } catch (error) {
        attempts++;
        lastError = error as Error;
        console.warn(
          `Failed to send analytics event (attempt ${attempts}/${this.MAX_RETRIES}):`,
          error
        );

        await this.disconnect();

        if (attempts < this.MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000))
          );
        }
      }
    }

    console.error(
      "Failed to send analytics event after all retries:",
      lastError
    );
  }
}

const kafkaManager = KafkaProducerManager.getInstance();
export const sendUserSiteAnalyticsEvent = (event: UserSiteAnalyticsEvent) =>
  kafkaManager.sendUserSiteAnalyticsEvent(event);
