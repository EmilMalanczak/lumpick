ALTER TABLE "lumpick_profiles" DROP CONSTRAINT "lumpick_profiles_user_id_lumpick_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_pricings" DROP CONSTRAINT "lumpick_pricings_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop_features" DROP CONSTRAINT "lumpick_shop_features_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop_owners" DROP CONSTRAINT "lumpick_shop_owners_user_id_lumpick_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop_comments" DROP CONSTRAINT "lumpick_shop_comments_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_verify_tokens" DROP CONSTRAINT "lumpick_verify_tokens_user_id_lumpick_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop-favourites" DROP CONSTRAINT "lumpick_shop-favourites_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_profiles" ADD CONSTRAINT "lumpick_profiles_user_id_lumpick_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpick_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_pricings" ADD CONSTRAINT "lumpick_pricings_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpick_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop_features" ADD CONSTRAINT "lumpick_shop_features_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpick_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop_owners" ADD CONSTRAINT "lumpick_shop_owners_user_id_lumpick_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpick_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop_comments" ADD CONSTRAINT "lumpick_shop_comments_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpick_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_verify_tokens" ADD CONSTRAINT "lumpick_verify_tokens_user_id_lumpick_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpick_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop-favourites" ADD CONSTRAINT "lumpick_shop-favourites_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpick_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
