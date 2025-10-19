# AlzPlat — Backend

Documentation for the API of AlzPlat project.

## Overview

Express + Mongoose API that manages doctors, patients, tests, questions and test assignments. Includes JWT auth, file uploads (uploads/), and a demo-data population helper.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or remote)

## Install

1. Make `sure docker` & `docker compose` is installed

2. Install dependencies:
   ```
   npm install
   ```

## Run

- Dev (Start only the API, no docker compose implementation - Great if you want to test some changes fast):
  ```
  npm start
  ```
- Prod (Start both mongoDB and the API - command `docker compose` might be `docker-compose` depending on your version of compose):
  ```
  docker compose up -d
  ```

### Requirments

- Dev: You will need to configure the MONGO_URI variable to localhost
- Prod: You will need to configure the MONGO_URI variable to mongo (this is the docker container's name of the mongodb)

Above name changing is needed as MongoDB will run as a container. If the API is also a docker container, then it can only access MongoDB container only with its hostname.

NOTE THAT API WILL NOT WORK START WITHOUT AN ACTIVE DATABASE CONNECTION (Check startup logs for details)

## Populate initial/demo data

The project includes `src/helpers/add_demo_entries.js` (aka populateDb). It will create demo entries only when collections are empty. It inspects schema statics (e.g. `testQuestion`, `initialCategories`, etc.) and runs available initializers.

This will run in 2 occurances:

- On Startup:
  If no Doctors exists on DB it will try and add all of the test data
- Manually:
  Perform request POST /demo

## Uploads / Question images

### TODO

## Auth

- JWT-based auth located in `src/auth/` (`jwt.js`, `middleware.js`).
- Protect routes with auth middleware (uses `Authorization: Bearer <token>`).
- Tokens are generated/verified by functions in `src/auth/jwt.js`.
- Tokens are saved in client's cookies with a coded name

### Note!!

Every request is user(doctor) scoped. Meaning that a request will always include the doctor ID in it (encoded in the JWT) so one doctor cannot access another doctor's information. See each request for more details.

## Routes (high level)

Routes live in `src/routes/`. Main groups:

- /auth — login / token
- /tests — CRUD + custom:
  - POST /tests/new — create a test and its questions (questions are saved first)
  - POST /tests/assign — assign test to patient
    - body: { testId, patientId, validDays, timerType, timerValue }
    - validDays is an integer; endDate = startDate + validDays days
  - GET /tests/assigned[?_id=...] — list assigned tests (doctor-scoped)
  - POST /tests/submit-answer — save or update an answer
    - body: { \_id: "<TestDoctorPatientId>", question: "<QuestionId>", answer: "<value>" }
    - Behavior: replace answer when question exists; otherwise push new entry
  - POST /tests/submit — finalize a test
  - POST /tests/score — set results.scorePercent and results.notes
- /questions, /question_categories, /patients, /doctors, /health_structures, /conditions, /statuses, /test_doctor_patients — CRUD routers (see each folder for specifics)

Standard CRUD pattern (via `crud.js`):

- GET /resource
- GET /resource/:id
- POST /resource
- PUT /resource/:id
- DELETE /resource/:id

## Troubleshooting

- Check console logs for route debug output.
- Confirm JWT_SECRET and MONGO_URI values.
