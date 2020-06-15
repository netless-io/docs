---
id: replay
title: 回放
---

Netless 以记录信令的方式实现录制、回放功能。相较于传统的录屏模式，仅需少量带宽，回放时便输出高清的结果。只要调整好参数，Netless 云端就会自动录制实时房间的内容。

到此章为止，我们假设你已经将 Netless 互动白板 SDK 安装并引入了项目。如果没有，你可能跳过了之前的章节，强烈建议先阅读[《安装》](https://developer.netless.link/javascript/advanced-tutorial/installation)。

> 本章教程只会把房间状态管理的相关内容涉猎一遍。如果想深入了解相关内容，可以在阅读完本章后，进一步阅读[《录制与回放》](https://developer.netless.link/documents/client/record-and-replay)。

## 开启云端录制

在创建房间之初，可以开启云端录制功能。通过在调用 Netless 服务端 API 创建房间时，加入参数 `isRecord: true` 即可开启。

```javascript
var url = "https://shunt-api.netless.link/v5/rooms";
var requestInit = {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "token": sdkToken, // 签发的 SDK Token，需提前准备
    },
    body: JSON.stringify({
        isRecord: true, // 开启云端录制
    }),
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

> 建议在业务服务器上执行创建房间的操作，不要在前端或客户端上做。本章为了演示完整流程，用了前端的 window.fetch 方法调用 Netless 服务端 API。请勿在正式 Web 应用中效仿此行为。
> SDK Token 是公司和团队的重要资产，原则上只能在业务服务器中产生并使用。**绝对不能写死在前端！绝对不要通过网络传输给前端！**否则**，**别人可以通过反编译、抓包等途径来窃取 SDK Token。SDK Token 一旦泄漏，会带来严重的安全问题。

开启之后，该房间的一切实时互动行为都会被 Netless 云端自动录制下来。更多关于创建房间 API 的内容，请参考[《房间 ｜ 服务端》](https://developer.netless.link/server/api-reference/room#chuang-jian-fang-jian)。

## 在前端回放已录制好的内容

通过如下代码，可以创建一个用于回放的播放器实例。

```javascript
var replayRoomParams = {
    room: "回放的房间 UUID",
    roomToken: "回放房间的 Room Token",
    beginTimestamp: new Date("2020-01-01 22:00:00").getTime(), // 回放开始时间
    duration: 10 * 60 * 1000, // 回放持续时间（ms），这里是 10 分钟
};
whiteWebSdk.replayRoom(replayRoomParams).then(function (player) {
    // 获取到回放数据，成功初始化播放器实例

}).catch(function(err) {
    // 获取回放数据失败
    console.error(err);
});
```

注意这里有 `beginTimestamp` 和 `duration` 两个参数。它们用于限定回放的范围。举个例子，假设你的产品是在线课堂，课程在上午 08:00 开始，08:45 结束。那么，你可以将这两个参数设为。

```javascript
whiteWebSdk.replayRoom({
    ...otherReplayRoomParams,

    beginTimestamp: new Date("2020-01-01 08:00:00").getTime(),
    duration: 45 * 60 * 1000,
});
```

考虑到上课之前有人提前进场，下课后有人滞留，这些人都会产生互动行为，并被录制下来。限定范围会剔除 08:00 之前的内容和 08:45 之后的内容，让回放专注于课堂中的内容。

之后，我们需要把播放器在网页上展示出来。在此之前，还需要在网页的 Dom 树中准备白板占位符。

```html
<div id="whiteboard" style="width: 100%; height: 100vh;"></div>
```

然后，通过如下代码，将回放的白板展示在网页上。

```javascript
player.bindHtmlElement(document.getElementById("whiteboard"));
```

执行完如上代码后，你应该只能看见空空如也的网页，这是因为现在首帧还尚未加载。你需要执行如下代码开始播放。

```javascript
player.play();
```

## 在 React 中展示白板回放内容

如果你使用 `react` 来管理网页视图，则无需设置白板占位符 `<div>` 。在拿到 `player` 对象之后，通过如下代码便可将白板回放页展示出来。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```JavaScript
import React from "react";
import { PlayerWhiteboard } from "white-react-sdk";

class App extends React.Component {

    render() {
        var style = {
            width: "100%",
            height: "100vh",
        };
        return <PlayerWhiteboard player={player} style={style}/>;
    }
}
```

<!--TypeScript-->

```typescript
import * as React from "react";
import { PlayerWhiteboard } from "white-react-sdk";

class App extends React.Component {

    public render(): React.ReactNode {
        const style = {
            width: "100%",
            height: "100vh",
        };
        return <PlayerWhiteboard player={player} style={style}/>;
    }
}
```

<!--END_DOCUSAURUS_CODE_TABS-->

> Netless 互动白板为 React 项目提供了专门的 SDK：`white-react-sdk`。该 SDK 是可完全代替 `white-web-sdk` 的超集。

## 适配占位符尺寸变化

当白板的边界尺寸（width、height）发生变化后，你**必须**调用如下代码，以让 White SDK 重新调整样式。

```javascript
player.refreshViewSize();
```

一个典型场景是，用户会调整浏览器窗口大小，这会产生连锁反应，最终导致白板的尺寸发生改变。你可以监听窗口大小变化事件，及时调用该方法以保证白板样式始终能正确展示。

```javascript
window.addEventListener("load", function() {
    player.refreshViewSize();
});
```

## 播放器操作

完成上一小节的阅读后，你终于可以在网页上看到回放录像了。但这个录像似乎只会从头播到尾，播完就结束了，不会再播了。而本小节，将教你如何实现播放、暂停、跳转、重复播放等功能。

可以通过如下代码播放、暂停。

```javascript
// 播放
player.play();

// 暂停
player.pause();
```

可以通过如下代码跳转。指定的 `timestamp` 表示跳转到的时间戳，单位是毫秒，起点是 0，即这段回放内容的起点。

```javascript
player.seekToScheduleTime(timestamp);
```

这三个方法虽然没有返回 Promise，但除了 `pause` 操作能立即起效外，其他操作不一定能立即起效。例如，当你调用 `seekToScheduleTime` 到一个较远的时间点，播放器可能发现这段内容尚未缓存，于是它必须通过网络请求预加载这段内容。此时，播放被阻塞，直到缓存到足够内容后才能开始播放。

考虑到播放缓存的问题，我们必须监听播放器状态的变化。我们可以通过在创建播放器实例的时候，添加监听回调函数来实现。

```javascript
whiteWebSdk.replayRoom(replayRoomParams, {
    onPhaseChanged: function(phase) {
        case PlayerPhase.Playing: {
            // 正在播放
            break;
        }
        case PlayerPhase.Pause: {
            // 暂停了
            break;
        }
        case PlayerPhase.Buffering: {
            // 正在缓存
            break;
        }
    },
});
```

还可以修改播放倍率。

```javascript
player.playbackSpeed = 1.5; // 切换为 1.5 倍播放
```

播放倍率默认是 `1.0`，因此可以通过如下代码把播放倍率恢复正常。

```javascript
player.playbackSpeed = 1.0; // 恢复正常
```

在播放完之后，需要释放播放器实例。可以调用如下方法。

```javascript
player.stop();
```

## 视角跟随

实时房间互动时，用户的视角变化信息也会被录制下来，在回放时会原样复现出来。因此，在回放时，观看者的视角会自动变化，以复现当时的情景。

用户也可以通过设备操作主动操作视角（平移、放缩），这时，用户会夺走视角控制权，白板不再复现录制中的视角变化信息。

如果不希望用户夺走视角控制权，可以通过如下代码禁止用户的设备操作。

```javascript
player.disableCameraTransform = true;
```

如果用户已经夺走了视角控制权，可以通过如下代码收回用户的视角控制权，令白板重新复现录制的视角变化信息。

```javascript
import { ObserverMode } from "white-web-sdk";

player.setObserverMode(ObserverMode.Directory);
```

## 服务端录制时延

Netless 云服务的录制功能并非一瞬间就可以出结果。因此，你有时可能会发现，某些刚刚创建的房间无法立即回放，并在 Console 中看到如下报错。

```text
[White] Error: couldn't find any matching slices
```

这是因为房间创建不久，云端录制内容还未生成。稍微等一会，等到录制内容生成之后，就不会报错了。

你也可以在创建播放器之前，使用如下代码确认录制内容是否已生成。

```javascript
var replayRange = {
    room: "回放房间的 UUID",
    roomToken: "回放房间的 Room Token",
    beginTimestamp: new Date("2020-01-01 08:00:00").getTime(),
    duration: 45 * 60 * 1000,
};
whiteWebSdk.isPlayable(replayRange).then(function(isPlayable) {
    // isPlayable === true 表示，这个时间段的录像已生成，可以播放

}).catch(fucntion(err) {
    // 获取失败
    console.error(err);
});
```

## 回朔自定义行为

实时房间中的 Global State 的变化，以及自定事件，都会被录制下来。你可以在回放时监听这些变化和事件，如果能妥善处理，这些由你自己实现的自定义行为也可以在回放时复现。

在创建播放器实例时，添加回调函数，以监听 Global State 的变化。

```javascript
var replayRoomParams = {
    room: "回放的房间 UUID",
    roomToken: "回放房间的 Room Token",
    beginTimestamp: new Date("2020-01-01 22:00:00").getTime(), // 回放开始时间
    duration: 10 * 60 * 1000, // 回放持续时间（ms），这里是 10 分钟
};
whiteWebSdk.replayRoom(replayRoomParams, {
    onPlayerStateChanged: function(modifyState) {
        if (modifyState.globalState) {
            // 监听到 Global State 的变化
            var globalState = modifiyState.globalState;
        }
    },
});
```

通过如下代码可以监听自定义事件。

```javascript
var event = "my-custom-event"; // 自定义事件名称

player.addMagixEventListener(event, function(event) {
    // 监听到自定义事件
    var payload = event.payload; // 事件荷载
});
```

## 回放音视频

如果你在实时房间中搭配实时音视频通讯，而音视频通讯的内容被录制了下来，那么，Netless 互动白板支持将它们连同白板内容一起被回放。

正确设计业务逻辑，你就可以回放一整个带音视频的互动白板房间了。你需要提前准备好音视频录制文件的 URL，在创建播放器实例时，传入参数。

```javascript
whiteWebSdk.replayRoom({
    ...otherReplayRoomParams,
    mediaURL: "https://my-domain/assets/rtc-record.mp4",
});
```

## 异常流程处理

为了应用的稳定性，你需要处理播放器因为错误而终止的异常流程。在创建播放器之处，添加回调函数。

```javascript
var replayRoomParams = {
    room: "回放的房间 UUID",
    roomToken: "回放房间的 Room Token",
    beginTimestamp: new Date("2020-01-01 22:00:00").getTime(), // 回放开始时间
    duration: 10 * 60 * 1000, // 回放持续时间（ms），这里是 10 分钟
};
whiteWebSdk.replayRoom(replayRoomParams, {
    onStoppedWithError: function(err) {
        // 播放器因为错误而终止。
        console.error(err);
    },
});
```
