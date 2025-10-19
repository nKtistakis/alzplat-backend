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
    let query = { doctor: { _id: req.doctorID } };
    let assignedTests;
    if (req.query._id) {
      query._id = req.query._id;

      // ----------------

      assignedTests = await TestDoctorPatient.findOne(query)
        .populate({
          path: "test",
          populate: { path: "questions", populate: { path: "category" } },
        })
        .populate("patient")
        .populate("status");
    } else {
      assignedTests = await TestDoctorPatient.find(query)
        .populate({
          path: "test",
          populate: { path: "questions", populate: { path: "category" } },
        })
        .populate("patient")
        .populate("status");
    }
    res.json(new Response(assignedTests));
    // ----------------
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
      delete question._id;

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
    const test = await Test.findById(req.body.testId);
    const patient = await Patient.findById(req.body.patientId);

    if (!test || !patient)
      throw new ClientError("No Test or Patient found with specified IDs", 404);

    const newAssignment = new TestDoctorPatient({
      test: test._id,
      doctor: req.doctorID,
      patient: patient._id,
      name: test.name,
      startDate: Date.now(),
      endDate: new Date(Date.now() + req.body.validDays * 24 * 60 * 60 * 1000),
    });

    if ((req.body.timerType = "timer")) {
      newAssignment.timer = req.body.timerValue;
    } else if (req.body.timerType === "stopwatch") {
      newAssignment.stopwatch = req.body.timerValue;
    }

    res.json(new Response(await newAssignment.save()));
  })
);

router.post(
  "/submit-answer",
  authRoute,
  catchAsync(async (req, res) => {
    const assignedTest = await TestDoctorPatient.findById(req.body._id);
    console.log(assignedTest.results.answers);

    if (assignedTest.status.toString() === "68e00b2f4f4c3b4f5c8b5678") {
      assignedTest.status = "68ee8739935d59670736b1ac"; // Change status to "IN-PROGRESS"
      await assignedTest.save();
    }

    if (!assignedTest) {
      throw new ClientError("Assigned test not found", 404);
    }

    const { question, answer } = req.body;

    assignedTest.results = assignedTest.results || {};
    assignedTest.results.answers = assignedTest.results.answers || [];

    // Find index of existing answer for the question
    const idx = assignedTest.results.answers.findIndex(
      (entry) => entry.question?.toString() === question
    );

    if (idx !== -1) {
      // Replace the answer for the existing question
      assignedTest.results.answers[idx].answer = answer;
    } else {
      // Add new question/answer pair
      assignedTest.results.answers.push({ question, answer });
    }

    res.json(new Response(await assignedTest.save()));
  })
);

router.post(
  "/submit",
  authRoute,
  catchAsync(async (req, res) => {
    const assignedTest = await TestDoctorPatient.findById(req.body._id);

    if (!assignedTest) {
      throw new ClientError("Assigned test not found", 404);
    }

    if (assignedTest.status.toString() === "68ee8739935d59670736b1ac") {
      assignedTest.status = "68ee874c170d4f45459cd0bf"; // Change status to "COMPLETED"
      await assignedTest.save();
    } else {
      throw new ClientError("Cannot submit test that was not started!", 400);
    }

    res.json(new Response(await assignedTest.save()));
  })
);

router.post(
  "/score",
  authRoute,
  catchAsync(async (req, res) => {
    const assignedTest = await TestDoctorPatient.findById(req.body._id);
    console.log(req.body);

    if (!assignedTest) {
      throw new ClientError("Assigned test not found", 404);
    }

    if (assignedTest.status.toString() !== "68ee874c170d4f45459cd0bf") {
      throw new ClientError("Cannot score test as it not yet completed.", 400);
    }

    assignedTest.results.scorePercent = req.body.scorePercent;
    assignedTest.results.notes = req.body.notes;

    await assignedTest.save();
    res.json(new Response(await assignedTest.save()));
  })
);

export default router;
