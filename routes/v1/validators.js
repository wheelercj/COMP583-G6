import { DB } from '../../db.js';
const db = new DB();


// Validates the end part of a short URL after the base URL, not an entire URL.
export function isValidShortUrl(shortUrl) {
    return (
        shortUrl !== undefined
        && shortUrl.length > 0
        && shortUrl.length <= 30
        && /^[a-zA-Z0-9_-]+$/.test(shortUrl)
    )
}


// Validates an entire URL.
export function isValidUrl(url) {
    return (
        url !== undefined
        && url.length > 0
        && url.length <= 1000
        && /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)
    )
}


export function isValidEmail(email) {
    return (
        email !== undefined
        && email.length > 0
        && email.length <= 254
        && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );
}


export function isValidPassword(password) {
    return (
        password !== undefined
        && password.length >= 8
        && password.length <= 50
        && /^[\x00-\x7F]+$/.test(password)  // must be ASCII
    );
}


/*
    Validates a token. Returns the user's account info if the token is valid, undefined
    if it's invalid. If the token is invalid, a 400-level response is sent.
*/
export async function validateToken(token, userId, res) {
    if (userId === undefined) {
        res.status(400).send();
        return undefined;
    }
    if (token === undefined || token.user === undefined) {
        res.status(401).send();
        return undefined;
    }
    const users = await db.selectAccountById(userId);
    if (users.length === 0) {
        res.status(404).send();
        return undefined;
    }
    const user = users[0];
    if (token.user !== user.email) {
        res.status(401).send();
        return undefined;
    }
    return user;
}
