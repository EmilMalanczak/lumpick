ALTER TABLE "lumpik_profiles" DROP CONSTRAINT "lumpik_profiles_user_id_lumpik_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_pricings" DROP CONSTRAINT "lumpik_pricings_shop_id_lumpik_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_shop_features" DROP CONSTRAINT "lumpik_shop_features_shop_id_lumpik_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_shop_owners" DROP CONSTRAINT "lumpik_shop_owners_user_id_lumpik_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_shop_comments" DROP CONSTRAINT "lumpik_shop_comments_shop_id_lumpik_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_verify_tokens" DROP CONSTRAINT "lumpik_verify_tokens_user_id_lumpik_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpik_shop-favourites" DROP CONSTRAINT "lumpik_shop-favourites_shop_id_lumpik_shops_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_profiles" ADD CONSTRAINT "lumpik_profiles_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_pricings" ADD CONSTRAINT "lumpik_pricings_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_features" ADD CONSTRAINT "lumpik_shop_features_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_owners" ADD CONSTRAINT "lumpik_shop_owners_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_comments" ADD CONSTRAINT "lumpik_shop_comments_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_verify_tokens" ADD CONSTRAINT "lumpik_verify_tokens_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop-favourites" ADD CONSTRAINT "lumpik_shop-favourites_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
