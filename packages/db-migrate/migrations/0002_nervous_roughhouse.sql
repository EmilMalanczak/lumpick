ALTER TABLE "lumpick_users" ADD CONSTRAINT "lumpick_users_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "lumpick_users" ADD CONSTRAINT "lumpick_users_email_unique" UNIQUE("email");