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
  "userId": 1
}
```

### get all of a user's links

`GET <baseUrl>/v1/urls/<userId>` returns a JSON object

Note that `urls` is plural in this route.

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
            "userId": 1
        },
        {
            "id": 4,
            "originalUrl": "https://expressjs.com/en/guide/routing.html",
            "shortUrl": "KX6wpCY",
            "created": "2023-04-28T05:35:39.000Z",
            "deleted": null,
            "disabled": null,
            "userId": 1
        }
    ]
}
```

### create a new short link (either random or custom)

`POST <baseUrl>/v1/url` expects a JSON object and returns a JSON object

sample request body where the user is NOT logged in:

```json
{
    "url": "https://expressjs.com/en/guide/routing.html"
}
```

sample response:

```json
"status-codes"
```

another sample request body, and this time the user is logged in:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "url": "https://expressjs.com/en/guide/routing.html",
    "userId": 4
}
```

another sample request body where the logged in user wants to create a custom short link:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
    "custom": "status-codes",
    "userId": 4
}
```

### get a link's metrics

`GET <baseUrl>/v1/metrics` expects and returns JSON objects

sample request body:

```json
{
    "shortUrl": "status-codes",
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

If the given shortUrl does not exist, has been deleted or disabled, or has not had any clicks within the last maxDays days, a JSON object will still be returned:

```json
{
    "graph": "<img src=\"data:image/png;base64,iVBORw0KGgoAA . . . rkJggg==\" />",
    "locations": [],
    "clicks": 0,
    "uniqueVisitors": 0
}
```

### edit a short link

`PATCH <baseUrl>/v1/url` expects a JSON object

sample request body:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4,
    "shortUrl": "status-codes",
    "newShortUrl": "status"
}
```

### edit where a link redirects to

`PATCH <baseUrl>/v1/redirect` expects a JSON object

sample request body:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4,
    "shortUrl": "db-schema",
    "newRedirect": "https://github.com/wheelercj/COMP583-G6/blob/main/docs/schema.sql",
}
```

### delete a link

`DELETE <baseUrl>/v1/url` expects a JSON object

sample request body:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4,
    "shortUrl": "db-schema"
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
    "token": {
        "user": "arthur@dent.com"
    },
    "id": 4,
    "email": "arthur@dent.com",
    "created": "2023-04-28T05:35:39.000Z",
    "type": "free",
    "suspended": null,
    "linkRotNotifications": "true",
    "linkMetricsReports": "true"
}
```

Email addresses can be up to 254 characters long and passwords can be between 8 and 50 (inclusive) ASCII characters long.

### get an account's data

`GET <baseUrl>/v1/account` expects and returns JSON objects

sample request body:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4
}
```

sample response:

```json
{
    "id": 4,
    "email": "arthur@dent.com",
    "created": "2023-04-28T05:35:39.000Z",
    "type": "free",
    "suspended": null,
    "linkRotNotifications": "true",
    "linkMetricsReports": "true"
}
```

### log in to an account

`POST <baseUrl>/v1/login` expects and returns JSON objects

```json
{
    "email": "arthur@dent.com",
    "password": "87654321"
}
```

sample response:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "id": 4,
    "email": "arthur@dent.com",
    "created": "2023-04-28T05:35:39.000Z",
    "type": "free",
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
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4,

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
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4,
    "newPassword": "87654321"
}
```

Passwords can be between 8 and 50 (inclusive) ASCII characters long.

### permanently delete an account

`DELETE <baseUrl>/v1/account` expects a JSON object

sample request body:

```json
{
    "token": {
        "user": "arthur@dent.com"
    },
    "userId": 4
}
```
