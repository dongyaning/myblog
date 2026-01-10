CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"visitor_id" varchar(255) NOT NULL,
	"ip_hash" varchar(64),
	"user_agent" text,
	"referer" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"read_time" integer
);
--> statement-breakpoint
CREATE TABLE "post_stats" (
	"slug" varchar(255) PRIMARY KEY NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"unique_visitors" integer DEFAULT 0 NOT NULL,
	"avg_read_time" integer DEFAULT 0,
	"last_viewed" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
