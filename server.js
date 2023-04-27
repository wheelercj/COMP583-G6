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
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")));

// The Express port must be the same as the one being used for MySQL.
const port = process.env['DB_PORT'];
app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/v1/ip", function (req, res) {
    res.json(req.ip);
});

app.get("/v1/timestamp", async function (req, res) {
    const result = await db.selectCurrentTimestamp();
    res.send(result[0]['CURRENT_TIMESTAMP']);
});

app.get("/:shortUrl", async function (req, res) {
    let result = await db.selectUrl(req.params.shortUrl);
    if (result.length > 0) {
        res.redirect(result[0].originalUrl);
    } else {
        res.status(404).send("Short URL not found.");
    }
});

app.get("/v1/url/:shortUrl", async function (req, res) {
    let result = await db.selectUrl(req.params.shortUrl);
    if (result.length > 0) {
        res.json(result[0]);
    } else {
        res.status(404).send("Short URL not found.");
    }
});
