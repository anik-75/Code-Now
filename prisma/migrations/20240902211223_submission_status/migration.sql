-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Correct', 'Wrong', 'Pending');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'Pending';
