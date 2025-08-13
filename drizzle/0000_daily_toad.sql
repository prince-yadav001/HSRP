CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"owner_full_name" varchar(255),
	"owner_mobile" varchar(20),
	"owner_email" varchar(255),
	"owner_aadhaar" varchar(20),
	"owner_address" text,
	"owner_state" varchar(100),
	"owner_pincode" varchar(10),
	"vehicle_registration_number" varchar(50),
	"engine_number" varchar(100),
	"chassis_number" varchar(100),
	"vehicle_make" varchar(100),
	"vehicle_model" varchar(100),
	"manufacturing_year" varchar(4),
	"vehicle_category" varchar(100),
	"amount" integer,
	"status" varchar(50) DEFAULT 'pending',
	"payment_proof" text,
	"verification_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bookings_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"message" text,
	"created_at" timestamp DEFAULT now()
);
