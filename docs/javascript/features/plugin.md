---
id: js-plugin
title: Plugins
---

## Video and audio plugins (supports mp3 / mp4)

** Prerequisites for Integration **

> The SDK version is upgraded to 2.5.4 or higher (the version that can be displayed on iOS is 2.5.7, and the version that can be displayed on Android is 2.5.1).
> If the insert call is invalid, it means that it is in the old environment of 2.3.x, please contact us to switch to the support plugin environment (support@netless.link).

Control video, audio playback, pause, and drag progress bar on a whiteboard. The effect is as follows:

**Video**

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/video_board.mp4">
</video>


**Audio**

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/audio_plugin.mp4">
</video>

## Install the cursor-adapter library

``` bash
npm install @netless/white-video-plugin -save
npm install @netless/white-audio-plugin -save

or

yarn add @netless/white-video-plugin
yarn add @netless/white-audio-plugin
```

## Load plugin

```tsx
    import {WhiteWebSdk, createPlugins} from "white-web-sdk";
    // 1.Introduce the corresponding library videoPlugin
    import {videoPlugin} from "@ netless / white-video-plugin";
    // 2, createPlugins method can construct plugins
    const plugins = createPlugins ({"video": videoPlugin, "audio": audioPlugin});
    // 3, setPluginContext method can set plugin who can control
    plugins.setPluginContext ("video", {identity: "host"}); // if identity is a teacher, host is a student guest
    plugins.setPluginContext ("audio", {identity: "host"});
    // 4.Load plugins during initialization
    whiteWebSdk = new WhiteWebSdk ({plugins: plugins});
```

## 启用 plugin

```tsx
    // 5. Insert video plugin
    room.insertPlugin("video", {
        originX: 0, // Relative position of inserted video originX: 0 originY: 0 is exactly in the middle
        originY: 0,
        width: 480, // Insert the width of the video component
        height: 270, // Insert the height of the video component
        attributes: {
            pluginVideoUrl: url, // Insert the network address of the video. Note that resources allow cross-domain access when debugging
        },
    });
   // 6. insert audio plugin (fields are the same as above)
    room.insertPlugin("audio", {
        originX: 0,
        originY: 0,
        width: 480,
        height: 86,
        attributes: {
            pluginAudioUrl: url,
        },
    });
```