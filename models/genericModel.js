const mongoose = require("mongoose");
const config = require("../config/entityConfig");

const typeMapping = {
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date
};

const schemaDefinition = {};
for (const [key, value] of Object.entries(config.fields)) {
  schemaDefinition[key] = {
    type: typeMapping[value.type],
    unique: !!value.unique,
    required: !!value.required
  };
}

const genericSchema = new mongoose.Schema(schemaDefinition, { collection: config.collection });

genericSchema.pre("save", function() {
  config.validate(this);
  config.calculations.onSave(this);
});

module.exports = mongoose.model(config.name, genericSchema);
