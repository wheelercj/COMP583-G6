/*
Programmer Name: Chris Wheeler
*/

const fs = require("fs").promises;
const express = require("express");
const app = express();
const port = 3000;

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

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});
