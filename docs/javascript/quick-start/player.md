---
id: js-player
title: 回放房间
---

## 快速播放

```js
var roomUUID = "..."; // 必须项，回放房间的 uuid，该房间必须为可回放房间（参考 server 端创建房间 API）
var roomToken = ".."; // 必须项，回放房间对应的 roomToken
// 更多初始化 sdk 参数，请查看[初始化参数]文档
var whiteWebSdk = new WhiteWebSdk();
// 更多初始化 回放房间 参数，请查看[初始化参数]文档
whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken
}).then(function(player) {
    // 与 room 调用类似，在获取到 player 实例后，需要将 player 绑定到HTML 中的 div 中
    player.bindHtmlElement(document.getElementById('whiteboard'));
    // 播放
    player.play();
})
```

## 结束回放

```js
player.stop();
```

调用`stop`API后，`player`资源会被施放，无法再次播放。如需重新播放，需要重新使用`sdk`调用`replayRoom`方法，重新生成`player`实例。

## 注意点

### 初始化异常处理

初始化回放房间 API 返回一个 promise，其中可能会产生错误（房间鉴权信息错误，音视频解析出错）等情况。需要在异常中进行处理，并且此时，房间初始化失败，需要重新初始化。

### 回放状态处理

回放需要从服务器端获取资源，当回放状态变更由`waitingFirstFrame`变更为`paused`才能播放。更多信息，请查看[回放功能]文档，了解

### 带视频回放限制

由于 Safari 有较为严格的隐私限制，带声音的音视频文件，无法通过代码播放。
目前 Safari 以及 iOS 端的回放，需要`player`缓冲完毕后（查看[回放功能]文档，了解回放状态），再允许用户主动点击进行播放。

### 白板大小变化

当白板所绑定的`div`大小发生变化时，需要主动调用`room`的`refreshViewSize`方法。
包括但不限于：
1. 由于浏览器窗体`window`发生变化，导致`div`大小变化。
1. 由于业务需要，主动调整页面布局，造成`div`大小发生变化。
在以上情况后，开发者需手动执行`room.refreshViewSize()`方法。

```js
function resize() {
  player && player.refreshViewSize();
}

window.addEventListener("resize", resize);
//当 div 从 HTML DOM 中移除时，请调用 removeEventListener 移除监听
```

## 线上代码

* 纯白板回放：

[codepen源码](https://codepen.io/leavesster/pen/pooKVaM)  
[codepen展示页](https://cdpn.io/leavesster/debug/pooKVaM/ZorBazKxbJJM)

## 相关文档

* 阅读[状态管理]，以处理回放时，房间状态(房间人数，页面状态，全局状态)等变化
* 阅读[回放功能]，了解更多功能：
    1. 如何支持带音视频回放
    1. 回放控制：播放，暂停，快进，释放资源
* 阅读[自定事件]，复现实时房间中，根据开发者特有业务，使用的自定义事件重现。
* 阅读[白板操作]，管理回放时，用户交互逻辑(移动，缩放白板)