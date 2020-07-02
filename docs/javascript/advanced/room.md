---
id: room
title: 实时房间
---

每一个白板都属于一个房间。白板上写写画画的轨迹可以被房间里所有人看到。本章将涉及，如何创建时互动的房间，如何管理房间的状态。

> 本章教程只会把房间状态管理的相关内容涉猎一遍。如果想深入了解相关内容，可以在阅读完本章后，进一步阅读[《实时房间状态管理》](https://developer.netless.link/documents/client/realtime-room-state-management)。

## 创建房间

Netless 互动白板的一切基于房间。创建了房间的那一刻，才是开始互动白板之旅之时。为了创建房间，你需要准备 App Identifier 和 SDK Token。

App Idnetifier 表明了房间归哪个应用所有。应用和企业账号关联。如此一来，房间产生的费用才可以关联到企业账号。

SDK Token 由应用签出。带上它，Netless 服务才确定创建房间的操作得到了授权。你可以阅读[《应用与权限》](https://developer.netless.link/documents/guan-li-kong-zhi-tai/applications-and-authority)来了了解如何获取 App Identifier 和 SDK Token。

准备完毕后，通过如下代码，调用 Netless 服务的 API 来创建房间。

```javascript
var url = "https://shunt-api.netless.link/v5/rooms";
var requestInit = {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "token": sdkToken, // 签发的 SDK Token，需提前准备
    },
};

window.fetch(url, requestInit).then(function(response) {
    return response.json();

}).then(function(roomJSON) {
    // 创建房间成功，获取描述房间信息的 roomJSON
    console.log(roomJSON);

}).catch(function(err) {
    // 失败了，打印出 Error 以便分析为何失败
    console.error(err);
});
```

如果执行成功，将创建一个实时互动房间。Netless 服务端会返回一个 JSON 形式的 object，来描述刚刚创建好的房间的信息。不出所料，这个 JSON 包含的内容如下。

```javascript
{
    "uuid": "dcfc7fb09f6511eabc8da545523f6422",
    "name": "",
    "teamUUID": "34YtcH_MEeqFMjt5vcNozQ",
    "isRecord": false,
    "isBan": false,
    "createdAt": "2020-05-26T15:30:43.706Z",
    "limit": 0
}
```

其中 `uuid`是最重要的字段。

> 建议在业务服务器上执行创建房间的操作，不要在前端或客户端上做。本章为了演示完整流程，用了前端的 window.fetch 方法调用 Netless 服务端 API。请勿在正式 Web 应用中效仿此行为。
> SDK Token 是公司和团队的重要资产，原则上只能在业务服务器中产生并使用。**绝对不能写死在前端！绝对不要通过网络传输给前端！**否则**，**别人可以通过反编译、抓包等途径来窃取 SDK Token。SDK Token 一旦泄漏，会带来严重的安全问题。

更多关于创建房间 API 的内容，请参考[《房间 ｜ 服务端》](https://developer.netless.link/server/api-reference/room#chuang-jian-fang-jian)。

## 房间的标示与鉴权

在加入房间之前，要先准备房间的 UUID 和 Room Token。其中，UUID 是用来唯一标示房间的字符串。而 Room Token 用于加入房间时的健全。

你可以通过调用服务端 API 的方法，为特定房间签出 Room Token。同创建房间一样，这个过程也需要提供 SDK Token。

```javascript
var uuid = "特定房间的 uuid";
var url = "https://shunt-api.netless.link/v5/tokens/rooms/" + uuid;
var requestInit = {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "token": sdkToken, // 签发的 SDK Token，需提前准备
    },
    body: JSON.stringify({
        "lifespan": 0, // 表明 Room Token 永不失效
        "role": "admin", // 表明 Room Token 有 Admin 的权限
    }),
};
window.fetch(url, requestInit).then(function(response) {
    return response.json();

}).then(function(roomToken) {
    // 成功获取房间的 Room Token
    joinRoom(roomUUID, roomToken);

}).catch(function(err) {
    console.error(err);
});
```

Room Token 只能访问指定房间，权限比 SDK Token 弱，可以根据业务逻辑分发给前端。

> 由于必须通过 Netless 服务端 API 签出 Room Token，而该行为必须用到 SDK Token。显然，出于安全方面的顾虑，该操作也不能在前端做。
> 当前端需要 Room Token 时，应该先调用业务服务器的 API，再由业务服务器调用 Netless 服务端 API 签出 Room Token。

更多关于创建 Room Token 的 API 的内容，请参考[《房间 ｜ 服务端》](https://developer.netless.link/server/api-reference/generate-token#sheng-cheng-room-token)。

## 加入房间

在创建了一个实时互动房间，并获取到了 `uuid` 和 `roomToken` 之后，就可以凭这两个参数，在前端调用方法加入房间了。

> 思考一下，uuid 和 roomToken 应该如何传递给前端？其实这取决于业务逻辑，你可以和团队中的产品经理交流，以设计一个合理的方式。
>
> 比如，先请求业务服务器的 API 读取房间列表（每一项中包含房间的 `uuid`）。当点击其中某一个房间时，读取项中的 `uuid` 。并发起一个 fetch 请求调用业务服务器的 API，让服务端应用使用 SDK Token 签出 Room Token，再返回给前端。

首先，创建 `WhiteWebSdk` 实例。

```javascript
import { WhiteWebSdk } from "white-web-sdk";

var whiteWebSdk = new WhiteWebSdk({
    appIdentifier: appIdentify, // 从管理控制台获取 App Identifier
});
```

这个 `whiteWebSdk` 实例我们今后会多次用到。建议将其作为单例全局变量。

然后，通过如下代码加入房间。

```javascript
var joinRoomParams = {
    uuid: uuid,
    roomToken: roomToken,
};

whiteWebSdk.joinRoom(joinRoomParams).then(function(room) {
    // 加入房间成功，获取 room 对象

}).catch(function(err) {
    // 加入房间失败
    console.error(err);
});
```

成功加入房间后，会通过回调拿到 `room` 对象。这是一个重要的对象，之后，我们所有代码都要围绕它来写。

现在，让我们把互动白板在网页上展示出来把。在此之前，还需要在网页的 Dom 树中准备白板占位符。

```markup
<div id="whiteboard" style="width: 100%; height: 100vh;"></div>
```

然后，通过如下代码，将白板展示在网页上。

```javascript
room.bindHtmlElement(document.getElementById("whiteboard"));
```

之后，你就可以用鼠标在网页上画出线条。致此，说明成功加入房间了，成功显示白板了。若非如此，你可能碰到了问题。

### 问题：我的网页无法画出线条，怎么办

首先，要确定房间是否加入成功。你可以先通过浏览器的开发模式进入 Console 页面，来查看代码输出的日志。如果看到了报错信息（这些信息往往以醒目的红色标明），那么，几乎可以确定房间加入失败了。

读一读这些报错信息，分析分析可能的原因。其实，原因无外乎如下：

* 网络有问题，前端代码无法访问 Netless 的服务器。
* **输入了错误的 `uuid` 和 `roomToken`。**
* 企业账号欠费停服了。
* SDK 版本过低，先尝试升级到最新版本。

相反，如果 Console 没有任何报错信息，那至少意味着房间加入成功了。排除房间加入失败这一因素，我们再来看看，是不是样式显示的问题。

通过浏览器的开发模式进入 Elements 页面，找到白板占位符 `<div>`。看一看它的尺寸。如果宽高的任何一项是 `0px` ，就可以肯定，是样式出了问题。

为了解决样式问题，需要调整Dom 中的样式安排，即调整 `<div>` 的 `style` 属性和 `class` 属性，直到白板占位符 `<div>` 的尺寸符合预想。这是前端工程师工作中一直在做的事情，相信对于你来说是轻车熟路了。

## 在 React 项目中展示互动白板

如果你使用 `react` 来管理网页视图，则无需设置白板占位符 `<div>` 。在成功加入房间并拿到 `room` 对象之后，通过如下代码便可将互动白板展示出来。

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
import React from "react";
import { RoomWhiteboard } from "white-react-sdk";

class App extends React.Component {

    render() {
        var style = {
            width: "100%",
            height: "100vh",
        };
        return <RoomWhiteboard room={room} style={style}/>;
    }
}
```

<!--TypeScript-->

```typescript
import * as React from "react";
import { RoomWhiteboard } from "white-react-sdk";

class App extends React.Component {

    public render(): React.ReactNode {
        const style = {
            width: "100%",
            height: "100vh",
        };
        return <RoomWhiteboard room={room} style={style}/>;
    }
}
```

<!--END_DOCUSAURUS_CODE_TABS-->

> Netless 互动白板为 React 项目提供了专门的 SDK：`white-react-sdk`。该 SDK 是可完全代替 `white-web-sdk` 的超集。

## 适配占位符尺寸变化

当白板的边界尺寸（width、height）发生变化后，你**必须**调用如下代码，以让 White SDK 重新调整样式。

```javascript
room.refreshViewSize();
```

一个典型场景是，用户会调整浏览器窗口大小，这会产生连锁反应，最终导致白板的尺寸发生改变。你可以监听窗口大小变化事件，及时调用该方法以保证白板样式始终能正确展示。

```javascript
window.addEventListener("load", function() {
    room.refreshViewSize();
});
```

## 离开房间

如果不再使用白板了，就应该离开房间。Netless 互动白板**不会**自动离开房间。出于如下理由，我们不应该遗漏「离开房间」操作。

* 不离开房间的话，浏览器将维持与 Netless 服务器的长连接。这将消耗前端用户设备的包括网络带宽在内的各种资源。
* Netless 会对没有离开房间的用户继续收费。维持不必要的长连接将导致你所在的团队或公司产生不必要的开支。

> 如果用户直接关闭浏览器，或关闭当前网页 Tab，会自动释放房间，无需担心。

如下代码可以主动离开房间。如果不再需要房间，记得调用，否则房间会泄漏。

```javascript
room.disconnect().then(function() {
    // 成功离开房间
}).catch(function(err) {
    // 离开房间失败，获得报错 err
});
```

> 如果发现 Netless 给发的账单高于预期，这很可能是「房间泄漏」导致的。此时此刻，你可以排查应用的业务逻辑代码，或重构那些可能导致状态混乱的地方。
> 彻底修复「房间泄漏」问题之后，你会发现账单开始符合预期。

## 异常流程处理

为了保证应用程序能稳定运行，在业务流程设计之初，就应该考虑到异常流程处理。想象一下，你的 Web 应用运行在千家万户的浏览器之上。千家万户的网络问题、DNS 问题、鉴权问题，各种问题源源不断地涌现出来。

倘若不处理异常流程，上线即是灾难。**我们强烈建议你在设计业务逻辑之初就将异常流程考虑在内。**Netless 互动白板提供了多种方式让你能处理实时房间的异常流程。

### 异步调用方法都会返回 Promise

例如，`joinRoom` 和 `disconnect` 都会返回一个 Promise 对象。如果你对 Promise 对象不熟悉，可以先阅读[《Promise - JavaScript \| MDN》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

异步调用方法失败，则会抛出错误。通过如下方式截获错误，并进入异常处理流程。

```javascript
room.disconnect().catch(function (err) {
    // 截获错误，进入异常处理流程
});
```

如果你的开发环境支持 `await` 语法，可以将代码写成如下形式。

```javascript
try {
    await room.disconnect();
} catch (err) {
    // 截获错误，进入异常处理流程
}
```

### 通过回调函数捕获错误

你可以通过 `joinRoom` 时，附带回调函数，来监听实时房间的异常。

```javascript
var joinRoomParams = {
    uuid: roomUUID,
    roomToken: roomToken,
};

whiteWebSdk.joinRoom(joinRoomParams, {

    onDisconnectWithError: function(err) {
        // 房间因为错误，和服务端断开连接
    },

    onKickedWithReason: function(err) {
        // 用户被踢出房间
    },
});
```
