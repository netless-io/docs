---
id: js-room
title: Real-time room
---

## initialization

> Here the json is in [get roomToken](./js-token#获取特定房间-roomtoken) json object obtained in step

```js
// For more initialization sdk parameters, please see the [initialization parameters] document
var whiteWebSdk = new WhiteWebSdk();
// For more initialization room parameters, please see the [Initialization Parameters] document
whiteWebSdk.joinRoom({
    uuid: json.msg.room.uuid,
    roomToken: json.msg.roomToken
}).then(function(room) {
    // Bind the room instance to a global variable. All subsequent API instances will directly call room
    window.room = room;
    room.bindHtmlElement(document.getElementById("whiteboard"));
})
```

## Exit the room

```js
room.disconnect().then(function() {
    console.log("Leave room success");
});
```

> After leaving the room, the `room` instance can no longer be used.
> If you re-enter the room, please call `joinRoom` of` sdk` to prevent regenerating the `room` instance.

## be careful

### Exception handling

Developers need to handle the following situations manually:

1. Whiteboard failed to join:
    * Mostly for whiteboard authentication or network connection issues. At this time, you can pop up the window to inform the user. If it is a 401 error, please check whether the room roomToken is correct.
2. Whiteboard disconnected halfway
    * 白板自带一部分断连逻辑，当网络中断时，白板会尝试进行重连，如果白板内部重连失败，则提示失败。

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

## 推荐

* [初始化参数-房间参数](../parameters/room.md)：房间初始化时，可以进行的相关配置。
* [状态监听](../features/state.md)：监听房间状态（成员加入退出，房间页面等）变化。
* [教具操作](../features/tools.md)：使用`画笔`、`矩形`、`圆形`，插入`图片`。
* [视角操作](../features/view.md)：控制用户可见范围，缩放，移动行为。
* [白板操作](../features/operation.md)：控制用户权限。
* [自定义事件](../features/events.md)：增强白板功能，实现全局通知的业务需求。
* [页面操作](../features/scenes.md)：实现多页白板，切换需求。