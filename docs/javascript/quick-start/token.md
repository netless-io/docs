---
id: js-token
title: 房间信息
---

## 安全须知

>本小节所进行的操作，应在开发者业务服务器中执行。请求可以在 [白板基础 API](../server/whiteboard-base.md) 中查看。

创建房间/获取房间，需要使用`sdkToken`，与`SDK`后端服务器，进行交互。
`sdkToken`，是`SDK`后端服务器，与开发者后端业务服务器通讯的凭证。掌握了`sdkToken`，`SDK`后端服务器就会认为，这是开发者进行的操作。主要涉及到开发者对应资源的计费以及权限管理。

本章节里为了演示方便，将`创建房间`/`获取特定房间roomToken`的操作写在了前端。实际业务中，为了防止有人反编译客户端代码，或者抓包，获取`SDKToken`，请勿在任何客户端暴露`sdkToken`。

## 创建新房间，同时获取 RoomToken

>该网络请求为 server 端 创建房间API，更多内容可以查看[白板基础 API](server/api/whiteboard-base.md)

```javascript
var sdkToken = "阅读[前提条件]，获取 token";
var url = 'https://cloudcapiv4.herewhite.com/room?token=' + sdkToken;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        limit: 100, // 房间人数限制
    }),
};

// 请求创建房间，并获取 sdk 后端服务器 response
fetch(url, requestInit).then(function(response) {
    return response.json();
}).then(function(json) {
    console.log(json);
}).catch(function(err) {
    console.error(err);
});
```

## 获取特定房间 RoomToken

>该网络请求为 server 端 获取特定白板roomToken API，更多内容可以查看[白板基础 API](server/api/whiteboard-base.md)

```javascript
var sdkToken = "阅读[前提条件]]文档，获取 token";
var uuid = "从业务服务器或者 url 地址中读取";
// 注意加入房间的 path 为 `room/join` 而创建房间的为 `room`
var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${uuid}`;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
};

fetch(url, requestInit).then(function(response) {
    return response.json();
}).then(function(json) {
    console.log(json);
}).catch(function(err) {
    console.error(err);
});
```