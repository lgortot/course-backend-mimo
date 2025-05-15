# Project Info & Startup
The repo contains a RESTful api server designed to be used as a backend service for the educational game detailed by the mimo backend coding challenge. This is not a fully-functional bug-free server implementation, but rather a simple design solving different problems outlined in the challenge. The tech stack includes Typescript using Express on Node, backed by the Drizzle ORM package and SQLite as database. The app contains seeded test data to assist with manual testing. 

## Startup Scripts
In order to start up the server after cloning the repo, the user should run `npm install` in order to install the node module dependencies. Once installation is complete, running the custom `npm run dev:start` script will automatically generate the sqlite database by executing the migrations and seeding it with test data before running te server on port 3000 by default. The port and database location can be configured in the `.env` file.

The server is accessible on: `http://localhost:3000/`. For usage instructions please refer to the API Endpoints section below.

_**Note:** If app was started and closed, run it again with `npm run dev` to avoid data inconsistency caused by re-seeding data - or remove the generated `sqlite.db` file._

**For development purposes, the app contains the following node scripts which can be run manually:**

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

## Api Endpoints
While the server contains five resources, the key use cases revolve around the **user** resource endpoints: `http://localhost:3000/users/`. The remaining resource endpoints are left unimplemented in the interest of time and due to lack of specification. For manual testing purposes, I have used **Postman**.

### Use case: Finish Lesson
The client app can send a `POST` request to the following endpoint: `http://localhost:3000/users/:id/finishLesson` in order to mark a lesson as complete for the user. The request must be formatted as JSON and contain the following data in body:
```
{
    "lesson_id": number,
    "started_at": date_string,
    "completed_at": date_string
}
```
All fields are mandatory. The request will be validated to check whether the lesson_id field is positive and if the other two match date formats.

**Example request**:
```
POST /users/1/finishLesson HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 95

{
    "lesson_id": 5,
    "started_at": "05.05.2022.",
    "completed_at": "12.02.2025."
}
```

The successful response should contain a JSON serialization of the created sub-resource per RESTful API standards. The location where the resource was created is omitted, as it represents a sub-resource related to the User, and as such can not be directly retreived.

### Use case: List Achievements
The client can send a `GET` request to the following endpoint: `http://localhost:3000/users/:id/achievements` to list all of the achievements the user has unlocked. Due to typo in the specification, it wasn't clear whether this was desired to be a single-resource endpoint, or whether to retreive all achievements for a user. I have decided to list all of them given the broader context of the challenge.

**Example request:**
```
GET /users/2/achievements HTTP/1.1
Host: localhost:3000
Accept: application/json
Connection: close
```

The successful response should contain a JSON-serialized list of Achievements related to the User. If an achievement is unlocked, the `progress` field will show the threshold required by the achievement. Otherwise, if an achievement is not unlocked, the `progress` will show actual current user progress towards the achievement.

**Example response snippet:**
```
[
    {
        "achievement_id": 1,
        "name": "Complete 5 lessons",
        "earned_at": "2025-05-15T06:25:34.000Z"
        "completed": true,
        "progress": 5
    },
    {
        "achievement_id": 2,
        "name": "Complete 25 lessons",
        "earned_at": null,
        "completed": false,
        "progress": 13
    },
...
```

### Other Endpoints
The server also includes functional standard RESTful api endpoints around the User resource, as defined inside `userRoutes.ts`:
```
router.get('/', controller.listUsers);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.post('/:id/finishLesson', controller.finishLesson);
router.get('/:id/achievements', controller.listAchievements);
```
