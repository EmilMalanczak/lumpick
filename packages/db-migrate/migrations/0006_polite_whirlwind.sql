CREATE TYPE "public"."delivery_type" AS ENUM('general', 'shoes', 'clothes', 'accessories', 'seasonal', 'premium');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');--> statement-breakpoint
CREATE TYPE "public"."week_type" AS ENUM('WEEK_1', 'WEEK_2', 'WEEK_3', 'WEEK_4');--> statement-breakpoint
ALTER TYPE "public"."pricing_type" RENAME TO "price_type";--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"longitude" numeric(9, 6),
	"latitude" numeric(8, 6),
	"street" varchar(255),
	"city" varchar(63),
	"country" varchar(63),
	"postcode" varchar(63),
	"shop_id" integer,
	"google_maps_link" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"shop_id" integer NOT NULL,
	"delivery_type" "delivery_type" DEFAULT 'general' NOT NULL,
	"is_periodic" boolean DEFAULT false NOT NULL,
	"repeat_interval" interval,
	"delivery_duration" integer,
	"next_delivery" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lumpik_pricings" RENAME COLUMN "type" TO "price_type";--> statement-breakpoint
ALTER TABLE "lumpik_shop_features" DROP CONSTRAINT "lumpik_shop_features_shop_id_feature_id_pk";--> statement-breakpoint
ALTER TABLE "lumpik_shop-favourites" DROP CONSTRAINT "lumpik_shop-favourites_shop_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ALTER COLUMN "currency" SET DATA TYPE varchar(5);--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ALTER COLUMN "currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "telephone" varchar(15);--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "address_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "hours" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ADD COLUMN "day" "day_of_week" NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ADD COLUMN "week" "week_type" DEFAULT 'WEEK_1' NOT NULL;--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ADD COLUMN "amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ADD COLUMN "percentage_off" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "lumpik_pricings" ADD COLUMN "description" varchar(500);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_addresses" ADD CONSTRAINT "lumpik_addresses_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_deliveries" ADD CONSTRAINT "lumpik_deliveries_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lumpik_pricings" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "lumpik_pricings" DROP COLUMN IF EXISTS "prices";--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD CONSTRAINT "lumpik_shops_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "lumpik_shops" ADD CONSTRAINT "lumpik_shops_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "public"."lumpik_pricings" ALTER COLUMN "price_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."price_type";--> statement-breakpoint
CREATE TYPE "public"."price_type" AS ENUM('per_weight', 'per_piece', 'percentage_off', 'custom');--> statement-breakpoint
ALTER TABLE "public"."lumpik_pricings" ALTER COLUMN "price_type" SET DATA TYPE "public"."price_type" USING "price_type"::"public"."price_type";