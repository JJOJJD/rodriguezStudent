const entityConfig = {
  name: "VideoGame",
  collection: "videogame",
  apiPrefix: "/store",
  routePath: "/videogames",
  fields: {
    id: { type: "Number", unique: true, required: false },
    title: { type: "String", required: true },
    genre: { type: "String", required: false },
    platform: { type: "String", required: false },
    developer: { type: "String", required: false },
    price: { type: "Number", required: true },
    rating: { type: "Number", required: true },
    worthBuying: { type: "Boolean", required: false },
    costBenefitRatio: { type: "Number", required: false }
  },
  validate(data) {
    if (data.price <= 0) {
      throw new Error("Price must be greater than zero");
    }
    if (data.rating < 1 || data.rating > 100) {
      throw new Error("Rating must be between 1 and 100");
    }
  },
  calculations: {
    onSave(data) {
      data.costBenefitRatio = Number((data.rating / data.price).toFixed(4));
      data.worthBuying = data.rating >= 70 && data.price <= 60;
    },
    onList(items) {
      items.sort((a, b) => b.costBenefitRatio - a.costBenefitRatio);
      return items.map((item, index) => {
        item.rank = 100 - index;
        return item;
      });
    },
    onItem(item) {
      return item;
    }
  },
  listCalculationPath: "/ranking",
  seedDataPath: "./data/initialData.json",
  testMockData: {
    title: "Test Game",
    genre: "Action",
    platform: "PC",
    developer: "TestDev",
    price: 50,
    rating: 80
  },
  testUpdateMockData: {
    price: 40,
    rating: 90
  }
};

module.exports = entityConfig;
