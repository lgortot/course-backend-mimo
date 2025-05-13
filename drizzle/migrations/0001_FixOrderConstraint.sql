DROP INDEX `Chapter_Order_Index_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_chapter_order` ON `Chapter` (`Course_ID`,`Order_Index`);--> statement-breakpoint
DROP INDEX `Lesson_Order_Index_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_lesson_order` ON `Lesson` (`Chapter_ID`,`Order_Index`);