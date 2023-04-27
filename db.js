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
        The password must be 200 characters or less.
        The type must be one of 'free', 'premium', 'business', or 'admin'.
    */
    insertAccount(email, password, type) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO users
                    (email, password, type)
                    VALUES (?, ?, ?);
                `,
                [
                    email,
                    password,
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
                    SELECT id, email, password, created, type, loggedIn, suspended, linkRotNotifications, linkMetricsReports
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


    updateAccount(userId, email, password, linkRotNotifications, linkMetricsReports) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE users
                    SET email = ?,
                        password = ?,
                        linkRotNotifications = ?,
                        linkMetricsReports = ?
                    WHERE id = ?;
                `,
                [
                    email,
                    password,
                    linkRotNotifications,
                    linkMetricsReports,
                    userId,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    permanentlyDeleteAccount(userId) {
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
                    SELECT id, originalUrl, shortUrl, created
                    FROM urls
                    WHERE userId = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
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


    updateShortUrl(urlId, newShortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET shortUrl = ?
                    WHERE urlId = ?;
                `,
                [
                    newShortUrl,
                    urlId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateOriginalUrl(shortUrl, newOriginalUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET originalUrl = ?
                    WHERE shortUrl = ?;
                `,
                [
                    newOriginalUrl,
                    shortUrl
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    updateOriginalUrlById(urlId, newOriginalUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET originalUrl = ?
                    WHERE id = ?;
                `,
                [
                    newOriginalUrl,
                    urlId
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /* Doesn't actually delete the url, just marks it as deleted. */
    deleteUrl(shortUrl) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    UPDATE urls
                    SET deleted = NOW()
                    WHERE shortUrl = ?;
                `,
                [
                    shortUrl,
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    /*************
        clicks
    **************/


    insertClick(urlId, ipv4, ipv6) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    INSERT INTO clicks
                    (urlId, ipv4, ipv6)
                    VALUES (?, ?, ?);
                `,
                [
                    urlId,
                    ipv4,
                    ipv6
                ],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }


    selectClicks(urlId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT id, created, ipv4, ipv6
                    FROM clicks
                    WHERE urlId = ?;
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


    /*
        The `days` variable is the number of previous days (starting from
        today) to return metrics for.
    */
    selectMetrics(urlId, days) {
        return new Promise(function (resolve, reject) {
            connection.query(
                `
                    SELECT DATE(created) AS date, COUNT(*) AS clicks
                    FROM clicks
                    WHERE urlId = ?
                        AND created >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)
                    GROUP BY DATE(created)
                    ORDER BY DATE(created) DESC;
                `,
                [
                    urlId,
                    days,
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
