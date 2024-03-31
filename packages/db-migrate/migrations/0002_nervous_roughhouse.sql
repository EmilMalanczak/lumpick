ALTER TABLE "lumpik_users" ADD CONSTRAINT "lumpik_users_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "lumpik_users" ADD CONSTRAINT "lumpik_users_email_unique" UNIQUE("email");