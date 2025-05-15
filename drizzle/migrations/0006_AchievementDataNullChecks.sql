PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Achievement` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Type` text NOT NULL,
	`Threshold` integer NOT NULL,
	`Course_ID` integer,
	FOREIGN KEY (`Course_ID`) REFERENCES `Course`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Achievement`("ID", "Name", "Type", "Threshold", "Course_ID") SELECT "ID", "Name", "Type", "Threshold", "Course_ID" FROM `Achievement`;--> statement-breakpoint
DROP TABLE `Achievement`;--> statement-breakpoint
ALTER TABLE `__new_Achievement` RENAME TO `Achievement`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_User_Achievement` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`User_ID` integer,
	`Achievement_ID` integer NOT NULL,
	`Earned_At` integer,
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Achievement_ID`) REFERENCES `Achievement`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_User_Achievement`("ID", "User_ID", "Achievement_ID", "Earned_At") SELECT "ID", "User_ID", "Achievement_ID", "Earned_At" FROM `User_Achievement`;--> statement-breakpoint
DROP TABLE `User_Achievement`;--> statement-breakpoint
ALTER TABLE `__new_User_Achievement` RENAME TO `User_Achievement`;--> statement-breakpoint
CREATE INDEX `idx_user_achievement_user_achievement` ON `User_Achievement` (`User_ID`,`Achievement_ID`);