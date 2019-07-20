---
id: js-replay
title: 回放
---

请阅读[服务端文档-白板类型](/docs/server/api/server-whiteboard-base#%E5%88%9B%E5%BB%BA%E7%99%BD%E6%9D%BF)，确认在创建房间时，选择的是『`可回放房间`』类型。

```javascript
// var mode = 'transitory'; // 临时房间模式
// var mode = 'persistent'; // 持久化房间模式
var mode = 'historied'; // 可回放房间模式

var url = 'https://cloudcapiv4.herewhite.com/room?token=' + sdkToken;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name: 'My Room',
        limit: 100,
        mode: mode, // 房间模式在这里体现
    }),
};
```

## 初始化回放

选择可回放房间后，无需显式地调用「开始录制」和「结束录制」，白板会自动录制。回放时，你只需提供好回放所需要的参数即可。

以下是回放需要的参数：

|    参数    |                      描述                       |            备注            |
| :--------: | :---------------------------------------------: | :----------------------------: |
| 房间 uuid  |    回放房间的 uuid    |              必填，且房间必须为`可回放模式`             |
|  房间 roomToken  |            房间鉴权 token             | 必填 (beta10) |
| 开始时间戳 | 开始回放的 Unix 时间戳（毫秒） | 可选，若不填，则从房间创建时开始回放 |
|  持续时长  |            回放持续时长（毫秒）             | 可选，若不填，则持续到最后一次用户全部退出的时间 |
|  媒体文件地址  |            交由白板接管播放的媒体文件地址             | 可选，如果有，白板会统一播放进度和播放状态，白板或者媒体文件进入缓冲状态时，都会进行缓冲状态（PlayerPhase进入缓冲状态） |

准备好参数后，你需要构造一个 `player` 实例。

```javascript
var roomUUID = "..."; // 希望回放房间的 uuid，必须是可回放模式的房间
var roomToken = ".."; // room Token，获取方式原来一致
var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
var duration = ...; // 回放片段持续时长（毫秒）
var audioUrl = "https://example.com/media.m3u8"; // 由白板接管的媒体文件(可选)，如果需要显示视频，需要提前做一些操作

whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken,
    beginTimestamp: beginTimestamp,
    audioUrl: audioUrl,
    duration: duration,
}).then(function(player) {
    // 获取到 player 实例
    // 与 room 调用类似，与获取到 player 实例后，你需要将 player 绑定到 HTML 的 div 上。
    player.bindHtmlElement(document.getElementById('whiteboard'));
})
```

### 视频支持

sdk 支持在回放时传入音视频地址。此时 sdk 会主动接管音视频播放，负责处理音视频与房间回放的播放状态同步。当白板回放与音视频，任意一个进入缓冲，状态时，sdk 会自动停止另一个的播放，等待缓冲完毕，并且同时触发 player 的状态回调。

音频只需要直接传入音频地址即可。显示视频，需要在初始化 `player` 前，做一部分准备工作。

#### 1. 创建占位div/video 标签

占位标签 id 为 `white-sdk-video-js`

#### 2. 使用 videojs 初始化

使用 video.js 将占位标签，创建 videojs.player

初始化代码参考

```javascript
// videojs 为 web-sdk 依赖，使用 yarn/npm 管理工具时，会自动安装；如果是使用cdn 引用，videojs 已经打包在其中，可以直接使用
var playerOptions = {controls: false, preload: "auto"};
videojs(placeholderVideoDiv, playerOptions);
```

详细内容，可以在 [介绍文档-相关demo](/docs/javascript/overview/js-introduction#相关-demo) 中的 rtc-react-whiteboard 项目中进行查看，实现代码在 `src/components/whiteboard/VideoPlaceholder.tsx` 文件中。

### white-react-sdk
如果你直接使用 `white-react-sdk` 来开发，可以使用如下方式进行绑定操作

```javascript
import React from "react";

class App extends React.Component {
    render() {
        return <PlayerWhiteboard player={player}/>;
    }
}
```

## 回放时，状态

相关回调，需要在初始化 player 中直接传入，具体请参考[状态管理文档](./state.md)

## 回放主动操作

### 播放

```javascript
player.play();
```

### 快进

你可以通过如下方法快进到特定时间点。``scheduleTime`` 是一个大于 0 的整数（毫秒），它不应该超过回放片段的总时间。

```javascript
player.seekToScheduleTime(scheduleTime);
```

### 暂停

```javascript
player.pause();
```

### 观察模式

```javascript
// 和实时房间相同，一旦用户进行主动移动，就会变成 freedom 模式
player.setObserverMode("directory");
```

```Typescript
export declare enum ObserverMode {
    // 跟随当前主播视角，如果当前没有主播，则跟随最早加入房间的用户
    Directory = "directory",
    // 自由模式
    Freedom = "freedom",
}
```

### 终止

使用该 API 后， `player` 不再可用，如果需要播放，请重新生成新的实例

```javascript
player.stop();
```

