import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {} from "dotenv/config";
import cors from "cors";

import rootRouter from "./src/routes/root.js";

import { empty, initDbConnection } from "./src/database/config.js";
import { errorHandlerMiddleware } from "./src/routes/route_helpers.js";
import mongoose from "mongoose";
import Doctor from "./src/schemas/doctor.js";
import Patient from "./src/schemas/patient.js";
import Test from "./src/schemas/test.js";
import Question from "./src/schemas/question.js";
import QuestionCategory from "./src/schemas/question_category.js";
import addDemoEntries from "./src/helpers/add_demo_entries.js";
import TestDoctorPatient from "./src/schemas/test_doctor_patient.js";
import Status from "./src/schemas/status.js";
import HealthStructure from "./src/schemas/health_structure.js";

const app = express();
var corsOptions = {
  credentials: true,
  // Split is required to convert env string to array of strings
  origin: process.env.CORS_ALLOWED_ORIGINS.split(","),
};

app.use(cors(corsOptions));

// Unfourtunalty this check is needed to not include jsoned request body to the stripe's webhook
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl === "/invoices/stripe/webhook") {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", rootRouter);

app.use((err, req, res, next) => {
  errorHandlerMiddleware(err, res);
});

// ---------------------------------STARTUP CHECKS--------------------------------
async function laucnhServer() {
  const PORT = process.env.EXPRESS_PORT || 8080;

  // This while ensures a persistant loop on startup until the db connection is established
  while (!(await initDbConnection())) {}

  if (
    Doctor.countDocuments()
      .exec()
      .then((count) => count === 0)
  ) {
    console.log("No doctors found in DB, will add demo entries...");
    await addDemoEntries();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
laucnhServer();

// ---------------------------------STARTUP CHECKS--------------------------------

// console.log(await QuestionCategory.find());
// console.log(await Status.find());
// console.log(await Status.find());
// console.log(await Test.find());
// console.log(await Question.findById("68e6a13b7c2cfb3f4a0cc56b"));
// console.log(await Question.find());
// console.log(await Patient.find({ doctor_id: "68df9f411f45610f58e48892" }));
// console.log(await TestDoctorPatient.find().populate("test"));
let a = await TestDoctorPatient.find()
  .populate({
    path: "test",
    populate: { path: "questions", populate: { path: "category" } },
  })
  .populate("patient")
  .populate("status");
a = a.findLast((e) => e._id).toObject();
console.log(a.test.questions);

// console.log(await Status.findById("68e00b2f4f4c3b4f5c8b5678"));
// console.log(await HealthStructure.find());
