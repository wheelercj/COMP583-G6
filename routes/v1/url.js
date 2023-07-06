import { Router } from 'express';
import { createRandomShortUrl, createCustomShortUrl } from './shorten-url.js';
import { DB } from '../../db.js';
import { isValidShortUrl, isValidUrl, validateToken } from './validators.js';

export const urlRouter = Router();
const db = new DB();


/*
    Creates a new short URL (either random or custom) and responds with the new short
    link.
*/
urlRouter.post("/", async function (req, res) {
    const token = req.body.token;
    const originalUrl = req.body.url;
    const userId = req.body.userId;
    let shortUrl = req.body.custom;
    if (
        !isValidUrl(originalUrl)
        || token !== undefined && userId === undefined
    ) {
        res.status(400).send();
        return;
    }
    if (token === undefined && userId !== undefined) {
        res.status(401).send();
        return;
    }
    if (token !== undefined) {
        let user = await validateToken(token, userId, res);
        if (user === undefined) {
            return;
        }
    }

    if (shortUrl !== undefined) {
        if (
            isValidShortUrl(shortUrl)
            && await createCustomShortUrl(originalUrl, shortUrl, userId)
        ) {
            res.send(shortUrl);
        } else {
            res.status(409).send();
        }
    } else {
        shortUrl = await createRandomShortUrl(originalUrl, userId);
        if (shortUrl) {
            res.send(shortUrl);
        } else {
            res.status(400).send();
        }
    }
});


// Gets a URL's data.
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
    Edits a short URL (the short URL itself, not where it redirects to).
*/
urlRouter.patch("/", async function (req, res) {
    const { token, userId, shortUrl, newShortUrl } = req.body;
    if (
        shortUrl === undefined
        || newShortUrl === undefined
        || shortUrl === newShortUrl
        || !isValidShortUrl(shortUrl)
    ) {
        res.status(400).send();
        return;
    }
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    let result;
    try {
        result = await db.updateShortUrl(shortUrl, newShortUrl);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).send();
        } else {
            res.status(400).send();
        }
        return;
    }
    if (result) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});


/*
    Deletes a URL.
*/
urlRouter.delete("/", async function (req, res) {
    const { token, userId, shortUrl } = req.body;
    if (shortUrl === undefined) {
        res.status(400).send();
        return;
    }
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    if (await db.deleteUrl(shortUrl)) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});
