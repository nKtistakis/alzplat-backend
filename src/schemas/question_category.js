import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const QuestionCategorySchema = new mongoose.Schema({
  name: String,
  files: Boolean,
});

QuestionCategorySchema.statics.testQuestionCategory = function () {
  return new QuestionCategory(DEMO_ENTRIES.QUESTION);
};

const QuestionCategory = mongoose.model(
  "QuestionCategory",
  QuestionCategorySchema
);

export default QuestionCategory;
