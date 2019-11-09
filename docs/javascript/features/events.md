---
id: js-events
title: 自定义事件
---

> 回放 replay 不支持发送自定义事件，如需处理特定的自定义事件，需要调用注册监听自定义事件 API

## 发送自定义事件

房间内的任何成员都可以通过如下方法，向房间内所有客户端，广播自定义事件。

```javascript
// event 是事件名，必须是字符串，用于标示该事件名称
// 该事件附带的数据，房间内接收到该事件的同时，可以读取到。`payload` 可以是任意 JavaScript 的 primitive 类型，以及不带嵌套结构的 plain object 或仅包含 plain object 的数组结构。
room.dispatchMagixEvent(event, payload);

// example
room.dispatchMagixEvent("SendGift", {
    senderName: "ZhangJie",
    receiverName: "Lili",
    giftType: "Lamborghini",
    imageIds: [1273, 2653, 23, 17283],
    timestamp: 1541820428865,
});
```

## 监听自定义事件

如果你希望监听房间内其他人发的事件，可以通过如下方式添加事件监听器。

```javascript
room.addMagixEventListener(event, callback);
```

其中 `event` 是事件名，必须是字符串。`callback` 是一个回调函数，当房间内接收到事件时会被回调。我们可以通过如下形式注册事件监听器。

```javascript
function onRecevieGift(eventObject) {
    console.log(eventObject.event); // 事件名称
    console.log(eventObject.payload); // 事件 payload
}
room.addMagixEventListener("SendGift", onRecevieGift);
```

当之前的那一段**发送事件**调用后，控制台将会打印出如下内容。

```json
SendGift
{
    "senderName": "ZhangJie",
    "receiverName": "Lili",
    "giftType": "Lamborghini",
    "imageIds": [1273, 2653, 23, 17283],
    "timestamp": 1541820428865,
},
```

## 注销自定义监听

```javascript
room.removeMagixEventListener(event, callback);
// example
room.removeMagixEventListener("SendGift", onRecevieGift);
```