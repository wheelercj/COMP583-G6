import { DB } from '../../db.js';
const db = new DB();


/*
    Creates a random short link for the given URL, saves them to the database, and
    returns the new short URL if successful. If unsuccessful, returns null.
*/
export async function createRandomShortUrl(originalUrl, userId) {
    const shortUrl = generateRandomString(7);
    try {
        await db.insertUrl(originalUrl, shortUrl, userId);
        return shortUrl;
    } catch (e) {
        console.log(e);
        return null;
    }
}


/*
    Saves the given custom short URL and its corresponding original URL to the database.
    Returns true if successful, false otherwise such as if the custom short URL is
    already taken.
*/
export async function createCustomShortUrl(originalUrl, customShortUrl, userId) {
    try {
        await db.insertUrl(originalUrl, customShortUrl, userId);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


const alphabet = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
];


function generateRandomString(length) {
    let randomString = "";
    for (let i = 0; i < length; i++) {
        randomString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return randomString;
}
