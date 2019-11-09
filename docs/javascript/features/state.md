---
id: js-state
title: 状态管理
---

本章介绍，如何使用 sdk 对房间进行状态管理。  
由于 sdk 在 2.0 版本新增录制功能，而播放录制时，也同样存在状态管理 API，我们将在本章中一同介绍。  
为了区分以上两种情况，本章将用户实时使用，并对外同步的房间，称为 **实时房间**（`对应类为 room`）；将正在回放过去操作的房间，称为 **回放房间**（`对应类为 player`）。

## 实时房间

`room` 为 初始化 sdk 后，调用 `joinRoom` 方法返回的 `room` 实例。  
本文所有实时房间 API，都可以在 `Room.d.ts` 文件中查看。

### 获取状态

`room` 有 `state`，通过 `room.state` 即可获取房间状态。  
以下是 `room.state` 状态结构：

```Typescript
// RoomState 结构
type RoomState = {
    //全局状态，所有人可读可修改
    readonly globalState: GlobalState;
    // 只读数组：房间用户状态
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // 场景状态，详情见[场景管理]文档
    readonly sceneState: SceneState;
    // 当前用户的教具状态，详情见[教具使用]文档
    readonly memberState: MemberState;
    // 主播信息，详情见[视角同步]文档
    readonly broadcastState: Readonly<BroadcastState>;
    // 当前白板的缩放比例
    readonly zoomScale: number;
};
```

* 部分 roomState 属性定义

```Typescript
// 普通 object，所有人都可以改动，可以用来存储部分自定义信息。
// 动态 ppt 会使用字段
declare type GlobalState = {};
// 只读Object
type RoomMember = {
    //白板用户 id，递增
    readonly memberId: number;
    //用户的教具状态
    readonly memberState: MemberState;
    //用户信息
    readonly information?: MemberInformation;
};
```

* Example

```Typescript
// 获取全局状态
var globalState = room.state.globalState;
// 获取当前用户教具状态
var memberState = room.state.memberState;
// 获取场景状态
var sceneState = room.state.sceneState;
// 主播用户信息
var broadcastState = room.state.broadcastState;
```

### 修改状态

`room.state` 为只读属性，修改状态，需要调用以下 API时，不需要传入完整的值，只需要传入想要修改的key-value 即可。

```Typescript
// 修改全局状态
room.setGlobalState({...});
// 修改自己的状态，不会影响其他人
room.setMemberState({...});
// 修改自己的视角状态，具体查看 视角同步文档
room.setViewMode("freedom");
// 修改场景状态，传入的必须是场景的完整路径，而不是场景目录，具体请查看 场景管理文档
room.setScenePath("/ppt/1")
```

### 状态以及生命周期变化回调

在初始化 sdk，调用 sdk `joinRoom` 方法时，可以传入一个 callback 回调。当房间状态发生改变（有用户加入退出，场景变化，全局状态发生改变等）时，sdk 会回调 callback 中的 `onRoomStateChanged` 方法，只有修改的值才会在该方法中传入。
该回调，不仅可以监听白板的状态变化，还可以监听白板的生命周期状态和异常原因，具体使用如下：

```Typescript
sdk.joinRoom({uuid: uuid, roomToken: roomToken}, {
    onRoomStateChanged: function(modifyState) {
        if (modifyState.globalState) {
            // globalState 发生改变
            var newGlobalState = modifyState.globalState;
        }
        if (modifyState.memberState) {
            // memberState 发生改变
            var newMemberState = modifyState.memberState;
        }
        if (modifyState.sceneState) {
            // sceneState 发生改变
            var newSceneState = modifyState.sceneState;
        }
        if (modifyState.broadcastState) {
            // broadcastState 发生改变
            var broadcastState = modifyState.broadcastState;
        }
    },
    // 白板发生状态改变, 具体状态如下:
    onPhaseChanged: phase => {
        // "connecting",
        // "connected",
        // "reconnecting",
        // "disconnecting",
        // "disconnected",
    },
    onDisconnectWithError: error => {
        // 出现连接失败后的具体错误
    },
    onKickedWithReason: reason => {
        // 被踢出房间的原因
    }
});
```

## 回放房间

`player` 为 初始化 sdk 后，调用 `replayRoom` 方法返回的 `player` 实例。  
本文所有实时房间 API，都可以在 `Player.d.ts` 文件中查看。

### 状态获取

与白板 `Room` 相似，回放 `Player` 的状态，也是直接通过访问 `Player` 的属性进行获取。  
回放 `Player` 实例也有一个 `state` 属性。但是 `Player` 不仅仅存在这些状态，`player` 还存一些其他只读属性。

```Typescript
interface Player {
    // 回放的房间 uuid
    readonly roomUUID: string;
    // 分片 id，忽视
    readonly slice?: string;
    // Player 播放状态
    readonly phase: PlayerPhase;
    // state 属性
    readonly state: PlayerState;
    // 当前已播放时长
    readonly scheduleTime: number;
    // 总时长
    readonly timeDuration: number;
    readonly framesCount: number;
    // 开始的 utc 时间
    readonly beginTimestamp: number;
}
```

* state 结构

```Typescript
export type PlayerState = {
    readonly observerMode: ObserverMode;
    readonly globalState: GlobalState;
    //只读数组：当前用户信息
    readonly roomMembers: ReadonlyArray<RoomMember>;
    readonly sceneState: SceneState;
};

export enum ObserverMode {
    // 跟随主播，如果没有主播，则跟随 roomMembers 中，id 最小的用户
    Directory = "directory",
    // 类似自由模式
    Freedom = "freedom",
}
```

### 状态以及生命周期变化回调

与 `Room` 相似，在使用 sdk  `replayRoom` 方法，创建 `Player` 时，sdk 允许传入 `callback` 回调，当回放房间发生状态变化时，sdk 会回调 `callback` 中对应的方法。

```Typescript
export type PlayerCallbacks =  {
    readonly onCatchErrorWhenAppendFrame?: (userId: number, error: Error) => void;
    readonly onCatchErrorWhenRender?: (error: Error) => void;
    // 回放房间状态发生改变
    // WaitingFirstFrame = "waitingFirstFrame", 正在加载资源
    // Playing = "playing", 正在播放
    // Pause = "pause", 已暂停
    // Stopped = "stop", 已停止，停止后，Player 无法再次播放，如需重新播放，请重新创建 Player 实例
    // Ended = "ended", 已结束
    // Buffering = "buffering", 正在缓冲
    readonly onPhaseChanged?: (phase: PlayerPhase) => void;
    // 已加载第一帧画面
    readonly onLoadFirstFrame?: () => void;
    readonly onSliceChanged?: (slice: string) => void;
    // player.state 发生任意变化。与 room 相似，该回调只会传入变化部分的值
    readonly onPlayerStateChanged?: (modifyState: Partial<PlayerState>) => void;
    readonly onStoppedWithError?: (error: Error) => void;
    // 播放进度回调
    readonly onScheduleTimeChanged?: (scheduleTime: number) => void;
};
```