-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_current_deployment_id_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "current_deployment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_current_deployment_id_fkey" FOREIGN KEY ("current_deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
