ALTER TABLE "lumpick_deliveries" DROP CONSTRAINT "lumpick_deliveries_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop_features" DROP CONSTRAINT "lumpick_shop_features_shop_id_lumpick_shops_id_fk";
--> statement-breakpoint
ALTER TABLE "lumpick_shop_features" DROP CONSTRAINT "lumpick_shop_features_feature_id_lumpick_features_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_deliveries" ADD CONSTRAINT "lumpick_deliveries_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."lumpick_shops"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop_features" ADD CONSTRAINT "lumpick_shop_features_shop_id_lumpick_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."lumpick_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpick_shop_features" ADD CONSTRAINT "lumpick_shop_features_feature_id_lumpick_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."lumpick_features"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
