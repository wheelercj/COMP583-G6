import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from "express";
const app = express();
app.set('trust proxy', true);  // required for req.ip to work properly if using a proxy
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const path = require('path');
import { DB } from './public/db.js';
const db = new DB();
console.log(await db.selectCurrentTimestamp());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/public', express.static(path.join(__dirname, "public")));

// The port must be the same as the one being used for MySQL.
app.listen(3306, function () {
    console.log("Server running at http://localhost:3306");
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/ip", function (req, res) {
    res.send(`Your IP address is ${req.ip}`);
});

app.get("/timestamp", async function (req, res) {
    const result = await db.selectCurrentTimestamp();
    res.send(`The current time is ${result[0]['CURRENT_TIMESTAMP']}`);
});
