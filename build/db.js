// See the "database queries" google doc for more info.
// https://docs.google.com/document/d/1-0uuLQKpJv4AtIP_U9n10LBu-a518Mcoea7zqqDyym8

// npm install dotenv
// https://www.npmjs.com/package/dotenv
// npm install mysql2
// https://www.npmjs.com/package/mysql2


require('dotenv').config();  // Loads env vars from `.env` to the `process.env` object.
var mysql = require('mysql2');

var pool = mysql.createPool({
	host: process.env['DB_HOST'],
    port: '3306',
	database: 'url_shortener',
	user: 'admin',
	password: process.env['DB_PASSWORD'],
	ssl: 'Amazon RDS',
});


function selectCurrentTimestamp() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    SELECT CURRENT_TIMESTAMP;
                `, 
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


selectCurrentTimestamp()
    .then(function (results) {
        console.log(results);
    })
    .catch(function (err) {
        console.error(err);
    });


function insertShortUrl(originalUrl, shortUrl, userID) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    INSERT INTO urls
                    (originalUrl, shortUrl, userId)
                    VALUES (?, ?, ?);
                `,
                [
                    originalUrl,
                    shortUrl,
                    userID
                ],
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


function insertGuestShortUrl(originalUrl, shortUrl) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    INSERT INTO urls
                    (originalUrl, shortUrl)
                    VALUES (?, ?);
                `,
                [
                    originalUrl,
                    shortUrl
                ],
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


/*
    The email address must be 254 characters or less.
    The password must be 200 characters or less.
    The type must be one of 'free', 'premium', 'business', or 'admin'.
*/
function insertAccount(email, password, type) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
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
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


function selectOriginalUrl(shortUrl) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    SELECT id, originalUrl, shortUrl, created
                    FROM urls
                    WHERE shortUrl = ?;
                `,
                [
                    shortUrl
                ],
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


function selectUserUrls(userID) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    SELECT id, originalUrl, shortUrl, created
                    FROM urls
                    WHERE userId = ?
                        AND deleted IS NULL
                        AND disabled IS NULL;
                `,
                [
                    userID
                ],
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}


function permanentlyDeleteAccount(userID) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
                `
                    DELETE FROM users
                    WHERE id = ?;
                `,
                [
                    userID
                ],
                function (err, results, fields) {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    });
}
