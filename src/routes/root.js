import { empty } from "../database/config.js";

import {
  Response,
  catchAsync,
  authRoute,
  express,
  adminRoute,
} from "./route_helpers.js";

import authRouter from "./auth.js";
import doctorsRouter from "./doctors/root.js";
import patientsRouter from "./patients/root.js";
import healthStructuresRouter from "./health_structures/root.js";
import conditionsRouter from "./conditions/root.js";
import questionsRouter from "./questions/root.js";
import questionCategoriesRouter from "./question_categories/root.js";
import testDoctorPatientsRouter from "./test_doctor_patients/root.js";
import testsRouter from "./tests/root.js";

import addDemoEntries from "../helpers/add_demo_entries.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/doctors", doctorsRouter);
router.use("/patients", patientsRouter);
router.use("/health_structures", healthStructuresRouter);
router.use("/conditions", conditionsRouter);
router.use("/questions", questionsRouter);
router.use("/question_categories", questionCategoriesRouter);
router.use("/test_doctor_patients", testDoctorPatientsRouter);
router.use("/tests", testsRouter);

router.get(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    res.status(200).json("CONNECTED!");
  })
);

router.get(
  "/empty",
  // authRoute,
  // adminRoute,
  catchAsync(async (req, res) => {
    res.json(await empty());
    console.warn("Database cleared");
  })
);

// TODO: REMOVE FOR SAFETY
router.post(
  "/demo",
  catchAsync(async (req, res) => {
    res.json(await addDemoEntries());
  })
);

export default router;
