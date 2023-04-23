import { selectCurrentTimestamp } from "./db.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from "fs/promises";
import express from "express";
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The port must be the same as the one being used for MySQL.
app.listen(3306, function () {
    console.log("Server running at http://localhost:3306");
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
        // .then(contents => {
        //     res.setHeader("Content-Type", "text/html");
        //     res.writeHead(200);
        //     res.end(contents);
        // })
        // .catch(err => {
        //     res.writeHead(500);
        //     res.end(err);
        //     return;
        // });
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
