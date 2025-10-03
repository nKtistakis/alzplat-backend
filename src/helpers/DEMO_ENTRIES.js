import mongoose from "mongoose";

const DEMO_ENTRIES = {
  DOCTOR: {
    _id: "68df9f411f45610f58e48892",
    credentials: {
      username: "test",
      password: "1",
    },
    name: "Certified Debugger",
    address: {
      street: "Alzplat Str.",
      streetNumber: "13",
      city: "NYC",
      country: "USA",
      zip: "CF239FB",
    },
    contact: { phone: "00306969695832", email: "certdebug@alzplat.com" },
    speciality: "UNIT Tester",
    // TODO ADD SOME IDS!
    patients: ["68e0102972285cbbb7068163"],
    healthStructure: "68dfadf323bf8027cb664300",
  },
  // ---------------------------------------------------------
  HEALTH_STRUCTURE: {
    _id: new mongoose.Types.ObjectId("68dfadffcca72c727d56bc09"),
    name: "AlzPlat HQ",
    address: {
      street: "Alzplat Str.",
      streetNumber: "13",
      city: "NYC",
      country: "USA",
      zip: "CF239FB",
    },
    contact: { phone: "00302109695832", email: "info@alzplat.com" },
    doctors: ["68df9f411f45610f58e48892"],
  },
  CONDITION: {
    _id: new mongoose.Types.ObjectId("68dff50246440534870a442d"),
    name: "Alzheimer",
  },

  PATIENT: {
    _id: new mongoose.Types.ObjectId("68e0102972285cbbb7068163"),
    name: "John Doe",
    address: {
      street: "Alzplat Str.",
      streetNumber: "13",
      city: "NYC",
      country: "USA",
      zip: "CF239FB",
    },
    contact: { phone: "00302109695832", email: "j.doe@alzplat.com" },
    doctor: "68df9f411f45610f58e48892",
    conditions: ["68dff50246440534870a442d"],
  },
  QUESTION: {
    _id: new mongoose.Types.ObjectId("68e00a4f4f4c3b4f5c8b4567"),
    description: "What is 2 + 2?",
    category: new mongoose.Types.ObjectId("68e00a4f4f4c3b4f5c8b1234"),
    answer: "4",
    guides: "It's basic math!",
  },
  QUESTION_CATEGORY: {
    _id: new mongoose.Types.ObjectId("68e00a4f4f4c3b4f5c8b1234"),
    name: "Math",
    files: false,
  },
  STATUS: {
    _id: new mongoose.Types.ObjectId("68e00b2f4f4c3b4f5c8b5678"),
    code: "PENDING",
    name: "Pedning",
  },
  TEST: {
    _id: new mongoose.Types.ObjectId("68e00c3f4f4c3b4f5c8b6789"),
    testName: "Mini-Mental State Examination",
    questions: ["68e00a4f4f4c3b4f5c8b4567"],
    results: { scorePercent: 85, comments: "Good cognitive function." },
  },
  TEST_DOCTOR_PATIENT: {
    _id: new mongoose.Types.ObjectId("68e00d4f4f4c3b4f5c8b7890"),
    test: "68e00c3f4f4c3b4f5c8b6789",
    doctor: "68df9f411f45610f58e48892",
    patient: "68e0102972285cbbb7068163",
    name: "Initial Assessment",
    status: "68e00b2f4f4c3b4f5c8b5678",
    startDate: new Date("2023-01-01T10:00:00Z"),
    endDate: new Date("2023-01-01T10:30:00Z"),
    results: { scorePercent: 85, notes: "Patient performed well." },
  },
};
export default DEMO_ENTRIES;
