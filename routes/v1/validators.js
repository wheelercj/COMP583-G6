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
        && originalUrl.length > 0
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
