-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_project_id_fkey";

-- DropForeignKey
ALTER TABLE "UserSiteAnalytics" DROP CONSTRAINT "UserSiteAnalytics_project_id_fkey";

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSiteAnalytics" ADD CONSTRAINT "UserSiteAnalytics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
