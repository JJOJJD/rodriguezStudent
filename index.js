const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const port = process.env.PORT || 3014;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  process.exit(1);
}

const config = require("./config/entityConfig");
const GenericModel = require("./models/genericModel");

mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    const count = await GenericModel.countDocuments();
    if (count === 0) {
      const dataPath = path.join(__dirname, config.seedDataPath);
      const fileData = fs.readFileSync(dataPath, "utf8");
      const initialData = JSON.parse(fileData);
      for (const item of initialData) {
        const doc = new GenericModel(item);
        await doc.save();
      }
      console.log("Database seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
});

app.use(express.json());
const cors = require("cors");
app.use(cors());

const genericRoutes = require("./routes/genericRoutes");
app.use(config.apiPrefix, genericRoutes);
app.get("/", (req, res) => {
  res.json({ message: `${config.name} API is running` });
});

app.listen(port, () => console.log("Server is running on port " + port));
