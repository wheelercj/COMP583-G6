import { Router } from 'express';
import bcrypt from 'bcrypt';
import { DB } from '../../db.js';
import { isValidEmail, isValidPassword, validateToken } from './validators.js';

export const accountRouter = Router();
const db = new DB();


// This function can be used like this:
// `accountRouter.get("/", copyTokenToReq, async function (req, res) {`
// which then makes `req.token` available.
// function copyTokenToReq(req, res, next) {
//     let bearerHeader = req.headers.authorization;
//     if (bearerHeader === undefined) {
//         res.status(401).send();
//         return;
//     }
//     const splitBearerHeader = bearerHeader.split(' ');
//     if (splitBearerHeader.length < 2) {
//         console.log("Error: splitBearerHeader.length < 2");
//         console.log(`splitBearerHeader: ${splitBearerHeader}`)
//         res.status(400).send();
//         return;
//     }
//     req.token = splitBearerHeader[1];
//     next();
// }


/*
    Creates an account and returns the user's data if successful. The email must be <=
    254 characters and the password must be between 8 and 50 (inclusive) ASCII
    characters.
*/
accountRouter.post("/", async function (req, res) {
    const { email, password } = req.body;
    if (!isValidEmail(email) || !isValidPassword(password)) {
        res.status(400).send();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await db.insertAccount(email, hashedPassword, 'free');
    if (!insertResult) {
        res.status(400).send();
        return;
    }
    let account = (await db.selectAccountById(insertResult.insertId))[0];
    delete account.hashedPassword;
    account.token = { user: email };
    res.json(account);
});


/*
    Gets an account's data.
*/
accountRouter.get("/", async function (req, res) {
    const { token, userId } = req.body;
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }
    delete user.hashedPassword;
    res.json(user);
});


/*
    Edits an account except the password. Requires newEmail, newType,
    newLinkRotNotifications, and newLinkMetricsReports.
*/
accountRouter.put("/", async function (req, res) {
    const {
        token, userId, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports
    } = req.body;
    if (
        newEmail === undefined
        || newType === undefined
        || newLinkRotNotifications === undefined
        || newLinkMetricsReports === undefined
        || !isValidEmail(newEmail)
    ) {
        res.status(400).send();
        return;
    }
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    const result = await db.updateAccountById(
        userId, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports
    );
    if (result) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});


/*
    Deletes an account.
*/
accountRouter.delete("/", async function (req, res) {
    const { token, userId } = req.body;
    let user = await validateToken(token, userId, res);
    if (user === undefined) {
        return;
    }

    if (await db.permanentlyDeleteAccountById(userId)) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});
