import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import { DB } from './db.js';
import { createRandomShortUrl, createCustomShortUrl } from './shorten-url.js';
import { fetchMetrics, createGraph } from './metrics.js';

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

// Returns the URL's data if the short URL exists.
app.get("/v1/url/:shortUrl", async function (req, res) {
    if (req.params.shortUrl === undefined) {
        res.status(400).send();
        return;
    }
    let result = await db.selectUrl(req.params.shortUrl);
    if (result.length > 0) {
        res.json(result[0]);
    } else {
        res.status(404).send();
    }
});

/*
    Creates a new short URL (either random or custom). If a random short URL is created,
    returns the short URL.
*/
app.post("/v1/url", async function (req, res) {
    const originalUrl = req.body.url;
    const userId = req.body.userId;
    let shortUrl = req.body.custom;
    if (originalUrl === undefined) {
        res.status(400).send();
        return;
    }
    if (userId === undefined) {
        res.status(400).send();
        return;
    }

    if (shortUrl !== undefined) {
        if (!isValidShortUrl(shortUrl)) {
            res.status(400).send();
        } else if (await createCustomShortUrl(originalUrl, shortUrl, userId)) {
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
    const urlId = req.body.urlId;
    const shortUrl = req.body.shortUrl;
    const maxDays = req.body.maxDays;
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
    Edits a short URL.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
app.patch("/v1/url", async function (req, res) {
    const urlId = req.body.urlId;
    const shortUrl = req.body.shortUrl;
    const newShortUrl = req.body.newShortUrl;
    if (newShortUrl === undefined) {
        res.status(400).send();
        return;
    }

    if (urlId !== undefined) {
        if (await db.updateShortUrlById(urlId, newShortUrl)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (newShortUrl !== undefined) {
        if (await db.updateShortUrl(shortUrl, newShortUrl)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});

/*
    Edits where a short URL redirects to.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
app.patch("/v1/redirect", async function (req, res) {
    const urlId = req.body.urlId;
    const shortUrl = req.body.shortUrl;
    const newRedirect = req.body.newRedirect;
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
    Deletes a URL.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
app.delete("/v1/url", async function (req, res) {
    const urlId = req.body.urlId;
    const shortUrl = req.body.shortUrl;

    if (urlId !== undefined) {
        if (await db.deleteUrlById(urlId)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (shortUrl !== undefined) {
        if (await db.deleteUrl(shortUrl)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});


function isValidShortUrl(shortUrl) {
    if (shortUrl === undefined || shortUrl.length > 30) {
        return false;
    }
    return /^[a-zA-Z0-9_-]+$/.test(shortUrl);
}
