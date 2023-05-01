# web API routes

## links

### get a link's data

`GET <baseUrl>/v1/url/<shortUrl>` returns a JSON object

`<shortUrl>` is not an entire URL, just the unique part after the site's base URL.

sample response:

```json
{
  "id": 1,
  "originalUrl": "https://docs.google.com/document/d/1x1vIba275ZqG8QyG6ITHhW_pf3WH04_-GSS7cjyVE5U/edit",
  "shortUrl": "db-schema",
  "created": "2023-04-14T05:36:05.000Z",
  "deleted": null,
  "disabled": null,
  "rotted": null,
  "userId": 1
}
```

### get all of a user's links

`GET <baseUrl>/v1/urls/<userId>` returns a JSON object

sample response:

```json
{
    "urls": [
        {
            "id": 1,
            "originalUrl": "https://docs.google.com/document/d/1x1vIba275ZqG8QyG6ITHhW_pf3WH04_-GSS7cjyVE5U/edit",
            "shortUrl": "db-schema",
            "created": "2023-04-14T05:36:05.000Z",
            "deleted": null,
            "disabled": null,
            "rotted": null,
            "userId": 1
        },
        {
            "id": 4,
            "originalUrl": "https://expressjs.com/en/guide/routing.html",
            "shortUrl": "KX6wpCY",
            "created": "2023-04-28T05:35:39.000Z",
            "deleted": null,
            "disabled": null,
            "rotted": null,
            "userId": 1
        }
    ]
}
```

### create a new short link (either random or custom)

`POST <baseUrl>/v1/url` expects a JSON object and may return a JSON object

sample request body:

```json
{
    "url": "https://expressjs.com/en/guide/routing.html",
    "userId": 1  // not required for users not logged in
}
```

and its response:

```json
"KX6wpCY"
```

another sample request body:

```json
{
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
    "custom": "status-codes",
    "userId": 1  // not required for users not logged in
}
```

When a custom link to redirect from is given, there is no JSON response.

### get a link's metrics

`GET <baseUrl>/v1/metrics` expects and returns JSON objects

sample request body:

```json
{
    "urlId": 2,  // alternatively, you can use the "shortUrl" attribute
    "maxDays": 7
}
```

sample response:

```json
{
    "graph": "<img src=\"data:image/png;base64,iVBORw0KGgoAA . . . rkJggg==\" />",
    "locations": [
        {
            "region": "California",
            "country": "United States",
            "percent": 0.8846153846153846
        },
        {
            "region": "South Carolina",
            "country": "United States",
            "percent": 0.11538461538461539
        }
    ],
    "clicks": 13,
    "uniqueVisitors": 6
}
```

### edit a short link

`PATCH <baseUrl>/v1/url` expects a JSON object

sample request body:

```json
{
    "urlId": 1,  // alternatively, you can use the "shortUrl" attribute
    "newShortUrl": "db"
}
```

### edit where a link redirects to

`PATCH <baseUrl>/v1/redirect` expects a JSON object

sample request body:

```json
{
    "urlId": 1,  // alternatively, you can use the "shortUrl" attribute
    "newRedirect": "https://github.com/wheelercj/COMP583-G6/blob/main/docs/schema.sql",
}
```

### delete a link

`DELETE <baseUrl>/v1/url` expects a JSON object

sample request body:

```json
{
    "urlId": 9  // alternatively, you can use the "shortUrl" attribute
}
```

## accounts

### create an account

`POST <baseUrl>/v1/account` expects and returns JSON objects

sample request body:

```json
{
    "email": "arthur@dent.com",
    "password": "12345678"
}
```

sample response:

```json
{
    "userId": 4
}
```

Email addresses can be up to 254 characters long and passwords can be between 8 and 50 (inclusive) ASCII characters long.

### get an account's data

`GET <baseUrl>/v1/account` expects and returns JSON objects

sample request body:

```json
{
    "userId": 4  // alternatively, you can use the "email" attribute
}
```

sample response:

```json
{
    "id": 4,
    "email": "arthur@dent.com",
    "created": "2023-04-28T05:35:39.000Z",
    "type": "free",
    "loggedIn": "true",
    "suspended": null,
    "linkRotNotifications": "true",
    "linkMetricsReports": "true"
}
```

### edit an account (except the password)

`PUT <baseUrl>/v1/account` expects a JSON object

sample request body:

```json
{
    "userId": 4,  // alternatively, you can use the "email" attribute

    "newEmail": "sandwich@shop.com",
    "newType": "free",
    "newLinkRotNotifications": "true",
    "newLinkMetricsReports": "true"
}
```

The "newEmail", "newType", "newLinkRotNotifications", and "newLinkMetricsReports" attributes are required. For any of these that should not change, give the current value.

Email addresses can be up to 254 characters long.

### edit an account's password

`PATCH <baseUrl>/v1/changePassword` expects a JSON object

sample request body:

```json
{
    "userId": 4,  // alternatively, you can use the "email" attribute
    "newPassword": "87654321"
}
```

Passwords can be between 8 and 50 (inclusive) ASCII characters long.

### permanently delete an account

`DELETE <baseUrl>/v1/account` expects a JSON object

sample request body:

```json
{
    "userId": 4  // alternatively, you can use the "email" attribute
}
```
