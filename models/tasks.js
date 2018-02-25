const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
    task: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    conditions: { type: String, required: true },
    standards: { type: String, required: true },
    steps: { type: [[]], required: true },
    skill: { type: Number },
    subject: { type: Number },
    battle: { type: [] }
}, { collection: "tasks" });

tasksSchema.index({ task: 1 });

var Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;

