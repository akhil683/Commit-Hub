ALTER TABLE "user" ADD COLUMN "total_commits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "github_token";