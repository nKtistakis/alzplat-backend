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

const PatientSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: String,
  address: AddressSchema,
  contact: ContactSchema,
  doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  conditions: [{ type: Schema.Types.ObjectId, ref: "Condition" }],
});

PatientSchema.statics.testPatientnt = function () {
  return new Patient(DEMO_ENTRIES.PATIENT);
};

const Patient = mongoose.model("Patient", PatientSchema);

export default Patient;
