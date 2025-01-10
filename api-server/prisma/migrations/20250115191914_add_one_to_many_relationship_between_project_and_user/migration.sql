/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `gitURL` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `subDomain` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `git_url` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_domain` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdAt",
DROP COLUMN "gitURL",
DROP COLUMN "subDomain",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "git_url" TEXT NOT NULL,
ADD COLUMN     "sub_domain" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
