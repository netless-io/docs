---
id: js-create-room
title: 创建并加入房间
---

## 安全须知

创建房间/获取房间，需要使用 sdkToken，与 SDK 后端服务器，进行交互。
该 Token，是 SDK 后端服务器，与开发者后端业务服务器通讯的凭证。掌握了这个 Token，SDK 后端服务器就会认为，这是开发者进行的操作。

Example 中，为了演示方便，将创建房间/获取房间 roomToken 操作写在了客户端中，实际业务中，为了防止有人反编译客户端代码，获取 SDKToken，不应该在任何客户端暴露该 Token。
该 Token，应该在开发者的业务服务器代码，或者配置项中。



## 创建新房间，并直接获取 RoomToken

在 `index.html` 同级目录中，创建 `index.js` 文件，填入以下内容。

**创建者常用流程**

```javascript
var sdkToken = "阅读[集成准备]文档，获取 token";
var url = 'https://cloudcapiv4.herewhite.com/room?token=' + sdkToken;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name: '我的第一个 White 房间',
        limit: 100, // 房间人数限制
    }),
};

// 请求创建房间
// 网络请求部分逻辑，请在服务器实现
fetch(url, requestInit).then(function(response) {
    // Step1: 服务器返回房间唯一标识 uuid 和 进入房间的秘钥 roomToken
    return response.json();
}).then(function(json) {
    // Step2: 加入房间
    return initAndJoinRoom(json);
}).then(function(room) {
    // Step3: 加入成功后想白板绑定到指定的 dom 中
    bind(room);
}).catch(function(err) {
    console.log(err);
});

// 加入房间
function initAndJoinRoom (json) {
    // 初始化 SDK，初始化 SDK 的参数，仅对本地用户有效，默认可以不传
    var whiteWebSdk = new WhiteWebSdk({
        // 用户手动进行缩放操作时的上下限，默认 为 0.1~10。
        // 缩放 API 不受影响
        zoomMaxScale: 3, 
        zoomMinScale: 0.3,
        // 图片替换 API，可以在插入图片和创建新场景背景图时，替换传入的 url。
        // 如果没有需要，请不要传入，可以减少前端资源开销
        // 使用该 API 后，服务器截屏时，会使用原始图片地址
        urlInterrupter: url => url,
    });
    return whiteWebSdk.joinRoom({
        // 这里与
        uuid: json.msg.room.uuid,
        roomToken: json.msg.roomToken,
    });
}
    
// 将白板绑定在一个元素上
function bind (room) {
    room.bindHtmlElement(document.getElementById('whiteboard'));
}
```


## 已知房间 UUID，获取房间 RoomToken

在 `index.html` 同级目录中，创建 `index.js` 文件，填入以下内容。

**加入者常用流程**

```javascript
var sdkToken = "阅读[集成准备]文档，获取 token";
var uuid = "从业务服务器或者 url 地址中读取";
    // 注意加入房间的 path 为 `room/join` 而创建房间的为 `room`
var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${uuid}`;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
};

// 请求加入房间
// 请求创建房间（网络请求部分逻辑，请在服务器实现）
fetch(url, requestInit).then(function(response) {
    // Step1: 服务器返回进入房间的秘钥 roomToken
    return response.json();
}).then(function(json) {
    // Step2: 加入房间
    return initAndJoinRoom(json);
}).then(function(room) {
    // Step3: 加入成功后想白板绑定到指定的 dom 中
    bind(room);
}).catch(function(err) {
    console.log(err);
});

// 加入房间
function initAndJoinRoom (json) {
    // 初始化 SDK，并且调用其成员方法 joinRoom
    var whiteWebSdk = new WhiteWebSdk();
    return whiteWebSdk.joinRoom({
        uuid: uuid,
        roomToken: json.msg.roomToken,
    });
}
    
// 将白板绑定在一个元素上
function bind (room) {
    room.bindHtmlElement(document.getElementById('whiteboard'));
}
```