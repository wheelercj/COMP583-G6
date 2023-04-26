import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from "express";
const app = express();
app.set('trust proxy', true);  // required for req.ip to work properly if using a proxy
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const path = require('path');
import { DB } from './db.js';
const db = new DB();
console.log(await db.selectCurrentTimestamp());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/public', express.static(path.join(__dirname, "public")));

// The port must be the same as the one being used for MySQL.
const port = process.env['DB_PORT'];
app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
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
