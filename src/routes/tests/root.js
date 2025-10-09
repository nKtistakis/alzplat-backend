import ClientError from "../../helpers/client_error.js";
import {
  Patient,
  Question,
  Test,
  TestDoctorPatient,
} from "../../schemas/index.schemas.js";
import {
  Response,
  catchAsync,
  authRoute,
  adminRoute,
  express,
} from "../route_helpers.js";

import crudRouter from "./crud.js";

const router = express.Router();
router.use("/", crudRouter);

router.get(
  "/assigned",
  authRoute,
  catchAsync(async (req, res) => {
    const assignedTests = await TestDoctorPatient.find({
      doctor: { _id: req.doctorID },
    })
      .populate("patient")
      .populate("test")
      .populate("status");
    res.json(new Response(assignedTests));
  })
);

router.post(
  "/new",
  authRoute,
  catchAsync(async (req, res) => {
    const incomingTest = req.body.test;

    const questions = incomingTest.questions;
    incomingTest.questions = [];
    // Save all the questions to the DB first
    for (const question of questions) {
      question.category = question.category._id;

      const newQuestion = await new Question(question).save();
      incomingTest.questions.push(newQuestion._id);
    }

    const newTest = new Test(incomingTest);
    // const newTest.questions = savedQuestionsIDs;
    newTest.doctor_id = req.doctorID;
    res.json(new Response(await newTest.save()));
  })
);

router.post(
  "/assign",
  authRoute,
  catchAsync(async (req, res) => {
    const test = await Test.findById(req.body.test_id);
    const patient = await Patient.findById(req.body.patient_id);

    if (!test || !patient)
      throw new ClientError("No Test or Patient found with specified IDs", 404);

    const newAssignment = new TestDoctorPatient({
      test: test._id,
      doctor: req.doctorID,
      patient: patient._id,
      name: test.name,
      startDate: Date.now(),
      endDate: req.endDate,
      timer: Number,
      stopwatch: Number,
    });

    if (timer) {
      newAssignment.timer = req.body.timer;
    } else if (stopwatch) {
      newAssignment.stopwatch = req.body.stopwatch;
    }

    res.json(new Response(await newTest.save()));
  })
);

export default router;
