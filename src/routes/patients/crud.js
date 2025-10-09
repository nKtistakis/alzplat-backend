import ClientError from "../../helpers/client_error.js";
import { Patient } from "../../schemas/index.schemas.js";

import {
  Response,
  catchAsync,
  authRoute,
  adminRoute,
  express,
  query,
  patch,
} from "../route_helpers.js";

const router = express.Router();
router.get(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    if (req.role !== "admin") {
      req.query.doctor_id = req.doctorID;
    }
    res.json(new Response(await query(Patient, req)));
  })
);

router.post(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let patients = req.body;
    patients = [].concat(patients ?? []);
    // Ensure input is an array

    for (const patient of patients) {
      result.push((await new Patient(patient).save())._id);
    }
    res.json(new Response({ saved: result }));
  })
);

router.patch(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    const queryID = req.query.id;
    const updateFields = req.body;

    if (!queryID ?? !updateFields)
      throw new ClientError(
        "Provide a valid id query param and a valid body to update the model by."
      );

    res.json(new Response(await patch(Patient, queryID, updateFields)));
  })
);

router.delete(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    const query = req.query;

    const deleted = await Patient.deleteMany(query);
    res.json(new Response(deleted));
  })
);

export default router;
