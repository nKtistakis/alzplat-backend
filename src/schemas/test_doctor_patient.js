import mongoose from "mongoose";

const TestDoctorPatientSchema = new Schema({
  test: { type: Schema.Types.ObjectId, ref: "Test", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  name: String,
  status: { type: Schema.Types.ObjectId, ref: "Status" },
  startDate: Date,
  endDate: Date,
  notes: String,
  results: [{ type: Schema.Types.ObjectId, ref: "TestResult" }],
});

TestDoctorPatientSchema.statics.testTestDoctorPatient = function () {
  return new TestDoctorPatient(DEMO_ENTRIES.TEST_DOCTOR_PATIENT);
};

const TestDoctorPatient = mongoose.model(
  "TestDoctorPatient",
  TestDoctorPatientSchema
);

export default TestDoctorPatient;
