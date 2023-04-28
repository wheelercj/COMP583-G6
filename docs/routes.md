# web API routes

## `GET <baseUrl>/v1/url/<shortUrl>` returns a JSON object

`<shortUrl>` is not an entire URL, just the end part after the site's base URL.

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

## `POST <baseUrl>/v1/url` expects a JSON object and may return a JSON object

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

## `GET <baseUrl>/v1/metrics` expects and returns JSON objects

example request body:

```json
{
    "urlId": 2,
    "days": 7
}
```

example response:

```json
{
    "graph": "<img src=\"data:image/png;base64,iVBORw0KGgoAA . . . rkJggg==\" />"
}
```
