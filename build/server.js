import { selectCurrentTimestamp } from "./db.js";

import fs from "fs/promises";
import express from "express";
const app = express();
const port = 3000;

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    fs.readFile(__dirname + "/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
});

app.get("/hello", function (req, res) {
    res.send("Hello World!");
});

app.get("/ip", function (req, res) {
    res.send(`Your IP address is ${req.ip}`);
});

app.get("/db", function (req, res) {
    selectCurrentTimestamp()
        .then(result => {
            res.send(`Current timestamp is ${result}`);
        })
        .catch(err => {
            res.send(`Error: ${err}`);
        });
});
