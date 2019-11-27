---
id: js-player
title: 回放参数
---

`room`与`player`实际上，都是内部`displayer`的子类。`TypeScript`签名中，以`///Displayer.d.ts`开头的方法签名，`room`和`player`均可使用。

我们将正在回放过去操作的房间，称为 **回放房间**（`对应类为 player`）。

## 初始化 API

### TypeScript 方法签名

```typescript
//WhiteWebSdk.d.ts
replayRoom(params: ReplayRoomParams, callbacks?: PlayerCallbacks): Promise<Player>;
```

### 示例代码

```js
whiteWebSdk.replayRoom({
    room: "room",
    roomToken: "roomToken",
}, {
    onPhaseChanged: phase => {
        console.log(phase);
    },
    onLoadFirstFrame: () => {
        console.log("onLoadFirstFrame");
    },
    onPlayerStateChanged: modifyState => {
        console.log(modifyState);
    },
    onScheduleTimeChanged: scheduleTime => {
        console.log(scheduleTime);
    },
}).then(function(player) {
    window.player = player;
}).catch((e: Error) => {
    //初始化回放失败
    console.log(e);
});
```

## ReplayRoomParams 参数说明

```typescript
type ReplayRoomParams = {
    readonly slice?: string;
    readonly room?: string;
    readonly roomToken: string;
    readonly beginTimestamp?: number;
    readonly duration?: number;
    readonly mediaURL?: string;
    readonly cursorAdapter?: CursorAdapter;
    readonly cameraBound?: CameraBound;
}
```

| 参数 |  描述 | 备注 |
| ---- | ---- | --- |
| **uuid** | 回放房间的 uuid |必填，且房间必须为`可回放模式`|
| slice | 回放房间 分片地址 |sdk 会根据`beginTimestamp`与`duration`参数，查找对应`room`中的数据，无需填写|
| **roomToken** | 房间鉴权 token | 必填 |
| beginTimestamp | 开始回放的 Unix 时间戳（毫秒） | 可选，若不填，则从房间创建时开始回放 |
| duration | 回放持续时长（毫秒）| 可选，若不填，则持续到最后一次用户全部退出的时间 |
| mediaURL | 音视频地址（由sdk负责同步播放状态）| 可选，如果有，白板会统一播放进度和播放状态，白板或者媒体文件进入缓冲状态时，都会进行缓冲状态（PlayerPhase进入缓冲状态）|

## PlayerCallbacks 参数说明

```typescript
type PlayerCallbacks = {
    readonly onHandToolActive?: (active: boolean) => void;
    readonly onPPTLoadProgress?: (uuid: string, progress: number) => void;
    readonly onPhaseChanged?: (phase: PlayerPhase) => void;
    readonly onLoadFirstFrame?: () => void;
    readonly onPlayerStateChanged?: (modifyState: Partial<PlayerState>) => void;
    readonly onStoppedWithError?: (error: Error) => void;
    readonly onScheduleTimeChanged?: (scheduleTime: number) => void;
}
```

### **onHandToolActive**

```js
抓手工具激活/取消回调
```

### **onPPTLoadProgress**

* TypeScript 签名
```typescript
(uuid: string, progress: number) => void;
```

```js
ppt 预加载缓存回调，uuid 为 ppt 转换时的 taskId，progress 为 0~1 之间的两位小数。
```

>只有在初始化 SDK 时，`preloadDynamicPPT`，设置为 true 时，该回调才有用。

### **onPhaseChanged**

```typescript
export enum PlayerPhase {
    //初始化后，正在等待回放信息，此时无法做任何操作，无法获取 player.state 信息
    WaitingFirstFrame = "waitingFirstFrame",
    //正在播放
    Playing = "playing",
    //暂停
    Pause = "pause",
    //中止，无法再次播放，需要重新初始化新的实例
    Stopped = "stop",
    //播放完成
    Ended = "ended",
    //缓冲中
    Buffering = "buffering",
}
```

```js
播放器状态变化回调
```

### **onLoadFirstFrame**

```js
首帧数据加载完成，房间状态由`WaitingFirstFrame`变为其他状态。
```

### **onPlayerStateChanged**

```js
房间状态发生改变时，会回调该 API。
该回调返回的`PlayerState`只包含发生变化的房间状态字段。
```

### **onStoppedWithError**

```js
出现错误，播放器中止播放。
```

### **onScheduleTimeChanged**

```js
时间进度回调
```

## 推荐阅读

1. [状态监听](../features/state.md)
1. [自定义事件-监听、注销](../features/events.md)