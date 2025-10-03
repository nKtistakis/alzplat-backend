import mongoose from "mongoose";

const TestResultSchema = new Schema({
  testDoctorPatient: {
    type: Schema.Types.ObjectId,
    ref: "TestDoctorPatient",
    required: true,
  },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  mark: String,
});

TestResultSchema.statics.testTestResult = function () {
  return new TestResult(DEMO_ENTRIES.TEST_RESULT);
};

const TestResult = mongoose.model("TestResult", TestResultSchema);

export default TestResult;
