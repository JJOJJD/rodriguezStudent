const GenericModel = require("../models/genericModel");
const config = require("../config/entityConfig");

class GenericController {
  async getAll(req, res) {
    try {
      const items = await GenericModel.find();
      const response = items.map(item => {
        const obj = item.toObject();
        return config.calculations.onItem(obj);
      });
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getListCalculation(req, res) {
    try {
      const items = await GenericModel.find();
      const rawObjects = items.map(item => item.toObject());
      const response = config.calculations.onList(rawObjects);
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const idParam = req.params.id;
      let item;
      if (!isNaN(idParam)) {
        item = await GenericModel.findOne({ id: Number(idParam) });
      } else {
        item = await GenericModel.findById(idParam);
      }
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      const obj = item.toObject();
      res.json(config.calculations.onItem(obj));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const lastItem = await GenericModel.findOne().sort({ id: -1 });
      const nextId = lastItem && lastItem.id ? lastItem.id + 1 : 1;
      const itemData = { id: nextId };
      for (const fieldName of Object.keys(config.fields)) {
        if (fieldName !== "id" && req.body[fieldName] !== undefined) {
          if (config.fields[fieldName].type === "Number") {
            itemData[fieldName] = Number(req.body[fieldName]);
          } else {
            itemData[fieldName] = req.body[fieldName];
          }
        }
      }
      const item = new GenericModel(itemData);
      const newItem = await item.save();
      const obj = newItem.toObject();
      res.status(201).json(config.calculations.onItem(obj));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const idParam = req.params.id;
      let item;
      if (!isNaN(idParam)) {
        item = await GenericModel.findOne({ id: Number(idParam) });
      } else {
        item = await GenericModel.findById(idParam);
      }
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      for (const fieldName of Object.keys(config.fields)) {
        if (fieldName !== "id" && req.body[fieldName] !== undefined) {
          if (config.fields[fieldName].type === "Number") {
            item[fieldName] = Number(req.body[fieldName]);
          } else {
            item[fieldName] = req.body[fieldName];
          }
        }
      }
      const updatedItem = await item.save();
      const obj = updatedItem.toObject();
      res.json(config.calculations.onItem(obj));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const idParam = req.params.id;
      let deletedItem;
      if (!isNaN(idParam)) {
        deletedItem = await GenericModel.findOneAndDelete({ id: Number(idParam) });
      } else {
        deletedItem = await GenericModel.findByIdAndDelete(idParam);
      }
      if (!deletedItem) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new GenericController();
