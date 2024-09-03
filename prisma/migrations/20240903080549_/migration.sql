/*
  Warnings:

  - Added the required column `correctCode` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "correctCode" TEXT NOT NULL;
