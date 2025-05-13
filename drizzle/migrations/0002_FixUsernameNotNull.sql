PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Username` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("ID", "Username") SELECT "ID", "Username" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;