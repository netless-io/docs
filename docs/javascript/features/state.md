---
id: js-state
title: 状态监听
---

## 房间状态

定义：一个房间，可以包括很多信息，例如`房间成员`，`用户教具`，`当前页面信息`，`页面缩放信息`，`主播信息`等。`sdk`将这些信息统称为`房间状态`。

房间状态，存储在`room`的`state`，以及`player`的`state`属性中。
  
>`房间状态`，存在一个`DisplayerState`基础结构和两个`RoomState`,`PlayerState`扩展结构，分别对应`room`,`player`的`state`属性结构。

## TypeScript 定义

### DisplayerState 及其相关定义

```typescript
///Displayer.d.ts

//均为只读属性
export type DisplayerState = {
    // 全局状态，所有人可读
    readonly globalState: GlobalState;
    // 房间成员列表
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // 当前目录信息
    readonly sceneState: SceneState;
};
```

* 相关类定义

```typescript
///Displayer.d.ts

//基础 Object，sdk 会有部分私有字段
export type GlobalState = {};

// 用户信息
export type RoomMember = {
    //白板用户 id，从 0 递增
    readonly memberId: number;
    //用户的教具状态
    readonly memberState: MemberState;
    //用户信息，在初始化时传入的用户自定义信息，参考[初始化参数-房间参数]文档
    readonly payload: any;
};

// 参考[教具操作]文档
type MemberState

// 参考[页面（场景）管理]文档
type SceneState
```

### RoomState 定义

```Typescript
///Room.d.ts

type RoomState = {
    // 可以通过 API 修改该属性
    readonly globalState: GlobalState;
    // 见 GlobalState 定义
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // 可以通过 [页面（场景）管理] 中的API 修改
    readonly sceneState: SceneState;
    // 可以通过 [教具使用] 中的 API 修改
    readonly memberState: MemberState;
    // 可以通过 [视角操作] 中的 API 修改
    readonly broadcastState: Readonly<BroadcastState>;
    // 可以通过 [视角操作] 中的 API 修改
    readonly zoomScale: number;
};
```

### PlayerState 定义

```Typescript
///Player.d.ts

export type PlayerState = {
    // 该属性可以通过[回放功能] 中的 API 修改
    readonly observerMode: ObserverMode;
    readonly globalState: GlobalState;
    readonly roomMembers: ReadonlyArray<RoomMember>;
    readonly sceneState: SceneState;
};
```

## 状态获取

```Typescript
// 获取全局状态
var globalState = room.state.globalState;
// 获取当前用户教具状态
var memberState = room.state.memberState;
// 获取场景状态
var sceneState = room.state.sceneState;
// 主播用户信息
var broadcastState = room.state.broadcastState;

// player 类似
```

## 状态监听

### 实时房间状态(RoomState)

当房间状态（用户加入退出，白板页面（场景），用户教具变化，主播，全局状态）发生改变时，sdk 会主动回调在`joinRoom`时，`callbacks`参数中的`onRoomStateChanged`方法。

> 更多回调参数使用，请阅读[初始化参数-房间参数](../parameters/room.md#roomcallbacks)。

```Typescript
//... 初始化 whiteWebSdk，获取房间鉴权信息
whiteWebSdk.joinRoom({uuid: uuid, roomToken: roomToken}, {
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

### 回放房间状态(PlayerState)

与`Room`相似，在使用`sdk`的`replayRoom`方法创建`Player`实例时，`callbacks`参数中也存在类似`onRoomStateChanged`方法的`onPlayerStateChanged`。
当回放过程中，`playerState`发生变化，`sdk`都会主动回调传入的该方法。

```js
//... 初始化 whiteWebSdk，获取房间鉴权信息
whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken
}, {
    onPlayerStateChanged: function(modifyState) {
        // 与 roomState 类似
    },
    onScheduleTimeChanged: function(scheduleTime) {
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

> 更多回调参数使用，请阅读[初始化参数-回放参数](../parameters/player.md#playercallbacks)
