# Project Info & Startup
The repo contains a RESTful api server designed to be used as a backend service for the educational game described by the Mimi backend coding challenge. This is not a fully-functional bug-free server implementation, but rather a simple design solving different problems outlined in the challenge. The tech stack includes Typescript using Express on Node, backed by the Drizzle ORM package and SQLite as database. The app contains seeded test data to assist with manual testing.

## Startup Scripts
In order to start up the server after cloning the repo, the user should run `npm install` in order to install the node module dependencies. Once installation is complete, running the custom `npm run dev:start` script will automatically generate the sqlite database by executing the migrations and seeding it with test data before running te server on port 3000 by default. The port and database location can be configured in the .env file.

**For development purposes, the app contains the following node scripts which can be run manually instead:**

`npm run db:migrate` which constructs the database schema by running all the database migrations.

`npm run db:seed` is a script written to seed the database with data from `src/db/seedDatabase.ts`, appropriate for manual testing.

`npm run db:studio` which is used to inspect the database through browser with drizzle's database studio.

`npm run dev` starts up the express server on port 3000 by default, in hot-reload mode with a served .env file.

## Testing Data
The database is seeded with testing data and on startup it contains three users and three courses: Swift, Javascript, C#.

---

The **Swift Course** contains: 3 chapters, 1 lesson each.

The **Javascript Course** contains: 4 chapters, 3 lessons each.

The **C# Course** contains: 3 chapters - 2,3,1 lessons respectively.

---

**User 1** has not completed any lessons yet and is useful for general testing purposes.

**User 2** has cleared 2/3 Javascript Chapter 1 lessons, and 1/2 C# Chapter 1 lessons. This user is on the way to accomplish the 5 global lessons achievement.

**User 3** has completed the entire Swift course (3 chapters) and the first chapter from the Javascript course. In addition, they have cleared 2/3 lessons in the second Javascript course. This user has accomplished the Swift achievement, 5 lessons achievement, and is set up to clear Javascript Chapter 2 Lesson 3, in order to accomplish the 5 chapters achievement. Clearing more Javascript or C# lessons will yield those course acheivements as well.
