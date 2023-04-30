// See the "database queries" google doc for more info.
// https://docs.google.com/document/d/1-0uuLQKpJv4AtIP_U9n10LBu-a518Mcoea7zqqDyym8

import { config } from 'dotenv';
config();  // Loads env vars from the `.env` file into the `process.env` object.
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: process.env['DB_HOST'],
    port: process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    ssl: process.env['DB_SSL'],
});


export class DB {


    constructor() {
    }


    selectCurrentTimestamp() {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT CURRENT_TIMESTAMP;
                `,
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /**************
        accounts
    ***************/


    /*
        The email address must be 254 characters or less.
        The hashed password must be 60 characters or less.
        The type must be one of 'free', 'premium', 'business', or 'admin'.
    */
    insertAccount(email, hashedPassword, type) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO users
                    (email, hashedPassword, type)
                    VALUES (?, ?, ?);
                `,
                [
                    email,
                    hashedPassword,
                    type
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectAccount(email) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, email, hashedPassword, created, type, loggedIn, suspended, linkRotNotifications, linkMetricsReports
                    FROM users
                    WHERE email = ?;
                `,
                [
                    email
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectAccountById(userId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, email, hashedPassword, created, type, loggedIn, suspended, linkRotNotifications, linkMetricsReports
                    FROM users
                    WHERE id = ?;
                `,
                [
                    userId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateAccount(currentEmail, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE users
                    SET email = ?,
                        type = ?,
                        linkRotNotifications = ?,
                        linkMetricsReports = ?
                    WHERE email = ?;
                `,
                [
                    newEmail,
                    newType,
                    newLinkRotNotifications,
                    newLinkMetricsReports,
                    currentEmail,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateAccountById(userId, newEmail, newType, newLinkRotNotifications, newLinkMetricsReports) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE users
                    SET email = ?,
                        type = ?,
                        linkRotNotifications = ?,
                        linkMetricsReports = ?
                    WHERE id = ?;
                `,
                [
                    newEmail,
                    newType,
                    newLinkRotNotifications,
                    newLinkMetricsReports,
                    userId,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateAccountPassword(email, newHashedPassword) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE users
                    SET hashedPassword = ?
                    WHERE email = ?;
                `,
                [
                    newHashedPassword,
                    email,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateAccountPasswordById(userId, newHashedPassword) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE users
                    SET hashedPassword = ?
                    WHERE id = ?;
                `,
                [
                    newHashedPassword,
                    userId,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    permanentlyDeleteAccount(email) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    DELETE FROM users
                    WHERE email = ?;
                `,
                [
                    email
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    permanentlyDeleteAccountById(userId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    DELETE FROM users
                    WHERE id = ?;
                `,
                [
                    userId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /**********
        URLs
    ***********/


    insertUrl(originalUrl, shortUrl, userId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO urls
                    (originalUrl, shortUrl, userId)
                    VALUES (?, ?, ?);
                `,
                [
                    originalUrl,
                    shortUrl,
                    userId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectUrl(shortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, originalUrl, shortUrl, created, deleted, disabled, rotted, userId
                    FROM urls
                    WHERE shortUrl = ?;
                `,
                [
                    shortUrl
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectUrlById(urlId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, originalUrl, shortUrl, created, deleted, disabled, rotted, userId
                    FROM urls
                    WHERE id = ?;
                `,
                [
                    urlId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectUserUrls(userId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, originalUrl, shortUrl, created, deleted, disabled, rotted, userId
                    FROM urls
                    WHERE userId = ?;
                `,
                [
                    userId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /*
        Resolves to false if a matching link was not found.
    */
    updateShortUrl(shortUrl, newShortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET shortUrl = ?
                    WHERE shortUrl = ?;
                `,
                [
                    newShortUrl,
                    shortUrl
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*
        Resolves to false if a matching link was not found.
    */
    updateShortUrlById(urlId, newShortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET shortUrl = ?
                    WHERE id = ?;
                `,
                [
                    newShortUrl,
                    urlId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*
        Resolves to false if a matching link was not found.
    */
    updateOriginalUrl(shortUrl, newOriginalUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET originalUrl = ?
                    WHERE shortUrl = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
                `,
                [
                    newOriginalUrl,
                    shortUrl
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*
        Resolves to false if a matching link was not found.
    */
    updateOriginalUrlById(urlId, newOriginalUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET originalUrl = ?
                    WHERE id = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
                `,
                [
                    newOriginalUrl,
                    urlId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*
        Doesn't actually delete the url, just marks it as deleted. Resolves to false if
        a matching link was not found.
    */
    deleteUrl(shortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET deleted = NOW()
                    WHERE shortUrl = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
                `,
                [
                    shortUrl,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*
        Doesn't actually delete the url, just marks it as deleted. Resolves to false if
        a matching link was not found.
    */
    deleteUrlById(urlId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET deleted = NOW()
                    WHERE id = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
                `,
                [
                    urlId,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    if (results === undefined || results.affectedRows === 0) {
                        resolve(false);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }


    /*************
        clicks
    **************/


    insertClick(urlId, ip) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO clicks
                    (urlId, ip)
                    VALUES (?, ?);
                `,
                [
                    urlId,
                    ip,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /*
        `maxDays` is the maximum number of previous days (starting from today) to return
        clicks for.
    */
    selectClicks(urlId, maxDays) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, created, ip, urlId
                    FROM clicks
                    WHERE urlId = ?
                        AND created >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                `,
                [
                    urlId,
                    maxDays,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /*
        `maxDays` is the maximum number of previous days (starting from today) to return
        clicks for.
    */
    selectClicksByShortUrl(shortUrl, maxDays) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, created, ip, urlId
                    FROM clicks
                    WHERE urlId = (
                        SELECT id
                        FROM urls
                        WHERE shortUrl = ?
                    )
                        AND created >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                `,
                [
                    shortUrl,
                    maxDays,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /**************
        reports
    ***************/


    insertReport(urlId, userId, reason) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO userReports
                    (urlId, userId, reason)
                    VALUES (?, ?, ?);
                `,
                [
                    urlId,
                    userId,
                    reason
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectReports() {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, created, viewed, reason, userId, urlId
                    FROM userReports;
                `,
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateReport(reportId, viewed) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE userReports
                    SET viewed = ?
                    WHERE id = ?;
                `,
                [
                    viewed,
                    reportId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    permanentlyDeleteReport(reportId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    DELETE FROM userReports
                    WHERE id = ?;
                `,
                [
                    reportId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }
}
