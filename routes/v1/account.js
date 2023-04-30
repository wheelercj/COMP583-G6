import { Router } from 'express';
import bcrypt from 'bcrypt';
import { DB } from '../../db.js';
import { isValidEmail, isValidPassword } from '../../validators.js';

export const accountRouter = Router();
const db = new DB();


/*
    Creates an account and returns the user's ID if successful. The email must be <= 254
    characters and the password must be between 8 and 50 (inclusive) ASCII characters.
*/
accountRouter.post("/", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
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
