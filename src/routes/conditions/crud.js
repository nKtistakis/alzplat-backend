import ClientError from "../../helpers/client_error.js";
import Condition from "../../schemas/condition.js";
import Patient from "../../schemas/patient.js";

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
    res.json(new Response(await query(Condition, req)));
  })
);

router.post(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let conditions = req.body;
    conditions = [].concat(conditions ?? []);
    // Ensure input is an array

    for (const condition of conditions) {
      result.push((await new Condition(condition).save())._id);
    }
    res.json(new Response({ saved: result }));
  })
);

router.patch(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    const queryID = req.query._id;
    const updateFields = req.body;

    if (!queryID ?? !updateFields)
      throw new ClientError(
        "Provide a valid id query param and a valid body to update the model by."
      );

    res.json(new Response(await patch(Condition, queryID, updateFields)));
  })
);

router.delete(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    const query = req.query;

    const patient = await Patient.find({ condition: query._id });
    if (patient.length > 0) {
      throw new ClientError(
        "Cannot delete condition that is assigned to a patient.",
        403
      );
    }

    res.json(new Response(await Condition.deleteOne(query)));
  })
);

export default router;
