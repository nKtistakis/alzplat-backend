import {
  Doctor,
  Condition,
  HealthStructure,
  Patient,
  Question,
  QuestionCategory,
  Status,
  Test,
  TestDoctorPatient,
} from "../schemas/index.schemas.js";

export default async function AddDemoEntries() {
  const tasks = [
    {
      name: "Doctor",
      model: Doctor,
      run: async () => {
        if (typeof Doctor.testDoctor === "function")
          return Doctor.testDoctor().save();
      },
    },
    {
      name: "Condition",
      model: Condition,
      run: async () => {
        if (typeof Condition.testCondition === "function")
          return Condition.testCondition().save();
      },
    },
    {
      name: "HealthStructure",
      model: HealthStructure,
      run: async () => {
        if (typeof HealthStructure.testHealthStructure === "function")
          return HealthStructure.testHealthStructure().save();
      },
    },
    {
      name: "Patient",
      model: Patient,
      run: async () => {
        // some codebases use testPatient or testPatientnt — try both
        if (typeof Patient.testPatient === "function")
          return Patient.testPatient().save();
        if (typeof Patient.testPatientnt === "function")
          return Patient.testPatientnt().save();
      },
    },
    {
      name: "Question",
      model: Question,
      run: async () => {
        if (typeof Question.testQuestion === "function")
          return Question.testQuestion().save();
      },
    },
    {
      name: "QuestionCategory",
      model: QuestionCategory,
      run: async () => {
        // initialCategories might insert multiple entries and return a promise
        if (typeof QuestionCategory.initialCategories === "function")
          return QuestionCategory.initialCategories();
      },
    },
    {
      name: "Status",
      model: Status,
      run: async () => {
        if (typeof Status.testStatus === "function")
          return Status.initialCategories();
      },
    },
    {
      name: "Test",
      model: Test,
      run: async () => {
        if (typeof Test.testTest === "function") return Test.testTest().save();
      },
    },
    {
      name: "TestDoctorPatient",
      model: TestDoctorPatient,
      run: async () => {
        if (typeof TestDoctorPatient.testTestDoctorPatient === "function")
          return TestDoctorPatient.testTestDoctorPatient().save();
      },
    },
  ];

  for (const t of tasks) {
    try {
      const exists = await t.model.countDocuments();
      if (exists === 0) {
        const result = await t.run();
        // result may be undefined if no static found, or an array, or a document
        if (result === undefined) {
          console.log(`${t.name}: no demo creator static found, skipped.`);
        } else {
          console.log(`${t.name}: demo entries created.`);
        }
      } else {
        console.log(`${t.name}: already exists, skipping.`);
      }
    } catch (err) {
      console.log(`${t.name}: failed to create demo entries — ${err.message}`);
    }
  }

  console.log("populateDb completed.");
}
