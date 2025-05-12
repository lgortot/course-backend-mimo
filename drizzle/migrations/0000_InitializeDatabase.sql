CREATE TABLE `Achievement` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Type` text NOT NULL,
	`Threshold` integer,
	`Course_ID` integer,
	FOREIGN KEY (`Course_ID`) REFERENCES `Course`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Chapter` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Course_ID` integer,
	`Name` text NOT NULL,
	`Order_Index` integer NOT NULL,
	FOREIGN KEY (`Course_ID`) REFERENCES `Course`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Chapter_Order_Index_unique` ON `Chapter` (`Order_Index`);--> statement-breakpoint
CREATE TABLE `Course` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Lesson` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Chapter_ID` integer,
	`Name` text NOT NULL,
	`Order_Index` integer NOT NULL,
	FOREIGN KEY (`Chapter_ID`) REFERENCES `Chapter`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Lesson_Order_Index_unique` ON `Lesson` (`Order_Index`);--> statement-breakpoint
CREATE TABLE `User` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Username` text
);
--> statement-breakpoint
CREATE TABLE `User_Achievement` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`User_ID` integer,
	`Achievement_ID` integer,
	`Earned_At` integer,
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Achievement_ID`) REFERENCES `Achievement`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_achievement_user_achievement` ON `User_Achievement` (`User_ID`,`Achievement_ID`);--> statement-breakpoint
CREATE TABLE `User_Chapter_Progress` (
	`User_ID` integer,
	`Chapter_ID` integer,
	PRIMARY KEY(`User_ID`, `Chapter_ID`),
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Chapter_ID`) REFERENCES `Chapter`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User_Course_Progress` (
	`User_ID` integer,
	`Course_ID` integer,
	PRIMARY KEY(`User_ID`, `Course_ID`),
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Course_ID`) REFERENCES `Course`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User_Lesson_Progress` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`User_ID` integer,
	`Lesson_ID` integer,
	`Started_At` integer,
	`Completed_At` integer,
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Lesson_ID`) REFERENCES `Lesson`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_lesson_progress_user_lesson` ON `User_Lesson_Progress` (`User_ID`,`Lesson_ID`);