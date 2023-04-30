import { Router } from 'express';
import { createRandomShortUrl, createCustomShortUrl } from './shorten-url.js';
import { DB } from '../../db.js';
import { isValidShortUrl } from '../../validators.js';

export const urlRouter = Router();
const db = new DB();


/*
    Creates a new short URL (either random or custom). If a random short URL is created,
    returns the short URL.
*/
urlRouter.post("/", async function (req, res) {
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


// Returns the URL's data if the short URL exists.
urlRouter.get("/:shortUrl", async function (req, res) {
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
    Edits a short URL.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
urlRouter.patch("/", async function (req, res) {
    const urlId = req.body.urlId;
    const shortUrl = req.body.shortUrl;
    const newShortUrl = req.body.newShortUrl;
    if (!isValidShortUrl(newShortUrl)) {
        res.status(400).send();
        return;
    }

    if (urlId !== undefined) {
        if (await db.updateShortUrlById(urlId, newShortUrl)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (shortUrl !== undefined) {
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
    Deletes a URL.
    Requires either urlId or shortUrl. If both are given, uses urlId.
*/
urlRouter.delete("/", async function (req, res) {
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
