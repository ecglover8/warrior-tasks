//require all dependencies
const express = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var router = express.Router();
var Tasks = require("../models/tasks");

// RENDERING ROUTES
// render page with list of all tasks
router.get("/", (req, res) => {
    Tasks.find({}, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        res.render("warrior", {
            data: data,
            top: ""
        });
    });
});
// render page with list of tasks by proponent
router.get("/proponent/:arg", (req, res) => {
    var query = new RegExp(req.params.arg + "-", "g");
    Tasks.find({ number: { $regex: query }}, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            res.render("warrior", {
                data: data,
                top: "There are " + data.length + " tasks associated with proponent " + req.params.arg
            });
        } else {
            res.render("nomatch");
        }
    });
});
// render page with list of tasks by subject area
router.get("/subject/:arg", Subject, (req, res) => {
    Tasks.find({ subject: req.params.arg }, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            res.render("warrior", {
                data: data,
                top: "There are " + data.length + " tasks associated with Subject Area " + req.params.arg + ": " + req.query
            });
        } else {
            res.render("nomatch");
        }
    });
});
// render page with list of tasks by battle drill
router.get("/battledrill/:arg", Battle, (req, res) => {
    Tasks.find({ battle: req.query }, { task: 1, number: 1 }).exec((err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            res.render("warrior", {
                data: data,
                top: "There are " + data.length + " tasks associated with Battle Drill #" + req.query
            });
        } else {
            res.render("nomatch");
        }
    });
});
// render page with all info about a certain task
router.get("/:arg", (req, res) => {
    Tasks.find({ number: req.params.arg }, { conditions: 1, standards: 1, steps: 1, task: 1 }).exec((err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            data = Array.from(data);
            res.render("task", {
                data: data
            });
        } else {
            res.render("nomatch");
        }
    });
});

// get battle drill number even if name is given
function Battle(req, res, next) {
    switch (req.params.arg) {
        case "1":
        case "react-to-contact":
            req.query = 1;
            break;
        case "2":
        case "establish-security-at-the-halt":
            req.query = 2;
            break;
        case "3":
        case "perform-tactical-combat-casualty-care":
            req.query = 3;
            break;
        case "4":
        case "react-to-ambush-near":
            req.query = 4;
            break;
        case "5":
        case "react-to-ambush-far":
            req.query = 5;
            break;
        default:
            req.query = "";
            break;
    }
    return next();
}
// get subject area name
function Subject(req, res, next) {
    switch (req.params.arg) {
        case "1":
            req.query = "Shoot/Maintain, Employ, and Engage Targets with Individually Assigned Weapon System";
            break;
        case "2":
            req.query = "Shoot/Employ Hand Grenades";
            break;
        case "3":
            req.query = "Move / Perform Individual Movement Technique";
            break;
        case "4":
            req.query = "Communicate";
            break;
        case "5":
            req.query = "Survive";
            break;
    }
    return next();
}
// export all methods to the rest of the app
module.exports = router;