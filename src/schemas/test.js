import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const TestSchema = new mongoose.Schema({
  name: String,
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  ],
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
});

TestSchema.statics.testTest = function () {
  return new Test(DEMO_ENTRIES.TEST);
};

const Test = mongoose.model("Test", TestSchema);

export default Test;
