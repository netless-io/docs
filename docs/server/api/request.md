---
id: server-request
title: Request specification
---

## API request a domain name

```plain
https://cloudcapiv4.herewhite.com
```

## Use parameters globally

Read [Access Preparation](/docs/blog/blog-begin-netless/), register an account, and get the token.

* {{token}} parameter

sdk server, user authentication through token in URL parameter.

* {{roomtoken}} parameter

The parameter obtained by the user after calling [Get whiteboard roomtoken](/docs/server/api/server-whiteboard-base#获取特定白板-room-token), used to call some room APIs

## Request format

For POST and PUT requests, the body of the request must be in JSON format, and the Content-Type of the HTTP header needs to be set to `application / json`

## Response format

For all requests, the response format is a JSON object.

A request always contains a code field, 200 indicates success, and a successful response is accompanied by a msg field indicating the specific business return content:

```json
{
    "code": 200,
    "msg": {
        "room": {
            "id": 10987,
            "name": "111",
            "limit": 100,
            "teamId": 1,
            "adminId": 1,
            "uuid": "5d10677345324c0cb3febd3291e2a607",
            "updatedAt": "2018-08-14T11:19:04.895Z",
            "createdAt": "2018-08-14T11:19:04.895Z"
        },
        "hare": "{\"message\":\"ok\"}",
        "roomToken": "xx"
    }
}
```

When a request fails, the body of the response is still a JSON object, but it always contains the two fields `code` and` msg`. You can use them for debugging. For example:

```json
{
  "code": 112,
  "msg": "require uuid"
}
```
