/*
        Programmer Name: Chris Wheeler
 */
const http = require("http");
const fs = require('fs').promises;
const mysql = require("mysql2/promise");

const host = 'localhost';
const port = 8000;

const connection = await mysql.createConnection({
  host: 'your-hostname',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name'
});

console.log("Connected to mySQL database");

const requestListener = function (req, res) {
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
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
