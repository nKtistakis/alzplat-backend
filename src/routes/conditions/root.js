import ClientError from "../../helpers/client_error.js";
import Condition from "../../schemas/condition.js";
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

// WARNING! WILL DELETE ALL DOCTOR'S DATA !!!ALONG!!! WITH ANY ASSOSIATED REVIEWS, LOCATIONS & THEIR ATTRIBUTES!!!!
router.post(
  "/new",
  authRoute,
  catchAsync(async (req, res) => {
    if (!req.body)
      throw new ClientError(
        "Provide a valid id query param and a valid body to update the model by."
      );
    const newCondition = new Condition(req.body);
    newCondition.doctor = req.doctorID;

    const conditions = await Condition.find({
      name: newCondition.name,
      doctor: newCondition.doctor,
    });
    if (conditions.length > 0) {
      throw new ClientError(
        "Condition with that name already exists for this doctor.",
        400
      );
    }
    res.json(new Response(await newCondition.save()));
  })
);

export default router;
