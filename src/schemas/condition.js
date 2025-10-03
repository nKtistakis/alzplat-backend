import mongoose from "mongoose";

const ConditionSchema = new Schema({
  name: String,
});

ConditionSchema.statics.testCondition = function () {
  return new Condition(DEMO_ENTRIES.CONDITION);
};

const Condition = mongoose.model("Condition", ConditionSchema);

export default Condition;
