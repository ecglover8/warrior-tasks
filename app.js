// require all dependencies
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// require database
const database = require("./dbconfig");

// include parsing of requests to server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

// set directories, view engine, and locations
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

// setup routing directories
const index = require("./controllers/index");
const json = require("./controllers/json");
const warrior = require("./controllers/warrior");
app.use("/", index);
app.use("/json", json);
app.use("/warrior", warrior);

// connect to database and start listening
var port = process.env.PORT || 8080;
mongoose.connect(database.url, (err) => {
    if (err) {
        throw new Error("Database failed to connect!");
    } else {
        app.listen(port, (err) => {
            if (err) {
                return console.log("Failed to connect to database. Error: " + err + ".");
            }
            console.log("Database connected on port #" + port + ".");
        });
        console.log("Ready to serve.");
    }
});