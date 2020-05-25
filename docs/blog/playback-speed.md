---
id: playback-speed
title: 播放速率（三端）
---

## 倍速播放

新增倍率播放 API，可以修改白板回放时的播放速率（暂停后，该属性不会被修改，再次调用播放，该值仍然有效）

### Web

>`player`2.5.8版本，新增`playbackSpeed`属性，可以指定回放时的播放速率。

#### 带视频回放

目前`player`的`playbackSpeed`属性，暂时只支持白板本身。
通过回放时，`media`挂载的音视频，暂时不会被`playbackSpeed`影响。
白板本身是通过`videojs`来操作音视频的，所以可以通过`videojs`的播放器，修改音视频的播放速率。

```js
const videoJsId = "white-sdk-video-js";
const mediaPlayer = videojs.getPlayer(videoJsId);
// https://docs.videojs.com/docs/api/player.html#MethodsplaybackRate
mediaPlayer.playbackRate(1.25);
```

>vue 用户的 mediaPlayer 可以为 dom 节点，操作略有不同。

### iOS

>whiteboard 开源版本 2.5.8 新增 API。

* 单独白板操作

如果单独白板播放，直接操作`WhitePlayer.playbackSpeed`即可。同样不支持对在创建回放时，带入的`mediaUrl`音频，进行速率调整。

* 使用WhiteCombinePlayer同时播放音视频与白板

如果使用sdk提供的`WhiteCombinePlayer`来处理音视频+白板同步播放，则设置`WhiteCombinePlayer.playbackSpeed`即可。

### Android

>Android 2.5.3 新增 API。

* 白板单独操作

如果单独白板操作，直接操作`Player.playbackSpeed`。同样不支持对在创建回放时，带入的`mediaUrl`音频，进行速率调整。

* 使用PlaySyncManager同时播放音视频与白板
docs/android/guides/replay.md
首先根据 [android-音视频播放](../android/guides/replay.md#视频支持) 接入并实现 nativePlayer 接口。然后在 nativePlayer 自己实现 seek，在修改音视频播放速率的同时，调用`Player`的`playbackSpeed`API。
