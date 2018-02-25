const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var searchesSchema = new Schema({
    searchstring: { type: String, required: true },
    dtg: { type: Date, required: true }
}, { collection: "searches" });

var Searches = mongoose.model("Searches", searchesSchema);

module.exports = Searches;
