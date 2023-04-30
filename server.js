import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import express from "express";
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import { DB } from './db.js';
import { router } from './routes/index.js';
import { fetchMetrics, createGraph } from './metrics.js';
import { isValidPassword } from './routes/v1/validators.js';

const app = express();
const db = new DB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('trust proxy', true);  // required for req.ip to work properly if using a proxy
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")));
console.log(await db.selectCurrentTimestamp());


// Express must use the same port as MySQL.
const port = process.env['DB_PORT'];
app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});


// Redirects to the original URL if the short URL exists.
app.get("/:shortUrl", async function (req, res) {
    if (req.params.shortUrl === undefined) {
        res.status(400).send();
        return;
    }
    let results = await db.selectUrl(req.params.shortUrl);
    if (results.length > 0) {
        await db.insertClick(results[0].id, req.ip);
        res.redirect(results[0].originalUrl);
    } else {
        res.status(404).send();
    }
});


// Returns the user's URLs if the user exists.
app.get("/v1/urls/:userId", async function (req, res) {
    if (req.params.userId === undefined) {
        res.status(400).send();
        return;
    }
    const results = await db.selectUserUrls(req.params.userId);
    if (results.length === 0) {
        res.status(404).send();
    } else {
        res.json(results);
    }
});


/*
    Returns the URL's metrics if the URL exists.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
app.get("/v1/metrics", async function (req, res) {
    const { urlId, shortUrl, maxDays } = req.query;
    if (urlId === undefined && shortUrl === undefined) {
        res.status(400).send();
        return;
    }
    if (maxDays === undefined) {
        res.status(400).send();
        return;
    }

    const metrics = await fetchMetrics(urlId, shortUrl, maxDays);
    if (!metrics) {
        res.status(400).send();
    }
    const graph = await createGraph(metrics.clicks.dailyTotalCounts, metrics.clicks.dayNames);
    if (graph) {
        res.json({
            graph: '<img src="data:image/png;base64,' + Buffer.from(graph).toString('base64') + '" />',
            locations: metrics.locations,
            clicks: metrics.clicks.dailyTotalCounts.reduce((a, b) => a + b, 0),
            uniqueVisitors: metrics.clicks.uniqueCount,
        });
    } else {
        res.status(400).send();
    }
});


/*
    Edits where a short URL redirects to.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
app.patch("/v1/redirect", async function (req, res) {
    const { urlId, shortUrl, newRedirect } = req.body;
    if (newRedirect === undefined) {
        res.status(400).send();
        return;
    }

    if (urlId !== undefined) {
        if (await db.updateOriginalUrlById(urlId, newRedirect)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (shortUrl !== undefined) {
        if (await db.updateOriginalUrl(shortUrl, newRedirect)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});


/*
    Change's an accounts password. Requires either userId or email. If both are given,
    uses userId. Requires newPassword.
*/
app.patch("/v1/changePassword", async function (req, res) {
    const { userId, email, newPassword } = req.body;
    if (newPassword === undefined || !isValidPassword(newPassword)) {
        res.status(400).send();
        return;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    if (userId !== undefined) {
        if (await db.updateAccountPasswordById(userId, newHashedPassword)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (email !== undefined) {
        if (await db.updateAccountPassword(email, newHashedPassword)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});


app.use('/', router);
