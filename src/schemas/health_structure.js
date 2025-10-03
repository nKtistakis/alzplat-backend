import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: String,
  streetNumber: String,
  city: String,
  country: String,
  zip: String,
});

const ContactSchema = new mongoose.Schema({
  phone: String,
  email: String,
});

const healthStructureSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: AddressSchema,
    contact: ContactSchema,
    doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

healthStructureSchema.statics.testHealthStructure = function () {
  return new HealthStructure(DEMO_ENTRIES.HEALTH_STRUCTURE);
};

const HealthStructure = mongoose.model(
  "HealthStructure",
  healthStructureSchema
);

export default HealthStructure;
