CREATE TABLE IF NOT EXISTS "lumpik_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
