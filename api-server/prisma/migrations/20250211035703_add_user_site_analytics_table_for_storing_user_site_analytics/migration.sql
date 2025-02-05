-- CreateTable
CREATE TABLE "UserSiteAnalytics" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "UserSiteAnalytics_pkey" PRIMARY KEY ("id")
);
