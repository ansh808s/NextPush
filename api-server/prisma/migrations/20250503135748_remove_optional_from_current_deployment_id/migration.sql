/*
  Warnings:

  - Made the column `current_deployment_id` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_current_deployment_id_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "current_deployment_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_current_deployment_id_fkey" FOREIGN KEY ("current_deployment_id") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
