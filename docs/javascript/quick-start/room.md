---
id: js-room
title: 实时房间
---

## 初始化

```js
// 更多初始化 sdk 参数，请查看[初始化参数]文档
var whiteWebSdk = new WhiteWebSdk();
// 更多初始化 房间 参数，请查看[初始化参数]文档
whiteWebSdk.joinRoom({
    uuid: json.msg.room.uuid,
    roomToken: json.msg.roomToken
}).then(function(room) {
    //将 room 实例绑定在全局变量中。后续所有 API 实例，都会直接调用 room
    window.room = room;
    room.bindHtmlElement(document.getElementById("whiteboard"));
})
```

## 退出房间

```js
room.disconnect().then(function() {
    console.log("Leave room success");
});
```

>离开房间后，`room`实例，无法再使用。
>如果重新进入房间，请调用`sdk`的`joinRoom`防范，重新生成`room`实例。

## 注意点

### 异常处理

开发者需要手动处理以下几种情况：

1. 白板加入失败：
    * 多为白板鉴权，或者网络连接问题。此时可以弹窗告知用户。如果是 401 报错，请检查房间 roomToken 是否正确。
2. 白板中途断连
    * 白板自带一部分断连逻辑，当网络中断时，白板会尝试进行重连，如果白板内部重连失败，则

### 白板大小变化

当白板所绑定的`div`大小发生变化时，需要主动调用`room`的`refreshViewSize`方法。
包括但不限于：
1. 由于浏览器窗体`window`发生变化，导致`div`大小变化。
1. 由于业务需要，主动调整页面布局，造成`div`大小发生变化。
在以上情况后，开发者需手动执行`room.refreshViewSize()`方法。

```js
function refreshViewSize() {
    // 将 room 变量暴露在全局变量时的操作。
    room && room.refreshViewSize();
};
window.addEventListener("resize", refreshViewSize);
//当 div 从 HTML DOM 中移除时，请调用 removeEventListener 移除监听。
```

## 线上代码

[codepen源码](https://codepen.io/leavesster/pen/PooaawL)  
[codepen展示页](https://cdpn.io/leavesster/debug/PooaawL/XBrGRqZGNeKM)

## 相关文档

//TODO:link
* 阅读[状态管理]，监听房间状态变化，进行对应处理。
* 阅读[教具]，以切换使用`画笔`、`矩形`、`圆形`，插入`图片`。
* 阅读[视角操作]，以控制用户可见范围，缩放，移动行为。
* 阅读[白板操作]，以控制用户操作权限
* 阅读[自定义事件]接口，增强白板功能，实现全局通知的业务需求。
* 阅读[白板页面操作API]，实现多页白板，切换需求。
* 阅读[FAQ]，快速实现常见需求。