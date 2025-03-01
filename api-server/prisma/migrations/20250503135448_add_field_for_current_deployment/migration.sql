/*
  Warnings:

  - A unique constraint covering the columns `[current_deployment_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "current_deployment_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_current_deployment_id_key" ON "Project"("current_deployment_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_current_deployment_id_fkey" FOREIGN KEY ("current_deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
