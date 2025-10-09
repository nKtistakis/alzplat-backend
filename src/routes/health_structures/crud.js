import ClientError from "../../helpers/client_error.js";
import { HealthStructure } from "../../schemas/index.schemas.js";

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
    res.json(new Response(await query(HealthStructure, req)));
  })
);

router.post(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let healthStructures = req.body;
    healthStructures = [].concat(healthStructures ?? []);
    // Ensure input is an array

    for (const healthStructure of healthStructures) {
      result.push((await new HealthStructure(healthStructure).save())._id);
    }
    res.json(new Response({ saved: result }));
  })
);

router.patch(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    const queryID = req.query.id;
    const updateFields = req.body;

    if (!queryID ?? !updateFields)
      throw new ClientError(
        "Provide a valid id query param and a valid body to update the model by."
      );

    res.json(new Response(await patch(HealthStructure, queryID, updateFields)));
  })
);

router.delete(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    const query = req.query;
    res.json(new Response(await HealthStructure.deleteMany(query)));
  })
);

export default router;
