import { empty } from "../database/config.js";

import {
  Response,
  catchAsync,
  authRoute,
  express,
  adminRoute,
} from "./route_helpers.js";

import authRouter from "./auth.js";
import usersRouter from "./users/root.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.get(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    res.status(200).json("CONNECTED!");
  })
);

router.get(
  "/empty",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    res.json(await empty());
    console.warn("Database cleared");
  })
);

// TODO: REMOVE FOR SAFETY
router.get(
  "/demo",
  catchAsync(async (req, res) => {
    res.json(await empty());
    console.warn("Database cleared");
  })
);

export default router;
