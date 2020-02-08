---
id: js-state
title: Status listen
---

## Room status

Definition: A room can include a lot of information, such as `room members`,` user teaching aids`, `current page information`,` page zoom information`, `anchor information`, etc. `sdk` refers to this information as` room status`.

Room state is stored in the `state` of` room` and the `state` property of` player`.
  
> `Room state`, there is a` DisplayerState` basic structure and two `RoomState`,` PlayerState` extended structures, which correspond to the `state` property structure of` room` and `player` respectively.

## TypeScript definition

### DisplayerState and related definitions

```typescript
///Displayer.d.ts

//All read-only
export type DisplayerState = {
    // global state, readable by everyone
    readonly globalState: GlobalState;
    // List of room members
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // Current directory information
    readonly sceneState: SceneState;
};
```

* Related class definitions
```typescript
///Displayer.d.ts

// Basic Object, SDK will have some private fields
export type GlobalState = {};

// User Info
export type RoomMember = {
    // Whiteboard user id, increasing from 0
    readonly memberId: number;
    // User's tool status
    readonly memberState: MemberState;
    // User information, user-defined information passed in during initialization, refer to [Initialization Parameters-Room Parameters] document
    readonly payload: any;
};

// Refer to [Tool operation] document
type MemberState

// Refer to [Page (Scene) Management] document
type SceneState
```

### RoomState definition

```Typescript
///Room.d.ts

type RoomState = {
    // This property can be modified through the API
    readonly globalState: GlobalState;
    // See GlobalState definition
    readonly roomMembers: ReadonlyArray<RoomMember>;
    // Can be modified through the API in [Page (Scene) Management]
    readonly sceneState: SceneState;
    // Can be modified via API in [Use of Teaching Aids]
    readonly memberState: MemberState;
    // Can be modified through the API in [Viewpoint Operations]
    readonly broadcastState: Readonly<BroadcastState>;
    // Can be modified through the API in [Viewpoint Operations]
    readonly zoomScale: number;
};
```

### PlayerState definition

```Typescript
// Player.d.ts

export type PlayerState = {
    // This property can be modified through the API in [Playback Function]
    readonly observerMode: ObserverMode;
    readonly globalState: GlobalState;
    readonly roomMembers: ReadonlyArray<RoomMember>;
    readonly sceneState: SceneState;
};
```

## Get global status

```Typescript
// Get global status
var globalState = room.state.globalState;
// Get current user tool status
var memberState = room.state.memberState;
// Get scene status
var sceneState = room.state.sceneState;
// Anchor user information
var broadcastState = room.state.broadcastState;

// player similar
```

## Status monitoring
### Real-time room state (RoomState)

When the room status (user joins and exits, whiteboard page (scene), user tool changes, anchor, global state) changes, SDK will actively call back the `onRoomStateChanged` method in` callbacks` parameter when `joinRoom`.

> For more callback parameters, please read [Initialization Parameters -> Room Parameters](../parameters/room.md#roomcallbacks)。

```Typescript
// ... Initialize whiteWebSdk and get room authentication information
whiteWebSdk.joinRoom({uuid: uuid, roomToken: roomToken}, {
    // When the state changes callback, modifyRoomState will only include the roomState field that has changed.
    // The content in the corresponding field will be completely transmitted
    onRoomStateChanged: function(modifyRoomState) {
        // Only the changed fields exist
        if (modifyRoomState.globalState) {
            // Complete globalState 
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
    // The connection status of the whiteboard has changed, as follows:
    onPhaseChanged: function(phase) {
        // "connecting",
        // "connected",
        // "reconnecting",
        // "disconnecting",
        // "disconnected",
    },
    // ... other callbacks
}).then(function(room) {
    // room operation
})
```

### Playback Room State (PlayerState)

Similar to `Room`, when using the` replayRoom` method of `sdk` to create a` Player` instance, `onPlayerStateChanged` similar to the` onRoomStateChanged` method also exists in the `callbacks` parameter.
When the playerState changes during playback, the SDK will actively call back the method passed in.

```js
// ... initialize whiteWebSdk and get room authentication information
whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken
}, {
    onPlayerStateChanged: function(modifyState) {
        // similar to roomState
    },
    onPlayerStateChanged: function(scheduleTime) {
        // Time progress callback, milliseconds, scheduleTime is number
    },
    onPhaseChanged：function(phase) {
        // Refer to the content of onPhaseChanged in the [initialization parameter-playback parameter] document
    }
    // ... other callbacks
}).then(function (player){
    //player operate
})
```

> For more callback parameters, please read [Initialization Parameters -> Playback Parameters](../parameters/player.md#playercallbacks)