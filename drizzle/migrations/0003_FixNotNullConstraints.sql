PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Lesson` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Chapter_ID` integer NOT NULL,
	`Name` text NOT NULL,
	`Order_Index` integer NOT NULL,
	FOREIGN KEY (`Chapter_ID`) REFERENCES `Chapter`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Lesson`("ID", "Chapter_ID", "Name", "Order_Index") SELECT "ID", "Chapter_ID", "Name", "Order_Index" FROM `Lesson`;--> statement-breakpoint
DROP TABLE `Lesson`;--> statement-breakpoint
ALTER TABLE `__new_Lesson` RENAME TO `Lesson`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_lesson_order` ON `Lesson` (`Chapter_ID`,`Order_Index`);--> statement-breakpoint
CREATE TABLE `__new_User_Lesson_Progress` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`User_ID` integer NOT NULL,
	`Lesson_ID` integer NOT NULL,
	`Started_At` integer NOT NULL,
	`Completed_At` integer NOT NULL,
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Lesson_ID`) REFERENCES `Lesson`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_User_Lesson_Progress`("ID", "User_ID", "Lesson_ID", "Started_At", "Completed_At") SELECT "ID", "User_ID", "Lesson_ID", "Started_At", "Completed_At" FROM `User_Lesson_Progress`;--> statement-breakpoint
DROP TABLE `User_Lesson_Progress`;--> statement-breakpoint
ALTER TABLE `__new_User_Lesson_Progress` RENAME TO `User_Lesson_Progress`;--> statement-breakpoint
CREATE INDEX `idx_user_lesson_progress_user_lesson` ON `User_Lesson_Progress` (`User_ID`,`Lesson_ID`);