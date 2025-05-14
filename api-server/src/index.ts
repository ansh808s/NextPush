import express from "express";
import cors from "cors";
import { router } from "./routes/routes";
import { initKafkaConsumer } from "./config/kafka/client";

const port = 9000;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", router);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
  return;
});

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
