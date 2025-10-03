import mongoose from "mongoose";

const DEMO_ENTRIES = {
  USER: {
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
    patients: ["68df9f411f45610f58e48892"],
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
    name: "Alzheimer"
  }
};
