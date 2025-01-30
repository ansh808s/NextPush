import express from "express";
import cors from "cors";
import { router } from "./src/routes/routes";
import { initkafkaConsumer } from "./src/config/kafka/client";

const port = 9000;
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/api", router);

initkafkaConsumer();

app.listen(port, () => {
  console.log(`Running in port ${port}`);
});
