PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User_Chapter_Progress` (
	`User_ID` integer NOT NULL,
	`Chapter_ID` integer NOT NULL,
	PRIMARY KEY(`User_ID`, `Chapter_ID`),
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Chapter_ID`) REFERENCES `Chapter`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_User_Chapter_Progress`("User_ID", "Chapter_ID") SELECT "User_ID", "Chapter_ID" FROM `User_Chapter_Progress`;--> statement-breakpoint
DROP TABLE `User_Chapter_Progress`;--> statement-breakpoint
ALTER TABLE `__new_User_Chapter_Progress` RENAME TO `User_Chapter_Progress`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_User_Course_Progress` (
	`User_ID` integer NOT NULL,
	`Course_ID` integer NOT NULL,
	PRIMARY KEY(`User_ID`, `Course_ID`),
	FOREIGN KEY (`User_ID`) REFERENCES `User`(`ID`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`Course_ID`) REFERENCES `Course`(`ID`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_User_Course_Progress`("User_ID", "Course_ID") SELECT "User_ID", "Course_ID" FROM `User_Course_Progress`;--> statement-breakpoint
DROP TABLE `User_Course_Progress`;--> statement-breakpoint
ALTER TABLE `__new_User_Course_Progress` RENAME TO `User_Course_Progress`;