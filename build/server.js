/*
Programmer Name: Chris Wheeler
*/
const http = require("http");
const fs = require("fs").promises;

const host = "localhost";
const port = 8000;

const server = http.createServer(function (req, res) {
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

server.listen(port, host, function () {
    console.log(`Server running at http://${host}:${port}`);
});
