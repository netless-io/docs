---
id: restful
title: 请求规范
---

## API 请求域名

```plain
https://shunt-api.netless.link/v5
```

## 请求格式

对于 POST 和 PUT 请求，请求的主体必须是 JSON 格式，而且 HTTP header 的 Content-Type 需要设置为 `application/json`

>服务器有对部分请求格式做兼容，但是无法保证完全兼容。
>当出现填写内容都没有问题，返回仍然失败时，请确认请求格式。

## restful 规范

服务器端 API，遵循 restful 规范：

* 网络请求方法：

1. GET（SELECT）：从服务器取出资源（一项或多项）。
2. POST（CREATE）：在服务器新建一个资源。
3. PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
4. PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
5. DELETE（DELETE）：从服务器删除资源。

* 状态码：

1. 200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
2. 201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
3. 400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
4. 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
5. 403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
6. 500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。

* 错误处理：

当状态码为 4XX，5XX 时，错误信息会带在返回信息中。