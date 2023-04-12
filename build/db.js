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

function get_current_timestamp() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) throw error;
            let sql = `
                SELECT CURRENT_TIMESTAMP;
            `;
            connection.query(sql, function (err, results, fields) {
                connection.release();
                if (err) reject(err);
                resolve(results);
            });
        });
    });
}

get_current_timestamp()
    .then(function (results) {
        console.log(results);
    })
    .catch(function (err) {
        console.error(err);
    });
