import ClientError from "../../helpers/client_error.js";
import { Status } from "../../schemas/index.schemas.js";

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
      req.query._id = req.statusID;
    }
    res.json(new Response(await query(Status, req)));
  })
);

router.post(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let statuses = req.body;
    statuses = [].concat(statuses ?? []);
    // Ensure input is an array

    for (const status of statuses) {
      result.push((await new Status(status).save())._id);
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

    res.json(new Response(await patch(Status, queryID, updateFields)));
  })
);

router.delete(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    const query = req.query;
    res.json(new Response(await Status.deleteMany(query)));
  })
);

export default router;
