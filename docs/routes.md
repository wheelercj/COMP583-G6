# web API routes

## get a link's data

`GET <baseUrl>/v1/url/<shortUrl>` returns a JSON object

`<shortUrl>` is not an entire URL, just the unique part after the site's base URL.

example response:

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

## get all of a user's links

`GET <baseUrl>/v1/urls/<userId>` returns a JSON object

example response:

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

## create a new short link (either random or custom)

`POST <baseUrl>/v1/url` expects a JSON object and may return a JSON object

example request body:

```json
{
    "url": "https://expressjs.com/en/guide/routing.html",
    "userId": 1
}
```

and its response:

```json
"KX6wpCY"
```

another example request body:

```json
{
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
    "custom": "status-codes",
    "userId": 1
}
```

When a custom link to redirect from is given, there is no JSON response.

## get a link's metrics

`GET <baseUrl>/v1/metrics` expects and returns JSON objects

example request body:

```json
{
    "urlId": 2,  // alternatively, you can use the "shortUrl" attribute
    "maxDays": 7
}
```

example response:

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
