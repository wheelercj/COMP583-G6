export function isValidShortUrl(shortUrl) {
    return (
        shortUrl !== undefined
        && shortUrl.length <= 30
        && /^[a-zA-Z0-9_-]+$/.test(shortUrl)
    )
}


export function isValidEmail(email) {
    return (
        email !== undefined
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
