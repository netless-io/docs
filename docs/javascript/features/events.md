---
id: js-events
title: 自定义事件
---

## 发送自定义事件

>回放`replay`不支持发送自定义事件

开发者可以使用`room`的`dispatchMagixEvent`向房间所有客户端发送消息。

### TypeScript 方法签名

```typescript
/**
 * 发送自定义事件
 * @param event 自定义事件名称，其他客户端注册对该字段的事件监听，才能收到回调
 * @param payload 发送内容，可以为任何可以被 JSON 序列化的数据。
 */
public dispatchMagixEvent(event: string, payload: any): void;
```

### 注意点

该 API 为轻量级处理，不保证在高频，大量`payload`数据场景情况下的稳定性。

### 示例代码

```javascript
room.dispatchMagixEvent("SendGift", {
    senderName: "ZhangJie",
    receiverName: "Lili",
    giftType: "Lamborghini",
    imageIds: [1273, 2653, 23, 17283],
    timestamp: 1541820428865,
});
```

## 监听自定义事件

### TypeScript 方法签名

* 普通自定义事件监听

```typescript

///Displayer.d.ts
//Room 与 Player 通用

// 自定义事件监听
/**
 * 高频自定义事件监听
 * @param name 自定义事件名称
 * @param listener 自定义事件回调(一次性返回大量 Event)
 */
public addMagixEventListener(name: string, listener: EventListener): void;

export type EventListener = (event: Event) => void;

export type Event = {
    //自定义信息名称
    readonly event: string;
    //事件信息
    readonly payload: any;
    //发送者 memberId
    readonly authorId: number;
    readonly scope: Scope;
    readonly phase: EventPhase;
};
```

* 高频自定义事件监听

```typescript
/**
 * 高频自定义事件监听
 * @param name 自定义事件名称
 * @param listener 自定义事件回调(一次性返回大量 Event)
 * @param fireInterval 回调间隔，毫秒，强制 >= 500
 */
public addMagixEventListener(name: string, listener: EventsListener, fireInterval: number): void;

export type EventsListener = (events: Event[]) => void;
```

### 示例代码

* 普通自定义事件监听

```javascript
function onRecevieGift(eventObject) {
    console.log(eventObject.payload); // 事件 payload
}
room.addMagixEventListener("SendGift", onRecevieGift);

//当执行以下代码后
/*
room.dispatchMagixEvent("SendGift", {
    senderName: "ZhangJie",
    receiverName: "Lili",
    giftType: "Lamborghini",
    imageIds: [1273, 2653, 23, 17283],
    timestamp: 1541820428865,
});
*/
//会输出输出以下内容
{
    "senderName": "ZhangJie",
    "receiverName": "Lili",
    "giftType": "Lamborghini",
    "imageIds": [1273, 2653, 23, 17283],
    "timestamp": 1541820428865,
}
```

* 高频自定义事件

```js
function onRecevieGifts(eventObjects) {
    // 传递的不在是 Event，而是 Event 数组
    console.log(eventObjects);
}
room.addMagixEventListener("SendGift", onRecevieGifts);
```

## 注销自定义监听

### TypeScript 方法签名

```typescript
/**
 * 注销自定义监听，包括高频自定义事件
 * @param name 自定义事件名称
 * @param listener 监听事件，如果不传，则移除该自定义事件的所有监听
 */
public removeMagixEventListener(name: string, listener?: EventListener): void;
```

### 示例代码

```javascript
room.removeMagixEventListener("SendGift", onRecevieGift);
```