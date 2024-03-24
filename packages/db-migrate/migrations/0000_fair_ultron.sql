DO $$ BEGIN
 CREATE TYPE "shop_features_type" AS ENUM('assortment', 'payment', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pricing_type" AS ENUM('weight', 'percentage', 'piece');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "shop_features_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500),
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"password" varchar(128) NOT NULL,
	"email" varchar(128) NOT NULL,
	"provider" text NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_shops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"owner_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_pricings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"prices" jsonb NOT NULL,
	"type" "pricing_type" NOT NULL,
	"currency" varchar(4) NOT NULL,
	"shop_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_shop_features" (
	"shop_id" integer NOT NULL,
	"feature_id" integer NOT NULL,
	CONSTRAINT "lumpik_shop_features_shop_id_feature_id_pk" PRIMARY KEY("shop_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_shop_owners" (
	"id" serial PRIMARY KEY NOT NULL,
	"verified" boolean DEFAULT false,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_shop_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate" smallint NOT NULL,
	"comment" varchar(255) NOT NULL,
	"shop_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lumpik_shop-favourites" (
	"shop_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "lumpik_shop-favourites_shop_id_user_id_pk" PRIMARY KEY("shop_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_profiles" ADD CONSTRAINT "lumpik_profiles_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shops" ADD CONSTRAINT "lumpik_shops_owner_id_lumpik_shop_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "lumpik_shop_owners"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_pricings" ADD CONSTRAINT "lumpik_pricings_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_features" ADD CONSTRAINT "lumpik_shop_features_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_features" ADD CONSTRAINT "lumpik_shop_features_feature_id_lumpik_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "lumpik_features"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_owners" ADD CONSTRAINT "lumpik_shop_owners_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop_comments" ADD CONSTRAINT "lumpik_shop_comments_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop-favourites" ADD CONSTRAINT "lumpik_shop-favourites_shop_id_lumpik_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "lumpik_shops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lumpik_shop-favourites" ADD CONSTRAINT "lumpik_shop-favourites_user_id_lumpik_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "lumpik_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
