/*
  Warnings:

  - Added the required column `deployment_id` to the `UserSiteAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSiteAnalytics" ADD COLUMN     "deployment_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSiteAnalytics" ADD CONSTRAINT "UserSiteAnalytics_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
