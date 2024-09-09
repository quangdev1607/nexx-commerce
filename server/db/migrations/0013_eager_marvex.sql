ALTER TABLE "user_address" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_address" ALTER COLUMN "province" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_address" ALTER COLUMN "district" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_address" ALTER COLUMN "ward" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_address" ADD COLUMN "phone" integer NOT NULL;