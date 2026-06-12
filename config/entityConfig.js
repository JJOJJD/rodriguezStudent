const entityConfig = {
  name: "Student",
  collection: "student",
  apiPrefix: "/school",
  routePath: "/students",
  fields: {
    id: { type: "Number", unique: true, required: false },
    name: { type: "String", required: true },
    email: { type: "String", required: false },
    course: { type: "String", required: false },
    subject: { type: "String", required: false },
    grade: { type: "Number", required: true },
    passed: { type: "Boolean", required: false },
    age: { type: "Number", required: false },
    gender: { type: "String", required: false }
  },
  validate(data) {
    if (data.grade < 0 || data.grade > 10) {
      throw new Error("Grade must be between 0 and 10");
    }
    if (data.age !== undefined && data.age < 0) {
      throw new Error("Age must be greater than zero");
    }
  },
  calculations: {
    onSave(data) {
      data.passed = data.grade >= 7;
    },
    onList(items) {
      const total = items.reduce((sum, item) => sum + item.grade, 0);
      const average = items.length > 0 ? total / items.length : 0;
      return items.map(item => {
        item.courseAverage = Number(average.toFixed(2));
        return item;
      });
    },
    onItem(item) {
      return item;
    }
  },
  listCalculationPath: "/average",
  seedDataPath: "./data/initialData.json",
  testMockData: {
    name: "Jane Doe Test",
    email: "jane.test@example.com",
    course: "Grade 10",
    subject: "Mathematics",
    grade: 9.5,
    age: 15,
    gender: "Female"
  },
  testUpdateMockData: {
    grade: 6.5
  }
};

module.exports = entityConfig;
