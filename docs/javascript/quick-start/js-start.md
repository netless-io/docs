---
id: js-native
title: 原生 JavaScript
---

本章介绍在不使用任何框架和工具的前提下，介绍如何以纯 JavaScript 接入White SDK，并开发 Web 互动白板应用。

> 在此之前，你需要在 Netless 的管理控制台注册一个企业账号，并创建一个应用。然后获取此应用中的 `App Identifier` 和，并生成此应用的 `SDK Token`。

你可以阅读[《应用与权限》](https://developer.netless.link/documents/guan-li-kong-zhi-tai/applications-and-authority)来了解具体操作。成功之后，你会获得如下内容。

```text
# App Identifier:
-_-AcIBWEeqEdX1jHT9ZPg/i25mN7NEhbum6g

# SDK Token:
NETLESSSDK_YWs9UU9JSkJobEZfYlBPLXdNeSZub25jZT0xNTg3MDkyMzUxMTQ0MDAmcm9sZT0wJnNpZz1mYmUzOTI3MjhkZmVhNTc4MzllZTdhNWQ3N2RhZjdjNjkyZmUwNzk1Y2M2MGFhMzE1Y2YxZDY1YmMxODkxNmRi
```

这段内容只是**举个例子，内容不可用**，你需要亲自操作获取自己的内容。

之后，创建一个文件夹，这将来存放 HTML 文件和 JS 文件。然后，在这个文件夹中新建一个名为 `index.html` 的文件，用编辑器打开它，并插入如下内容。

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="https://sdk.netless.link/white-web-sdk/2.10.2.js"></script>
        <script src="./index.js"></script>
    </head>
    <body>
        <div id="whiteboard" style="width: 100%; height: 100vh;"></div>
    </body>
</html>
```

其中的 `<div id="whiteboard">`是互动白板的占位符。随后，你将通过 JavaScript 调用互动白板 SDK 的方法，来在这个 `<div>` 注入白板的实体。

然后，在此文件夹中新建名为 `index.js` 的文件。用编辑器打开它，并插入如下内容。

> 记得将下列代码的第 1 行和第 2 行的字符串替换成你提前准备好的内容。

```javascript
var sdkToken = "阅读《应用与权限》获取 SDK Token";
var appIdentifier = "阅读《应用与权限》获取 App Identifier";

// 构造创建房间的 Request
var url = "https://shunt-api.netless.link/v5/rooms";
var requestInit = {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "token": sdkToken,
        "region": "cn-hz",
    },
};

window.fetch(url, requestInit).then(function(response) {
    return response.json();

}).then(function(json) {
    // 创建房间成功，获取房间的 uuid
    var roomUUID = json.uuid;

    // 构造申请 Room Token 的 Request
    var url = "https://shunt-api.netless.link/v5/tokens/rooms/" + roomUUID;
    var requestInit = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "token": sdkToken,
        },
        body: JSON.stringify({
            "lifespan": 0, // 表明 Room Token 永不失效
            "role": "admin", // 表明 Room Token 有 Admin 的权限
        }),
    };
    fetch(url, requestInit).then(function(response) {
        return response.json();

    }).then(function(roomToken) {
        // 成功获取房间的 Room Token
        joinRoom(roomUUID, roomToken);

    }).catch(function(err) {
        console.error(err);
    });
}).catch(function(err) {
    console.error(err);
});

function joinRoom(roomUUID, roomToken) {
    var whiteWebSdk = new WhiteWebSdk({
        appIdentifier: appIdentifier,
    });
    var joinRoomParams = {
        uuid: roomUUID,
        roomToken: roomToken,
    };
    whiteWebSdk.joinRoom(joinRoomParams).then(function(room) {
        // 加入房间成功，获取 room 对象
        // 并将之前的 <div id="whiteboard"/> 占位符变成白板
        room.bindHtmlElement(document.getElementById("whiteboard"));

    }).catch(function(err) {
        // 加入房间失败
        console.error(err);
    });
}
```

> Vue 用户注意：Vue 会对所有 property 进行劫持，监听属性中，key-value 的变化，但是这种监听，只对单纯的 key-value 对象有用，白板加入房间后，返回的 room/player 对象，不是单纯的 key-value 对象，不能直接在 Vue 中使用 this.room = room 来进行绑定。绑定操作请使用 this.$room = room。

最后，用浏览器打开 `index.html` 文件，将看到一个空白页面。用鼠标在该页面上写写画画，若一切顺利，可以看到笔迹。

![js-native](/img/js-native-view.png)
