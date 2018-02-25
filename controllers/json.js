//require all dependencies
const express = require("express");
var router = express.Router();
var Tasks = require("../models/tasks");

// GET METHODS TO RETURN LIST OF TASKS
// return JSON with all common tasks (name and number)
router.get("/all", (req, res) => {
    Tasks.find({}).exec((err, result) => {
        if (err) throw err;
        var response = [];
        for (var i = 0; i < result.length; i++) {
            response.push({ "task": result[i].task, "number": result[i].number });
        }
        res.json(response);
    });
});
// return JSON with all tasks by a certain proponent (name and number)
router.get("/proponent/:arg", (req, res) => {
    var query = new RegExp(req.params.arg + "-", "g");
    Tasks.find({ number: { $regex: query }}, { task: 1, number: 1 }).exec((err, result) => {
        if (err) throw err;
        var response = [];
        for (var i = 0; i < result.length; i++) {
            response.push({ "task": result[i].task, "number": result[i].number });
        }
        if (response.length > 0) {
            res.json(response);
        } else {
            res.send("No matches found.");
        }
    });
});
// return JSON with all tasks in a particular subject area (number only)
router.get("/subject/:arg", (req, res) => {
    Tasks.find({ subject: req.params.arg }).exec((err, result) => {
        if (err) throw err;
        var response = [];
        for (var i = 0; i < result.length; i++) {
            response.push({ "task": result[i].task, "number": result[i].number });
        }
        if (response.length > 0) {
            res.json(response);
        } else {
            res.send("No matches found.");
        }
    });
});
// return JSON with all tasks pertaining to a battle drill (name and number)
router.get("/battledrill/:arg", Battle, (req, res) => {
    Tasks.find({ battle: req.query }).exec((err, result) => {
        if (err) throw err;
        var response = [];
        for (var i = 0; i < result.length; i++) {
            response.push({ "task": result[i].task, "number": result[i].number });
        }
        if (response.length > 0) {
            res.json(response);
        } else {
            res.send("No matches found.");
        }
    });
});
//
// GET METHODS TO RETURN INDIVIDUAL TASKS
// return JSON name of task by number
router.get("/:arg", (req, res) => {
    var query = new RegExp("^" + req.params.arg + "$", "i");
    Tasks.findOne({ number: { $regex: query }}, { _id: 0, task: 1 }).exec((err, result) => {
        if (err) throw err;
        if (!result) {
            res.send("No matches found.");
            return;
        } else {
            res.json(result);
        }
    });
});
// return JSON TCS of task by number
router.get("/:arg/tcs", (req, res) => {
    var query = new RegExp("^" + req.params.arg + "$", "i");
    Tasks.findOne({ number: { $regex: query }}, { _id: 0, task: 1, conditions: 1, standards: 1 }).exec((err, result) => {
        if (err) throw err;
        if (!result) {
            res.send("No matches found.");
            return;
        } else {
            res.json(result);
        }
    });
});
// return JSON performance measures of task by number
router.get("/:arg/measures", (req, res) => {
    var query = new RegExp("^" + req.params.arg + "$", "i");
    Tasks.findOne({ number: { $regex: query }}, { task: 1, steps: 1 }).exec((err, result) => {
        if (err) throw err;
        if (!result) {
            res.send("No matches found.");
            return;
        }
        var response = [{ "task": result.task }];
        var steps = result.steps;
        for (var i = 0; i < steps.length; i++) {
            response.push("#" + (i+1) + ". " + steps[i][0] );
        }
        res.json(response);
    });
});
// return JSON all steps and substeps of task by number
// MOST COMPLICATED NESTED STATEMENTS IN THE ENTIRE APPLICATION
router.get("/:arg/full", (req, res) => {
    var query = new RegExp("^" + req.params.arg + "$", "i");
    Tasks.findOne({ number: { $regex: query }}, { task: 1, steps: 1 }).exec((err, result) => {
        var let1, let2;
        if (err) throw err;
        if (!result) {
            res.send("No matches found.");
            return;
        }
        var response = [{ "task": result.task }];
        var steps = result.steps;
        // enter array of steps (first level)
        for (var i = 0; i < steps.length; i++) {
            // write out major step
            response.push((i+1) + ". " + steps[i][0]);
            // check if first level has any substeps, if not then move on to next step of first level
            if (steps[i].length > 1) {
                // enter array of steps (second level)
                for (var j = 1; j < steps[i].length; j++) {
                    // convert position in array to letter value
                    let1 = String.fromCharCode(j + 96);
                    // check if second level has any substeps
                    if (Array.isArray(steps[i][j])) {
                        // write out major substep
                        response.push((i+1) + let1 + ". " + steps[i][j][0]);
                        // enter array of steps (third level)
                        for (var k = 1; k < steps[i][j].length; k++) {
                            // check if third level has any substeps
                            if (Array.isArray(steps[i][j][k])) {
                                // write out major sub-substep
                                response.push((i+1) + let1 + "(" + k + "). " + steps[i][j][k][0]);
                                // enter array of steps (fourth level)
                                for (var l = 1; l < steps[i][j][k].length; l++) {
                                    // convert position in array to letter value
                                    let2 = String.fromCharCode(l + 96);
                                    // check if fourth level has any substeps
                                    if (Array.isArray(steps[i][j][k][l])) {
                                        // write out major sub-substep
                                        response.push((i+1) + let1 + "(" + k + ")(" + let2 + "). " + steps[i][j][k][l][0]);
                                        // enter array of steps (fifth level)
                                        for (var m = 1; m < steps[i][j][k][l].length; m++) {
                                            //write out major sub-sub-substep
                                            response.push((i+1) + let1 + "(" + k + ")(" + let2 + ")(" + m + ". " + steps[i][j][k][l][m]);
                                        }
                                    } else {
                                        // if fourth level has no substeps, then write out sub-sub-substep
                                        response.push((i+1) + let1 + "(" + k + ")(" + let2 + "). " + steps[i][j][k][l]);
                                    }
                                }
                            } else {
                                // if third level has no substeps, then write out sub-substep
                                response.push((i+1) + let1 + "(" + k + "). " + steps[i][j][k]);
                            }
                        }
                    // if second level has no substeps, then write out substep
                    } else {
                        response.push((i+1) + let1 + ". " + steps[i][j]);
                    }
                }
            }
        }
        //send array as JSON response
        res.json(response);
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

// export all methods to the rest of the app
module.exports = router;