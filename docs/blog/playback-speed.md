---
id: playback-speed
title: Playback speed
---

## Double speed playback

Added the magnification playback API, which can modify the playback rate during whiteboard playback (after pausing, this property will not be modified, and calling playback again, the value is still valid)

### Web

> `player` version 2.5.8, add`playbackSpeed` property, you can specify the playback speed during playback

#### With video playback

Currently, the `playbackSpeed` property of`player` currently only supports the whiteboard itself.
During playback, the audio and video mounted by `media` will not be affected by`playbackSpeed` for the time being.
The whiteboard itself operates audio and video through `videojs`, so you can modify the playback rate of audio and video through the`videojs` player.

```js
const videoJsId = "white-sdk-video-js";
const mediaPlayer = videojs.getPlayer(videoDom);
// https://docs.videojs.com/docs/api/player.html#MethodsplaybackRate
mediaPlayer.playbackRate(1.25);
```

> The media player of the Vue user can be a DOM node, with slightly different operations.

### iOS

> Whiteboard open source version 2.5.8 New API.

* Separate whiteboard operation

If you play on the whiteboard alone, you can directly operate `WhitePlayer.playbackSpeed`. It also does not support rate adjustment of the `mediaUrl` audio that is brought in when creating playback.

* Use WhiteCombinePlayer to play audio and video and whiteboard at the same time

If you use the `WhiteCombinePlayer` provided by the SDK to handle audio and video whiteboard synchronous playback, set`WhiteCombinePlayer.playbackSpeed`.

### Android

> Android 2.5.3 new API.

* Separate whiteboard operation

If you operate it on the whiteboard alone, operate `Player.playbackSpeed` directly. It also does not support rate adjustment of the `mediaUrl` audio that is brought in when creating playback.

* Use PlaySyncManager to play audio and video and whiteboard at the same time
docs/android/guides/replay.md
First access and implement the nativePlayer interface according to [android-audio and video playback] (/ docs / android / guides / replay.md # video support). Then in nativePlayer implement seek itself, while modifying the audio and video playback rate, call the `PlaybackSpeed` API of`Player`.
