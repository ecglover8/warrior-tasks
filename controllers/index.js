//require all dependencies
const express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var Searches = require("../models/searches");
var Tasks = require("../models/tasks");

// RENDERING ROUTES
// render home page
router.get("/", (req, res) => {
    Searches.find().sort({ dtg: -1 }).limit(10).exec((err, terms) => {
        if (err) throw err;
        res.render("index", {
            terms: terms
        });
    });
});
// search using one of the blue buttons
router.get("/search/:arg", (req, res) => {
    var squery1 = new RegExp(req.params.arg, "i");
    var squery2 = { task: squery1 };
    Tasks.find(squery2, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        res.render("warrior", {
            data: data,
            top: "Your search for “" + req.params.arg + "” returned " + data.length + " results."
        });
    });
});
// search using the input textbox
router.post("/search", (req, res) => {
    var newSearch = Searches({
        searchstring: req.body.searchquery,
        dtg: new Date()
    });
    newSearch.save((err) => {
        if (err) throw err;
    });
    var squery1 = new RegExp(req.body.searchquery, "i");
    var squery2 = { task: squery1 };
    Tasks.find(squery2, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        res.render("warrior", {
            data: data,
            top: "Your search for “" + req.body.searchquery + "” returned " + data.length + " results."
        });
    });
});
// export all methods to the rest of the app
module.exports = router;