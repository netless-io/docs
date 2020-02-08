---
id: js-events
title: Custom event
---

The whiteboard allows developers to broadcast to other clients in the current room using the `custom event` interface provided by` sdk`. The receiver needs to register a custom event name in advance. All custom event information will be restored one by one during playback. Developers can register corresponding custom event listeners during playback, and can also receive information at that time.

>1. Custom events, as a behavior, will not cause `side effects` in the whiteboard. 
>2. Listening to custom events, you can only receive custom event messages after listening. Therefore, users who join the room later cannot receive the information before registration; during playback, if they skip the sending time of the custom event information, they cannot receive it.
>3. If you want to retain the impact results, it is recommended to read [Whiteboard Operations -> Custom GlobalState](./operation.md#globalstate) to learn how to add custom states.

## Sending custom events

Developers can use `dispatchMagixEvent` of` room` to send messages to all clients in the room.

### TypeScript signature

```typescript
///room.d.ts
/**
 * Sending custom events
 * @param name custom event name, other clients can register for event listening on this field before receiving callback
 * @param payload send content, which can be any data that can be serialized by JSON.
 */
public dispatchMagixEvent(name: string, payload: any): void;
```

### Note

This API is lightweight processing and does not guarantee stability in the case of high frequency and large amounts of `payload` data scenarios.

### Sample code

```javascript
room.dispatchMagixEvent("SendGift", {
    senderName: "ZhangJie",
    receiverName: "Lili",
    giftType: "Lamborghini",
    imageIds: [1273, 2653, 23, 17283],
    timestamp: 1541820428865,
});
```

## Listen for custom events

### TypeScript signature

* Common custom event listener

```typescript

///Displayer.d.ts
// "Room" & "Player" for public use

// Custom event listener
/**
 * High-frequency custom event monitoring
 * @param name Custom event name
 * @param listener Custom event callback (return a large number of events at one time)
 */
public addMagixEventListener(name: string, listener: EventListener): void;

export type EventListener = (event: Event) => void;

export type Event = {
    // Custom message name
    readonly event: string;
    // Event information
    readonly payload: any;
    // Sender memberId
    readonly authorId: number;
    readonly scope: Scope;
    readonly phase: EventPhase;
};
```

* High-frequency custom event monitoring

```typescript
// Displayer.d.ts
// "Room" & "Player" for public use
/**
 * High-frequency custom event monitoring
 * @param name Custom event name
 * @param listener Custom event callback (return a large number of events at one time)
 * @param fireInterval Callback interval, milliseconds, mandatory >= 500
 */
public addMagixEventListener(name: string, listener: EventsListener, fireInterval: number): void;

export type EventsListener = (events: Event[]) => void;
```

### Sample code

* Common custom event listener

```javascript
function onRecevieGift(eventObject) {
    console.log(eventObject.payload); // event payload
}
room.addMagixEventListener("SendGift", onRecevieGift);

// When executing the following code
/*
room.dispatchMagixEvent("SendGift", {
    senderName: "ZhangJie",
    receiverName: "Lili",
    giftType: "Lamborghini",
    imageIds: [1273, 2653, 23, 17283],
    timestamp: 1541820428865,
});
*/
// Will output the following
{
    "senderName": "ZhangJie",
    "receiverName": "Lili",
    "giftType": "Lamborghini",
    "imageIds": [1273, 2653, 23, 17283],
    "timestamp": 1541820428865,
}
```

* High-frequency custom events

```js
function onRecevieGifts(eventObjects) {
    // It is not the Event that is passed, but the Event array
    console.log(eventObjects);
}
room.addMagixEventListener("SendGift", onRecevieGifts);
```

## Log out of custom listeners

### TypeScript signature

```typescript
///Displayer.d.ts
// "Room" & "Player" for public use
/**
 * Log out of custom listeners, including high-frequency custom events
 * @param name custom event name
 * @param listener listen for events, if not passed, remove all listeners for this custom event
 */
public removeMagixEventListener(name: string, listener?: EventListener): void;
```

### Sample code

```javascript
room.removeMagixEventListener("SendGift", onRecevieGift);
```