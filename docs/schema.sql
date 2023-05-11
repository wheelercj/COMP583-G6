-- MySQL documentation: https://dev.mysql.com/doc/
-- MySQL glossary: https://dev.mysql.com/doc/refman/8.0/en/glossary.html
-- MySQL CREATE TABLE statement: https://dev.mysql.com/doc/refman/8.0/en/create-table.html
-- MySQL data types: https://dev.mysql.com/doc/refman/8.0/en/data-types.html
-- Which MySQL datatype to use for an IP address? -- StackOverflow: https://stackoverflow.com/questions/5133580/which-mysql-datatype-to-use-for-an-ip-address
-- How To Create a New User and Grant Permissions in MySQL: https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

CREATE DATABASE url_shortener;

USE url_shortener;

CREATE TABLE users (
    id SERIAL,
    email VARCHAR(254) NOT NULL UNIQUE,
    hashedPassword VARCHAR(60) NOT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('free', 'premium', 'business', 'admin') NOT NULL,
    suspended DATETIME,  -- if null, the user isnt suspended
    linkRotNotifications ENUM('true', 'false') NOT NULL DEFAULT 'true',
    linkMetricsReports ENUM('true', 'false') NOT NULL DEFAULT 'true'
);

CREATE TABLE urls (
    id SERIAL,
    originalUrl VARCHAR(1000) NOT NULL,
    shortUrl VARCHAR(30) NOT NULL UNIQUE,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted DATETIME,  -- if null, the url has not been deleted. Only the urls owner can delete it.
    disabled DATETIME,  -- if null, the url has not been disabled. Only admins can disable urls.
    userId BIGINT UNSIGNED,  -- if null, the user doesnt have an account
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE clicks (
    id SERIAL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(39) NOT NULL,
    urlId BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (urlId) REFERENCES urls(id)
);

CREATE TABLE blockedShortUrls (
    id SERIAL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shortUrl VARCHAR(30) NOT NULL UNIQUE,
    reason VARCHAR(500)
);

CREATE TABLE blockedOriginalUrls (
    id SERIAL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    originalUrl VARCHAR(1000) NOT NULL,  -- Ideally, these should be unique but MySQL doesnt allow such a large varchar to be unique.
    reason VARCHAR(500)
);

CREATE TABLE userReports (
    id SERIAL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    viewed ENUM('true', 'false') NOT NULL DEFAULT 'false',
    reason VARCHAR(500) NOT NULL,
    userId BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    urlId BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (urlId) REFERENCES urls(id)
);
