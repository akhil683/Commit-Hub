CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"github_token" text,
	"subscription" text,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
