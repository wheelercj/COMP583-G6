import { Router } from 'express';
import bcrypt from 'bcrypt';
import { DB } from '../../db.js';
import { isValidEmail, isValidPassword } from './validators.js';

export const accountRouter = Router();
const db = new DB();


/*
    Creates an account and returns the user's ID if successful. The email must be <= 254
    characters and the password must be between 8 and 50 (inclusive) ASCII characters.
*/
accountRouter.post("/", async function (req, res) {
    const { email, password } = req.body;
    if (!isValidEmail(email) || !isValidPassword(password)) {
        res.status(400).send();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.insertAccount(email, hashedPassword, 'free');
    if (result) {
        res.json({ userId: result.insertId });
    } else {
        res.status(400).send();
    }
});


/*
    Gets an account's data. Requires either userId or email. If both are given, uses
    userId.
*/
accountRouter.get("/", async function (req, res) {
    const { userId, email } = req.body;
    let result;
    if (userId !== undefined) {
        result = await db.selectAccountById(userId);
    } else if (email !== undefined) {
        result = await db.selectAccount(email);
    } else {
        res.status(400).send();
        return;
    }
    if (result.length > 0) {
        delete result[0].hashedPassword;
        res.json(result[0]);
    } else {
        res.status(404).send();
    }
});


/*
    Edits an account except the password. Requires either userId or email. If both are
    given, uses userId. Requires newEmail, newType, newLinkRotNotifications, and
    newLinkMetricsReports.
*/
accountRouter.put("/", async function (req, res) {
    const {
        userId, email, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports
    } = req.body;
    if (newEmail === undefined
        || newType === undefined
        || newLinkRotNotifications === undefined
        || newLinkMetricsReports === undefined) {
        res.status(400).send();
        return;
    }
    if (!isValidEmail(newEmail)) {
        res.status(400).send();
        return;
    }

    if (userId !== undefined) {
        const result = await db.updateAccountById(
            userId, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports
        );
        if (result) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (email !== undefined) {
        const result = await db.updateAccount(
            email, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports
        );
        if (result) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});


/*
    Deletes an account. Requires either userId or email. If both are given, uses userId.
*/
accountRouter.delete("/", async function (req, res) {
    const { userId, email } = req.body;
    if (userId !== undefined) {
        if (await db.permanentlyDeleteAccountById(userId)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else if (email !== undefined) {
        if (await db.permanentlyDeleteAccount(email)) {
            res.status(204).send();
        } else {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});
