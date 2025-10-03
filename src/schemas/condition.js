import mongoose from "mongoose";
import DEMO_ENTRIES from "../helpers/DEMO_ENTRIES.js";

const ConditionSchema = new mongoose.Schema({
  name: String,
});

ConditionSchema.statics.testCondition = function () {
  return new Condition(DEMO_ENTRIES.CONDITION);
};

const Condition = mongoose.model("Condition", ConditionSchema);

export default Condition;
