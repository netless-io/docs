---
id: js-replay
title: 回放
---

阅读[白板类型](/docs/server/api/server-whiteboard-base#%E5%88%9B%E5%BB%BA%E7%99%BD%E6%9D%BF)，在创建房间时，选择『可回放房间』类型。

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

## sdk 端初始化回放

白板的内容会被自动录制。所以你无需显式地调用「开始录制」和「结束录制」。你只需要确保房间被正确设置成「可回放模式」，则该房间的所有行为就会在服务端被自动记录下来。等到需要回放时，你只需准备好回放所需要的完整参数即可。

如下是回放需要的参数。

|    参数    |                      描述                       |            是否可选            |
| :--------: | :---------------------------------------------: | :----------------------------: |
| 房间 uuid  |    希望回放的房间的 uuid。必须是可回放模式。    |              必填              |
|  房间 roomToken  |            回放片段持续时长（毫秒）             | 必填 (beta10) |
| 开始时间戳 | 回放的开始片段的事件，整数，Unix 时间戳（毫秒） | 若不填，则从房间创建时开始回放 |
|  持续时长  |            回放片段持续时长（毫秒）             | 若不填，则从持续到录制点最新点 |

准备好参数后，你需要构造一个 ``player`` 实例。

```javascript
var roomUUID = "..."; // 希望回放房间的 uuid，必须是可回放模式的房间
var roomToken = ".."; // room Token，获取方式原来一致
var beginTimestamp = ...; // 回放的开始片段的事件，整数，Unix 时间戳（毫秒）
var duration = ...; // 回放片段持续时长（毫秒）

var promise = whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken,
    beginTimestamp: beginTimestamp,
    duration: duration,
});
promise.then(function(player) {
    // 获取到 player 实例
})
```

与 `room` 调用类似，与获取到 `player` 实例后，你需要将 `player` 绑定到网页上。

```javascript
// 将其与 #whiteboard 节点绑定
player.bindHtmlElement(document.getElementById('whiteboard'));
```

如果你直接使用 ``white-react-sdk`` 来开发，可以使用如下代码直接渲染出播放器。

```javascript
import React from "react";

class App extends React.Component {
    render() {
        return <PlayerWhiteboard player={player}/>;
    }
}
```

之后，通过如下代码开始播放。

```javascript
player.seekToScheduleTime(0); // 从时间 0 开始
player.play(); // 播放
```

## 回放时，状态

相关回调，需要在初始化 player 中直接传入，具体请参考[状态管理文档](./state.md)

## 回放主动操作

你可以通过如下方法快进到特定时间点。``scheduleTime`` 是一个大于 0 的整数（毫秒），它不应该超过回放片段持续时间。

### seek 快进功能

```javascript
player.seekToScheduleTime(scheduleTime);
```

### 播放

```javascript
player.play();
```

### 暂停

```javascript
player.pause();
```

### 观察模式

```javascript
//和实时房间相同，一旦用户进行主动移动，就会变成 freedom 模式
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

