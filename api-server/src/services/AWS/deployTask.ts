import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { ecsClient } from "../../../config/aws/ecsClient";
import type { SupportedFrameworks } from "../../config/constants";

interface IDeployTask {
  gitURL: string;
  projectId: string;
  deploymentId: string;
  framework: `${SupportedFrameworks}`;
  rootDir: string;
}

export const deployTask = async (props: IDeployTask) => {
  const command = new RunTaskCommand({
    cluster: process.env.ECS_CLUSTER,
    taskDefinition: process.env.ECS_TASK_DEFINITION,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: process.env.ECS_SUBNETS?.split(","),
        securityGroups: process.env.ECS_SECURITY_GROUPS?.split(","),
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPO_URL", value: props.gitURL },
            { name: "PROJECT_ID", value: props.projectId },
            { name: "S3_BUCKET", value: process.env.S3_BUCKET },
            { name: "S3_REGION", value: process.env.S3_REGION },
            { name: "S3_ACCESS_KEY_ID", value: process.env.S3_ACCESS_KEY_ID },
            {
              name: "S3_SECRET_ACCESS_KEY",
              value: process.env.S3_SECRET_ACCESS_KEY,
            },
            {
              name: "FRAMEWORK",
              value: props.framework,
            },
            {
              name: "ROOT_DIR",
              value: props.rootDir,
            },
          ],
        },
      ],
      cpu: "1024",
      memory: "2048",
    },
  });
  return await ecsClient.send(command);
};
