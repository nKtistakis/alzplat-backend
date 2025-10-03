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

export default async function addDemoEntries() {
  await Doctor.testDoctor().save();
  await Condition.testCondition().save();
  await HealthStructure.testHealthStructure().save();
  await Patient.testPatientnt().save();
  await Question.testQuestion().save();
  await QuestionCategory.testQuestionCategory().save();
  await Status.testStatus().save();
  await Test.testTest().save();
  await TestDoctorPatient.testTestDoctorPatient().save();

  console.log("Demo entries added.");
}
