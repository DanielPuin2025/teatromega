CREATE TABLE `attendanceRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`studentId` int NOT NULL,
	`status` enum('present','absent','late','excused') NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendanceRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendanceSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionDate` varchar(10) NOT NULL,
	`activity` varchar(160) NOT NULL,
	`groupName` varchar(20) NOT NULL DEFAULT '11A',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendanceSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(180) NOT NULL,
	`document` varchar(40),
	`grade` varchar(20) NOT NULL DEFAULT '11',
	`groupName` varchar(20) NOT NULL DEFAULT '11A',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`)
);
