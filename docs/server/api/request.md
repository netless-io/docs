---
id: server-request
title: 请求规范
---

## API 请求域名

```plain
https://cloudcapiv4.herewhite.com
```

## 全局使用参数

阅读 [接入准备](/docs/blog/blog-begin-netless/)，注册账号，获取该 token。

* {{token}} 参数

sdk 服务器，通过 URL 参数中的 token 进行用户验证。

## 请求格式

对于 POST 和 PUT 请求，请求的主体必须是 JSON 格式，而且 HTTP header 的 Content-Type 需要设置为 `application/json`

## 响应格式

对于所有的请求，响应格式都是一个 JSON 对象。

一个请求总会包含 code 字段，200 表示成功，成功的响应附带一个 msg 字段表示具体业务的返回内容：

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

当一个请求失败时响应的主体仍然是一个 JSON 对象，但是总是会包含 `code` 和 `msg`这两个字段，你可以用它们来进行调试，举个例子：

```json
{
  "code": 112,
  "msg": "require uuid"
}
```
