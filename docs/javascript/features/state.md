---
id: js-state
title: 状态管理
---

本节介绍，如何使用`sdk`对房间进行状态管理。  

我们将用户实时使用，并对外同步的房间，称为 **实时房间**（`对应类为 room`）；将正在回放过去操作的房间，称为 **回放房间**（`对应类为 player`）。

## 实时房间

`room`实例，存在只读属性`state`，其表示房间内容所有状态。

### RoomState 结构

```Typescript
// RoomState 结构
type RoomState = {
    //全局状态，所有人可读可修改[主动修改需调用特定 API]
    readonly globalState: GlobalState;
    // 只读数组：房间用户状态
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // 场景状态，详情见[页面（场景）管理]文档
    readonly sceneState: SceneState;
    // 当前用户的教具状态，详情见[教具使用]文档
    readonly memberState: MemberState;
    // 主播信息，详情见[视角同步]文档
    readonly broadcastState: Readonly<BroadcastState>;
    // 当前白板的缩放比例
    readonly zoomScale: number;
};

// 普通 object，所有人都可以改动，可以用来存储部分自定义信息。
// 动态 ppt 会使用该字段
type GlobalState = {};

// 用户信息
type RoomMember = {
    //白板用户 id，从 0 递增
    readonly memberId: number;
    //用户的教具状态
    readonly memberState: MemberState;
    //用户信息，在初始化时传入的用户自定义信息，参考[初始化参数-房间参数]文档
    readonly payload: any;
};
```

* 示例代码

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

### 主动修改状态

`room.state`为只读属性，修改状态，需要调用以下 API。

```Typescript

// 调用以下 API 时，不需要传入完整的值，只需要传入想要修改的key-value 字段即可。

// 修改全局状态
room.setGlobalState({...});
// 修改自己的教具状态
room.setMemberState({...});
// 修改自己的视角状态，具体查看 [视角同步]文档
room.setViewMode("freedom");
// 修改显示页面，影响所有人，传入的必须是场景的完整路径，而不是场景目录，具体请查看 [页面（场景）管理]文档
room.setScenePath("/ppt/1")
```
>默认情况下，自己本地主动修改的房间状态，不会进入`onRoomStateChanged`回调监听。如果需要开启回调，请在初始化 sdk 时，根据[初始化参数-SDK参数](../parameters/sdk.md#onlycallbackremotestatemodify)配置`onlycallbackremotestatemodify`字段。

#### GlobalState 使用

* 自定义`GlobalState`

`globalState`目前为一个`Object`，开发者可以在`globalState`插入自己的字段，从而在整个房间中共享自己业务所需要的状态信息。

* 注意点

`globalState`仅限轻量级使用，存储内容尽可能小（建议100KB以内），更新时，只传入`GlobalState`中需要更新的字段。

### 监听房间状态(RoomState)

当房间状态（用户加入退出，白板页面（场景），用户教具变化，主播，全局状态）发生改变时，sdk 会主动回调在`joinRoom`时，`callbacks`参数中的`onRoomStateChanged`方法。

>更多回调参数使用，请阅读[初始化参数-房间参数](../parameters/room.md#roomcallbacks)。

```Typescript
sdk.joinRoom({uuid: uuid, roomToken: roomToken}, {
    // 状态变化回调时，modifyRoomState 只会包含发生了改变的 roomState 字段。
    // 对应字段里的内容，都会完整传递
    onRoomStateChanged: function(modifyRoomState) {
        // 只有发生改变的字段，才存在
        if (modifyRoomState.globalState) {
            // 完整的 globalState 
            var newGlobalState = modifyRoomState.globalState;
        }
        if (modifyRoomState.memberState) {
            var newMemberState = modifyRoomState.memberState;
        }
        if (modifyRoomState.sceneState) {
            var newSceneState = modifyRoomState.sceneState;
        }
        if (modifyRoomState.broadcastState) {
            var broadcastState = modifyRoomState.broadcastState;
        }
    },
    // 白板连接状态改变, 具体状态如下:
    onPhaseChanged: function(phase) {
        // "connecting",
        // "connected",
        // "reconnecting",
        // "disconnecting",
        // "disconnected",
    },
    // ...其他回调
}).then(function(room) {
    // room 房间操作
})
```

## 回放房间

与`Room` 相似，`Player`也存在一个只读`state`属性，只是结构上存在部分差异。  
除了`state`属性外，`player`还存在一些额外的只读属性，来描述`Player`的一些内容。

### Player 属性结构

```Typescript
interface Player {
    // 回放的房间 uuid
    readonly roomUUID: string;
    // 分片 id，可忽视
    readonly slice?: string;
    // Player 播放状态
    readonly phase: PlayerPhase;
    // state 属性
    readonly state: PlayerState;
    // 当前已播放时长，毫秒
    readonly scheduleTime: number;
    // 总时长，毫秒
    readonly timeDuration: number;
    // 可忽视
    readonly framesCount: number;
    // 开始播放的 utc 时间戳，毫秒。
    readonly beginTimestamp: number;
}

export enum PlayerPhase {
    WaitingFirstFrame = "waitingFirstFrame", //正在加载资源，此时无法访问 player.state
    Playing = "playing", //正在播放
    Pause = "pause", //已暂停
    Stopped = "stop", //已停止，停止后，Player 无法再次播放，如需重新播放，请重新创建 Player 实例
    Ended = "ended", //已结束
    Buffering = "buffering", //正在缓冲
}

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

### 监听回放状态(PlayerState)

与`Room`相似，在使用`sdk`的`replayRoom`方法创建`Player`实例时，`callbacks`参数中也存在类似`onRoomStateChanged`方法的`onPlayerStateChanged`。
当回放过程中，`playerState`发生变化，`sdk`都会主动回调传入的该方法。

```js
whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken
}, {
    onPlayerStateChanged: function(modifyState) {
        // 与 roomState 类似
    },
    onPlayerStateChanged: function(scheduleTime) {
        // 时间进度回调，毫秒，scheduleTime 为 number
    },
    onPhaseChanged：function(phase) {
        // 参考[初始化参数-回放参数]文档中 onPhaseChanged 内容
    }
    // ...其他回调
}).then(function (player){
    //player 操作
})
```

>更多回调参数使用，请阅读[初始化参数-回放参数](../parameters/player.md#playercallbacks)