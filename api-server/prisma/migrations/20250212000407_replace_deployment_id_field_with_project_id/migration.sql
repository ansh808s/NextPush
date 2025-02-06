/*
  Warnings:

  - You are about to drop the column `deployment_id` on the `UserSiteAnalytics` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `UserSiteAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSiteAnalytics" DROP CONSTRAINT "UserSiteAnalytics_deployment_id_fkey";

-- AlterTable
ALTER TABLE "UserSiteAnalytics" DROP COLUMN "deployment_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSiteAnalytics" ADD CONSTRAINT "UserSiteAnalytics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
