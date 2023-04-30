export function isValidShortUrl(shortUrl) {
    if (shortUrl === undefined || shortUrl.length > 30) {
        return false;
    }
    return /^[a-zA-Z0-9_-]+$/.test(shortUrl);
}


export function isValidEmail(email) {
    if (email === undefined || email.length > 254) {
        return false;
    }
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}


export function isValidPassword(password) {
    return password !== undefined && password.length <= 200;
}
