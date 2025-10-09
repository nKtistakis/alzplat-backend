import ClientError from "../../helpers/client_error.js";
import Patient from "../../schemas/patient.js";
import TestDoctorPatient from "../../schemas/test_doctor_patient.js";
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

router.post(
  "/new",
  authRoute,
  catchAsync(async (req, res) => {
    if (!req.body?.patient) {
      throw new ClientError("Patient data must be provided");
    }

    const patient = new Patient(req.body.patient);
    patient.doctor_id = req.doctorID;
    await patient.save();

    res.json(new Response("tight"));
  })
);

router.delete(
  "/delete",
  authRoute,
  catchAsync(async (req, res) => {
    const patient_id = req.query._id;
    if (!patient_id)
      throw new ClientError(
        "Provide a valid patient _id query param to delete the patient.",
        400
      );

    await Patient.deleteOne({ _id: patient_id });
    await TestDoctorPatient.deleteMany({ patient: patient_id });

    res.json(new Response("DONE"));
  })
);

export default router;
