---
id: js-player
title: Replay parameters
---

`room` and` player` are actually subclasses of the internal `displayer`. In the `TypeScript` signature, the method signatures starting with` /// Displayer.d.ts` can be used in both `room` and` player`.

We will play back the room that was operated in the past, called ** playback room ** (the corresponding class is player`).

## Initialize the API

### TypeScript signature

```typescript
//WhiteWebSdk.d.ts
replayRoom(params: ReplayRoomParams, callbacks?: PlayerCallbacks): Promise<Player>;
```

### Sample

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
    // Failed to initialize playback
    console.log(e);
});
```

## ReplayRoomParams parameter Description

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

| parameter |  description | remark |
| ---- | ---- | --- |
| **uuid** | Uuid of playback room | Required, and the room must be in `playable mode`|
| slice | Playback Room Fragment Address |sdk will find the data in the corresponding room according to the beginTimestamp and duration parameters, no need to fill in|
| **roomToken** | Room authentication token | require |
| beginTimestamp | Unix timestamp in milliseconds when playback started | Optional, if not filled, playback will start from room creation |
| duration |Playback duration (ms)| Optional, if not filled, it will last until the last time all users log out|
| mediaURL | Audio and video address (sdk is responsible for synchronous playback status)| Optional. If there is, the whiteboard will uniformly play progress and playback status. When the whiteboard or media file enters the buffering state, it will be buffered (PlayerPhase enters the buffering state)|

## PlayerCallbacks Parameter Description

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
Hand tool activation / deactivation callback
```

### **onPPTLoadProgress**

* TypeScript signature
```typescript
(uuid: string, progress: number) => void;
```

```js
ppt preload cache callback, uuid is taskId during ppt conversion, and progress is two decimal places between 0 and 1.
```

> This callback is only useful when the SDK is initialized with `preloadDynamicPPT` set to true

### **onPhaseChanged**

```typescript
export enum PlayerPhase {
    // After initialization, it is waiting for playback information. At this time, no operation can be performed, and player.state information cannot be obtained.
    WaitingFirstFrame = "waitingFirstFrame",
    // Playing
    Playing = "playing",
    // Stop
    Pause = "pause",
    // Aborted, unable to play again, new instance needs to be re-initialized
    Stopped = "stop",
    // Play completed
    Ended = "ended",
    // Buffering
    Buffering = "buffering",
}
```

```js
Player state change callback
```

### **onLoadFirstFrame**

```js
The first frame of data is loaded, and the state of the room changes from `WaitingFirstFrame` to another state.
```

### **onPlayerStateChanged**

```js
This API is called back when the room status changes.
The `PlayerState` returned by this callback contains only the room state fields that have changed.
```

### **onStoppedWithError**

```js
An error occurred and the player stopped playing.
```

### **onScheduleTimeChanged**

```js
Time progress callback
```

## Recommended reading

1. [Status monitoring](../features/state.md)
1. [Custom events-listen, logout](../features/events.md)