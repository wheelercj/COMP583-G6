import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import express from "express";
import * as faviconModule from 'serve-favicon';
const favicon = faviconModule.default;
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import { DB } from './db.js';
import { router } from './routes/index.js';
import { fetchMetrics, createGraph } from './metrics.js';
import { isValidPassword, isValidUrl, validateToken } from './routes/v1/validators.js';

const app = express();
const db = new DB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // https://blog.logrocket.com/top-express-js-template-engines-for-dynamic-html-pages/
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


// Returns the user's URLs.
app.get("/v1/urls/:userId", async function (req, res) {
    if (req.params.userId === undefined) {
        res.status(400).send();
        return;
    }
    const results = await db.selectUserUrls(req.params.userId);
    if (results.length === 0) {
        res.status(404).send();
    } else {
        res.json({ urls: results });
    }
});


/*
    Sends the user to a page showing a URL's metrics.
*/
app.get("/metrics/:shortUrl", async function (req, res) {
    const shortUrl = req.params.shortUrl;
    if (shortUrl === undefined) {
        res.status(400).send();
        return;
    }
    const url = await db.selectUrl(shortUrl);
    if (url.length === 0) {
        res.status(404).send();
        return;
    }
    const originalUrl = url[0].originalUrl;
    const metrics = await fetchMetrics(shortUrl, 7);
    const graph = await createGraph(metrics.clicks.dailyTotalCounts, metrics.clicks.dayNames);
    if (graph == null) {
        res.status(400).send();
        return;
    }
    const graphImage = '<img src="data:image/png;base64,' + Buffer.from(graph).toString('base64') + '" />';
    const locations = metrics.locations;
    const clicks = metrics.clicks.dailyTotalCounts.reduce((a, b) => a + b, 0);
    const uniqueVisitors = metrics.clicks.uniqueCount;
    res.render('metrics', { graphImage, locations, clicks, uniqueVisitors, shortUrl, originalUrl });
});


/*
    Returns the URL's metrics. Returns empty metrics for URLs that do not exist, have
    been deleted or disabled, or have not had any clicks within the last maxDays days.
*/
app.get("/v1/metrics", async function (req, res) {
    const { shortUrl, maxDays } = req.body;
    if (shortUrl === undefined || maxDays === undefined) {
        res.status(400).send();
        return;
    }

    const metrics = await fetchMetrics(shortUrl, maxDays);
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
*/
app.patch("/v1/redirect", async function (req, res) {
    const { token, userId, shortUrl, newRedirect } = req.body;
    if (
        shortUrl === undefined
        || newRedirect === undefined
        || !isValidUrl(newRedirect)
    ) {
        res.status(400).send();
        return;
    }
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    if (await db.updateOriginalUrl(shortUrl, newRedirect)) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});


/*
    Logs in to an account.
*/
app.post("/v1/login", async function (req, res) {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
        res.status(400).send();
        return;
    }

    const accounts = await db.selectAccount(email);
    if (accounts.length === 0) {
        res.status(404).send();
    } else {
        let account = accounts[0];
        if (await bcrypt.compare(password, account.hashedPassword)) {
            delete account.hashedPassword;
            account.token = { user: account.email };
            res.json(account);
        } else {
            res.status(401).send();
        }
    }
});


/*
    Change's an accounts password.
*/
app.patch("/v1/changePassword", async function (req, res) {
    const { token, userId, newPassword } = req.body;
    if (!isValidPassword(newPassword)) {
        res.status(400).send();
        return;
    }
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    if (await db.updateAccountPasswordById(userId, newHashedPassword)) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});


app.use('/', router);
