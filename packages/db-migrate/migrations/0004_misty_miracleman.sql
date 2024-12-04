CREATE TABLE IF NOT EXISTS "lumpick_verify_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "lumpick_verify_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_verify_tokens" ADD CONSTRAINT "lumpick_verify_tokens_user_id_lumpick_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpick_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
