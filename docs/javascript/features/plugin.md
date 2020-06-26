---
id: js-plugin
title: 集成白板插件
---

## 视频、音频插件（支持 mp3 / mp4）

### 集成前提

> SDK 版本升级到 2.5.4 以上 (iOS 端可以显示的版本为: 2.5.7，Android 端可以显示的版本为： 2.5.1)。
> 如果插入调用无效，说明是在 2.3.x 的旧版环境，请联系我们切换到支持 plugin 环境（support@netless.link）。 

在一个白板上面控制视频、音频的播放、暂停、拖动进度条。效果如下：

### 视频

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/video_board.mp4">
</video>

### 音频

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/audio_plugin.mp4">
</video>

## 安装 cursor-adapter 库

``` bash
npm install @netless/white-video-plugin -save
npm install @netless/white-audio-plugin -save

或者

yarn add @netless/white-video-plugin
yarn add @netless/white-audio-plugin
```

## 载入 plugin

```tsx
    import { WhiteWebSdk, createPlugins } from "white-web-sdk";
    // 1、引入对应的库 videoPlugin
    import {videoPlugin} from "@netless/white-video-plugin";
    // 2、createPlugins 方法可以构造出 plugins
    const plugins = createPlugins({"video": videoPlugin, "audio": audioPlugin});
    // 3、setPluginContext 方法可以设置 plugin 谁可以控制
    plugins.setPluginContext("video", {identity: "host"}); // 如果身份是老师填 host 是学生 guest
    plugins.setPluginContext("audio", {identity: "host"});
    // 4、初始化的时候载入 plugins
    whiteWebSdk = new WhiteWebSdk({
        appIdentifier: "{{appIdentifier}}",
        plugins: plugins
    });
```

## 启用 plugin

```tsx
    // 5、插入视频 plugin
    room.insertPlugin("video", {
        originX: 0, // 插入视频的相对位置 originX: 0 originY: 0 是正中间
        originY: 0,
        width: 480, // 插入视频组件的宽
        height: 270, // 插入视频组件的高
        attributes: {
            pluginVideoUrl: url, // 插入视频的网络地址，注意调试的时候资源允许跨域访问
            poster: url, // 封面地址
            isNavigationDisable: boolean // 是否禁用导航栏 true 为禁用
        },
    });
    // 6、插入音频 plugin （字段同上）
    room.insertPlugin("audio", {
        originX: 0,
        originY: 0,
        width: 480,
        height: 86,
        attributes: {
            pluginAudioUrl: url,
            poster: url,
            isNavigationDisable: boolean
        },
    });
```
