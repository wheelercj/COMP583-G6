// explanation: https://stackoverflow.com/questions/742013/how-do-i-create-a-url-shortener

import { DB } from './db.js';
const db = new DB();
let nextUrlId = (await db.selectMaxUrlId())[0].id + 1;


/*
    Creates a random short link for the given URL, saves them to the database,
    and returns the new short URL if successful. If unsuccessful, returns null.
*/
export async function createRandomShortUrl(originalUrl, userId) {
    let shortUrl = generateShortUrl(nextUrlId);
    try {
        await db.insertShortUrl(originalUrl, shortUrl, userId);
        nextUrlId++;
        return shortUrl;
    } catch (e) {
        return null;
    }
}


/*
    Saves the given custom short URL and its corresponding original URL to the
    database. Returns true if successful, false if the custom short URL is
    already taken.
*/
export async function createCustomShortUrl(originalUrl, customShortUrl) {
    try {
        await db.insertShortUrl(originalUrl, customShortUrl);
        return true;
    } catch (e) {
        return false;
    } 
}


/*
    Generates a "random" short URL. The `urlId` variable must be the ID the
    database will give the URL when it is inserted into the database
    (the max url ID + 1), but this function must be called before the link is
    inserted.
*/
function generateShortUrl(urlId) {
    return base62ToAlphanumeric(base10ToBase62(urlId));
}


/*
    Gets a "randomly" generated short URL's database ID without querying the
    database. The "randomShortUrl" variable refers to the end of the entire URL
    (the part that was generated).
*/
function getUrlId(randomShortUrl) {
    return base62ToBase10(alphanumericToBase62(randomShortUrl));
}


function base10ToBase62(base10Number) {
    let base62Number = "";
    let remainder = base10Number;
    let quotient = base10Number;
    while (quotient > 0) {
        remainder = quotient % 62;
        base62Number = remainder + base62Number;
        quotient = Math.floor(quotient / 62);
    }
    return base62Number;
}


function base62ToAlphanumeric(base62Number) {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let base62NumberArray = base62Number.split("");
    let alphabetNumberArray = [];
    for (let i = 0; i < base62NumberArray.length; i++) {
        alphabetNumberArray.push(alphabet[base62NumberArray[i]]);
    }
    return alphabetNumberArray.join("");
}


function alphanumericToBase62(shortUrl) {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphanumericArray = shortUrl.split("");
    let base62NumberArray = [];
    for (let i = 0; i < alphanumericArray.length; i++) {
        base62NumberArray.push(alphabet.indexOf(alphanumericArray[i]));
    }
    return base62NumberArray.join("");
}


function base62ToBase10(base62Number) {
    let base62NumberArray = base62Number.split("");
    let base10Number = 0;
    for (let i = 0; i < base62NumberArray.length; i++) {
        base10Number += Math.pow(62, base62NumberArray.length - i - 1) * base62NumberArray[i];
    }
    return base10Number;
}
