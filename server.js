import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import { DB } from './db.js';
import { createRandomShortUrl, createCustomShortUrl } from './shorten-url.js';
import { createGraph } from './metrics.js';

const app = express();
const db = new DB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('trust proxy', true);  // required for req.ip to work properly if using a proxy
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")));
console.log(await db.selectCurrentTimestamp());

// The Express port must be the same as the one being used for MySQL.
const port = process.env['DB_PORT'];
app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/:shortUrl", async function (req, res) {
    let results = await db.selectUrl(req.params.shortUrl);
    if (results.length > 0) {
        await db.insertClick(results[0].id, req.ip);
        res.redirect(results[0].originalUrl);
    } else {
        res.status(404).send();
    }
});

app.get("/v1/ip", function (req, res) {
    res.json(req.ip);
});

app.get("/v1/timestamp", async function (req, res) {
    const result = await db.selectCurrentTimestamp();
    res.json(result[0]['CURRENT_TIMESTAMP']);
});

app.get("/v1/url/:shortUrl", async function (req, res) {
    let result = await db.selectUrl(req.params.shortUrl);
    if (result.length > 0) {
        res.json(result[0]);
    } else {
        res.status(404).send();
    }
});

app.post("/v1/url", async function (req, res) {
    const originalUrl = req.body.url;
    const userId = req.body.userId;
    let shortUrl = req.body.custom;

    if (originalUrl === undefined) {
        res.status(400).send();
        return;
    }

    if (shortUrl) {
        if (await createCustomShortUrl(originalUrl, shortUrl, userId)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        shortUrl = await createRandomShortUrl(originalUrl, userId);
        if (shortUrl) {
            res.json(shortUrl);
        } else {
            res.status(400).send();
        }
    }
});

app.get("/v1/metrics", async function (req, res) {
    const urlId = req.body.urlId;
    const maxDays = req.body.maxDays;
    const graph = await createGraph(urlId, maxDays);
    if (graph) {
        const base64Graph = '<img src="data:image/png;base64,' + Buffer.from(graph).toString('base64') + '" />';
        res.json({ graph: base64Graph });
    } else {
        res.status(400).send();
    }
});
