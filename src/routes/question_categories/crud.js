import ClientError from "../../helpers/client_error.js";
import { QuestionCategory } from "../../schemas/index.schemas.js";

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
      req.query._id = req.questionsCategoryID;
    }
    res.json(new Response(await query(QuestionCategory, req)));
  })
);

router.post(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let questionsCategories = req.body;
    questionsCategories = [].concat(questionsCategories ?? []);
    // Ensure input is an array

    for (const questionsCategory of questionsCategories) {
      result.push((await new QuestionCategory(questionsCategory).save())._id);
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

    res.json(
      new Response(await patch(QuestionCategory, queryID, updateFields))
    );
  })
);

router.delete(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    const query = req.query;
    res.json(new Response(await QuestionCategory.deleteMany(query)));
  })
);

export default router;
