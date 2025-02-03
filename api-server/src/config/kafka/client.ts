import { Kafka, type Consumer } from "kafkajs";
import { client } from "../clickhouse/client";
import { v4 } from "uuid";
import type { LogEvent } from "../../types/app.types";
import prisma from "../../../prisma/db";

class KafkaConsumerManager {
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected: boolean = false;
  private heartbeatInterval: NodeJS.Timer | null = null;
  private readonly HEARTBEAT_INTERVAL = 3000; // 3 seconds
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

    this.consumer = this.kafka.consumer({
      groupId: "api-server-logs-consumer",
      sessionTimeout: 30000, // 30 seconds
      heartbeatInterval: 3000, // 3 seconds
      maxBytes: 5242880, // 5MB
    });

    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    this.consumer.on("consumer.crash", async (event) => {
      console.error("Consumer crashed:", event);
      this.isConnected = false;
      await this.handleCrash();
    });

    this.consumer.on("consumer.disconnect", async () => {
      console.log("Consumer disconnected");
      this.isConnected = false;
      await this.handleDisconnect();
    });
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
        await this.consumer.disconnect();
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

    // Instead of directly calling heartbeat, we'll check connection status
    this.heartbeatInterval = setInterval(async () => {
      if (!this.isConnected) return;

      try {
        // Send a metadata request to check connection
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

  private async processMessage(message: any) {
    if (!message.value) return;

    try {
      const stringMessage = message.value.toString();
      const logEvent: LogEvent = JSON.parse(stringMessage);

      console.log({
        type: logEvent.type,
        message: logEvent.message,
        timestamp: logEvent.timestamp,
      });

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
      console.error("Error processing message:", error);
      throw error;
    }
  }

  public async initConsumer() {
    try {
      await this.consumer.connect();
      this.isConnected = true;

      await this.consumer.subscribe({
        topics: ["container-logs"],
        fromBeginning: true,
      });

      this.startHeartbeat();

      await this.consumer.run({
        autoCommit: false,
        eachBatch: async ({
          batch,
          resolveOffset,
          heartbeat,
          commitOffsetsIfNecessary,
        }) => {
          const messages = batch.messages;
          console.log(`Received ${messages.length} messages`);

          for (const message of messages) {
            try {
              await this.processMessage(message);
              resolveOffset(message.offset);
              await commitOffsetsIfNecessary();
              // Use the heartbeat provided by eachBatch
              await heartbeat();
            } catch (error) {
              console.error("Error in batch processing:", error);
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
    await this.consumer.disconnect();
  }
}

// Export instance creation function
export async function initKafkaConsumer() {
  const consumerManager = new KafkaConsumerManager();
  await consumerManager.initConsumer();
  return consumerManager;
}
