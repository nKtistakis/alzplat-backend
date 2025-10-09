import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const QuestionCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  files: Boolean,
});

QuestionCategorySchema.statics.testQuestionCategory = function () {
  return new QuestionCategory(DEMO_ENTRIES.QUESTION_CATEGORY);
};

QuestionCategorySchema.statics.initialCategories = async function () {
  const multiple = new QuestionCategory({
    name: "Multiple Choice",
    code: "MULTIPLE-CHOICE",
    files: false,
  });

  const essay = new QuestionCategory({
    name: "Essay",
    code: "ESSAY",
    files: false,
  });

  const audio = new QuestionCategory({
    name: "Audio Memory",
    code: "AUDIO-MEMORY",
    files: false,
  });

  const image = new QuestionCategory({
    name: "Image Description",
    code: "IMAGE-DESCRIPTION",
    files: false,
  });

  const pairs = new QuestionCategory({
    name: "Memory Pairs",
    code: "MEMORY-PAIRS",
    files: false,
  });

  await QuestionCategory.bulkSave([multiple, essay, audio, image, pairs]);

  return new QuestionCategory(DEMO_ENTRIES.QUESTION_CATEGORY);
};

const QuestionCategory = mongoose.model(
  "QuestionCategory",
  QuestionCategorySchema
);

export default QuestionCategory;
