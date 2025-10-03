import mongoose from "mongoose";

const QuestionCategorySchema = new Schema({
  categoryCode: { type: String, required: true, unique: true },
  categoryName: String,
});

const QuestionSchema = new Schema({
  description: String,
  category: { type: Schema.Types.ObjectId, ref: "QuestionCategory" },
  answer: String,
  guides: String,
});

QuestionSchema.statics.testQuestion = function () {
  return new Question(DEMO_ENTRIES.QUESTION);
};

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
