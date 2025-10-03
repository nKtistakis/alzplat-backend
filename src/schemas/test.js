import mongoose from "mongoose";

const TestSchema = new Schema({
  testName: String,
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

TestSchema.statics.testTest = function () {
  return new Test(DEMO_ENTRIES.TEST);
};

const Test = mongoose.model("Test", TestSchema);

export default Test;
