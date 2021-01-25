CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"name" varchar(100),
	"description" varchar(500),
	"status" varchar(20),
	"priority" integer,
	"timeComplete" varchar(20)
);

INSERT INTO "tasks" ("name", "description", "status", "priority")
VALUES ('Pet Puppies', 'Pet the puppies at least 10 times today because they are super cute and deserve all of the love in the world.',
'In progress', '3');

INSERT INTO "tasks" ("name", "description", "status", "priority", "timeComplete")
VALUES ('Finish Weekend Project', 'Check Github respository and complete weekend homework based off of required goals found.',
'Complete', '3', '01-24-2021 21:23');

INSERT INTO "tasks" ("name", "description", "status", "priority")
VALUES ('Laundry', 'Do my laundry by seperating clothes into three piles; white, darks, and colors.',
'In progress', '2');

INSERT INTO "tasks" ("name", "description", "status", "priority", "timeComplete")
VALUES ('Quinn', 'Save Quinn by coming in and fixing a problem he had been dealing with for multiple hours by writing a function in 2 minutes.',
'Complete', '1', '01-23-2021 19:30');