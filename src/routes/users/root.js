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

// WARNING! WILL DELETE ALL USER'S DATA !!!ALONG!!! WITH ANY ASSOSIATED REVIEWS, LOCATIONS & THEIR ATTRIBUTES!!!!
router.delete(
  "/account",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    res.json(new Response("tight"));
  })
);

export default router;
