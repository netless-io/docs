---
id: js-replay
title: 回放功能
---

## 前提条件

>1. 确定向服务器请求创建房间时，设置为`isRecord`，详情请查看[服务端文档-白板类型](docs/server/api/server-room)。  
>2. 阅读[初始化参数-回放参数](../parameters/player.md)了解初始化回放时，所需要的参数。
>3. 本节中`player`为`sdk`调用`replayRoom`API 后，成功返回的`player`对象。

### white-react-sdk

`white-react-sdk`，可以使用如下方式进行绑定操作：

```javascript
import React from "react";

class App extends React.Component {
    render() {
        return <PlayerWhiteboard player={player}/>;
    }
}
```

## 音视频支持

`sdk`支持在回放时传入音视频地址，具体请查看[初始化参数-回放参数](../parameters/player.md)。`sdk`会主动接管音视频播放，负责处理音视频与`sdk``player`的播放状态同步问题。  
当白板回放与音视频，任意一个进入`缓冲`状态时，`sdk`会自动停止另一个的播放，等待另一方缓冲完毕，并且同时触发`player`的缓冲状态回调。

### 音频

音频，只需要根据[初始化参数-回放参数](../parameters/player.md)，配置正确的音频地址。

### 视频

#### 1. 创建 video 标签

创建需要显示的`video`标签，并将`id`设置为`white-sdk-video-js`。（开发者可以根据业务需要，自行配置该标签的布局）。

>2.2.13 以前的版本，请在`video`标签中，添加`css`名`video-js`

```html
<!-- 根据业务需求，自行设置布局方式 -->
<video id="white-sdk-video-js" class="video-js"></video>
```

#### 2. 引用 videojs css

* 在 `<head>` 标签中引用 sdk

2.3.0 及其以前的版本，需要手动引用 videojs 的 css，

```html
<head>
<link rel="stylesheet" href="https://vjs.zencdn.net/7.6.0/video-js.css">
</head>
```

* 使用 npm 等包管理工具

目前`video-js`为`sdk`的`dependency`依赖，会自动安装。只需要在对应页面调用手动 import 即可。

```js
import "video.js/dist/video-js.css";
```

### 局限性——Safari 限制

由于`iOS`（包括`iOS`微信浏览器以及浏览器`App`）以及`macOS``Safari`的隐私限制——无法通过代码播放音视频（标记`muted`的视频，可以），而`sdk`需要同步`白板回放`与音视频播放，会通过代码进行暂停与播放，所以会造成在`iOS`以及`macOS`的`Safari`上无法正常播放。

* 解决办法

在初始化后，主动调用`player.seekToScheduleTime(0)`触发音视频，以及白板的缓冲，从而保证开发播放时

## 回放时状态监听

>具体请参考[状态管理文档](./state.md)与[初始化参数-回放参数](../parameters/player.md)

## 主动操作API

### 播放

```javascript
player.play();
```

### 快进

你可以通过如下方法快进到特定时间点。``scheduleTime`` 是一个`>=0`的整数（毫秒），它不应该超过回放片段的总时间。

```javascript
player.seekToScheduleTime(scheduleTime);
```

### 暂停

```javascript
player.pause();
```

### 观察模式

#### TypeScript 签名

```Typescript
//player.d.ts
export enum ObserverMode {
    // 跟随当前主播视角，如果当前没有主播，则跟随最早加入房间的用户
    Directory = "directory",
    // 自由模式
    Freedom = "freedom",
}
```

```javascript
// 和实时房间相同，一旦用户进行主动移动，就会变成 freedom 模式
player.setObserverMode("directory");
```

### 终止——施放资源

使用该 API 后， `player` 不再可用，如果需要播放，请重新生成新的实例

```javascript
player.stop();
```

## 相关文档

阅读[初始化参数-回放参数](../parameters/player.md)，查看初始化相关参数。
阅读[快速开始-回放房间](../quick-start/js-start.md)，快速回放一个已经有录制内容的房间。
