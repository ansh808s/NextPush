import express from "express";
import cors from "cors";
import { router } from "./src/routes/routes";
import { initKafkaConsumer } from "./src/config/kafka/client";

const port = 9000;
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/api", router);

const startKafkaConsumer = async () => {
  try {
    const consumerManager = await initKafkaConsumer();
    console.log("Kafka consumer initialized successfully");

    process.on("SIGINT", async () => {
      await consumerManager.shutdown();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await consumerManager.shutdown();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to initialize Kafka consumer:", error);
  }
};

startKafkaConsumer();

app.listen(port, () => {
  console.log(`Running in port ${port}`);
});
