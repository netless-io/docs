---
id: js-replay
title: Replay
---

## Prerequisite

// TODO
>
> 1. Make sure that when requesting the server to create a room, the room type is `Playable Room`. For details, please see [Server-side Document -> Whiteboard Type](server/api/whiteboard-base.md#%E5%88%9B%E5%BB%BA%E7%99%BD%E6%9D%BF)。  
> 2. Read [Initialization Parameters -> Playback Parameters](../parameters/player.md) to understand the parameters required when initializing playback.
> 3. In this section, `player` is the `player` object that was successfully returned after `sdk` called `replayRoom` API.

### white-react-sdk

`white-react-sdk`, you can use the following methods for binding operations:

```javascript
import React from "react";

class App extends React.Component {
    render() {
        return <PlayerWhiteboard player={player}/>;
    }
}
```

## Audio and video support

`sdk` supports the input of audio and video addresses during playback. For details, please refer to [Initialization Parameters -> Playback Parameters](../parameters/player.md). `sdk` will actively take over the playback of audio and video, and is responsible for handling the synchronization status of audio and video with`sdk 'player.
When any one of the whiteboard playback and audio and video enters the`buffer`state,`sdk`will automatically stop the playback of the other, wait for the other party to finish buffering, and trigger the buffer state callback of`player` at the same time.

### Audio

For audio, you only need to configure the correct audio address according to [Initialization Parameters -> Playback Parameters](../parameters/player.md).

### Video

#### 1. Create a video tag

Create a `video` tag to display and set the`id` to `white-sdk-video-js`. (Developers can configure the layout of the label themselves according to business needs.)

> Before 2.2.13, please add the `css` name`video-js` in the `video` tag

```html
<!-- According to business needs, set the layout method by yourself -->
<video id="white-sdk-video-js" class="video-js"></video>
```

#### 2. Quote videojs css

* Reference sdk in the <head> tag

2.3.0 and previous versions need to manually reference the css of videojs

```html
<head>
<link rel="stylesheet" href="https://vjs.zencdn.net/7.6.0/video-js.css">
</head>
```

* Use package management tools like npm

Currently `video-js` is a`dependency` dependency of `sdk` and will be installed automatically. Just call manual import on the corresponding page.

```js
import "video.js/dist/video-js.css";
```

### Limitations-Safari limitations

Due to the privacy restrictions of `iOS` (including`iOS` WeChat browser and browser `App`) and`macOS Safari`-audio and video cannot be played through code (videos marked with `muted` are OK), and`sdk` needs to synchronize `whiteboard playback` with audio and video playback. It will be paused and played by code, so it will cause normal playback on`iOS` and `macOS` Safari.

* Solution

After initialization, call `player.seekToScheduleTime (0)` to touch the video and the buffer of the whiteboard, so as to ensure the development of playback

## Status monitoring during playback

> For details, please refer to [Status Management Document](./state.md) and [Initialization Parameters -> Playback Parameters](../parameters/player.md)

## Proactive API

### Play

```javascript
player.play();
```

### Seek

You can fast forward to a specific point in time as follows. ``scheduleTime`` is an integer (milliseconds) with `>=0`, it should not exceed the total time of the playback segment.

```javascript
player.seekToScheduleTime(scheduleTime);
```

### Stop

```javascript
player.pause();
```

### Observation mode

#### TypeScript signature

```Typescript
//player.d.ts
export enum ObserverMode {
    // Follow the current anchor angle, if there is no current anchor, follow the oldest user who joined the room
    Directory = "directory",
    // Free mode
    Freedom = "freedom",
}
```

```javascript
// Same as a real-time room, once the user actively moves, it will become "freedom" mode
player.setObserverMode("directory");
```

### Termination-release resources

After using this API, `player` is no longer available, if you need to play, please regenerate a new instance

```javascript
player.stop();
```

## Related documents

Read[Initialization parameters -> playback parameters](../parameters/player.md), to view initialization related parameters.
Read[Quick Start -> Playback Room](../quick-start/replay.md), quick playback of a room that already has recordings
