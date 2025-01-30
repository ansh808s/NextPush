import { ECSClient } from "@aws-sdk/client-ecs";

export const ecsClient = new ECSClient({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
