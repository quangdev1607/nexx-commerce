CREATE TABLE IF NOT EXISTS "user_address" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text,
	"province" text,
	"district" text,
	"ward" text,
	"updated_at" timestamp DEFAULT now(),
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
