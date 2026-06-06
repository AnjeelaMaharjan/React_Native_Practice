CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`synced_at` integer,
	`updated_at` integer
);
