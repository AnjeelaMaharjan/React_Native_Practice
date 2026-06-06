CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`user_id` integer NOT NULL,
	`synced` integer DEFAULT 1 NOT NULL,
	`deleted_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sync_queue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`operation` text NOT NULL,
	`post_id` integer,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL
);
