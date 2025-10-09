import { isValidObjectId } from "mongoose";
import ClientError from "../../helpers/client_error.js";
import { Question, Test } from "../../schemas/index.schemas.js";

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

    if (req.query._id) {
      res.json(
        new Response(
          await Test.findById(req.query._id).populate({
            path: "questions",
            populate: { path: "category" },
          })
        )
      );
    } else {
      res.json(new Response(await query(Test, req)));
    }
  })
);

router.post(
  "/",
  authRoute,
  adminRoute,
  catchAsync(async (req, res) => {
    let result = [];
    let Test = req.body;
    Test = [].concat(Test ?? []);
    // Ensure input is an array

    for (const Test of Test) {
      result.push((await new Test(Test).save())._id);
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

    const questions = updateFields.questions;
    updateFields.questions = [];

    for (const question of questions) {
      let { _id, __v, ...cleanedQuestion } = question; // remove them

      if (!isValidObjectId(_id)) {
        _id = (await new Question(cleanedQuestion).save()).id;
      } else {
        await patch(Question, _id, cleanedQuestion).catch((e) => {});
      }
      updateFields.questions.push(_id);
    }

    res.json(new Response(await patch(Test, queryID, updateFields)));
  })
);

router.delete(
  "/",
  authRoute,
  catchAsync(async (req, res) => {
    if (!req.query._id)
      throw new ClientError(
        "Provide a valid id query param to delete the model by."
      );

    const deletedTest = await Test.findOneAndDelete({
      _id: req.query._id,
      doctor_id: req.doctorID,
    });
    if (deletedTest) {
      for (const questionID of deletedTest.questions) {
        await Question.deleteOne({ _id: questionID });
      }
    }

    res.json(new Response("Deleted successfully"));
  })
);

export default router;
