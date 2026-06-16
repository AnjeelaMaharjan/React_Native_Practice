CREATE TABLE `characters` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`synced` integer DEFAULT 1 NOT NULL,
	`deleted_at` integer,
	`updated_at` integer NOT NULL
);
