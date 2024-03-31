CREATE TABLE IF NOT EXISTS "lumpik_verify_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "lumpik_verify_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_verify_tokens" ADD CONSTRAINT "lumpik_verify_tokens_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
