import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const QuestionSchema = new mongoose.Schema({
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionCategory",
  },
  points: { type: Number, default: 1 },
  options: ["", ""],
  correctOption: Number,
  attachedFile: String,
  guides: String,
});

QuestionSchema.statics.testQuestion = function () {
  return new Question(DEMO_ENTRIES.QUESTION);
};

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
