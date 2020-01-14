---
id: js-room
title: Real-time room
---

## initialization
// TODO
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

## Note

### Exception handling

Developers need to handle the following situations manually:

1. Whiteboard failed to join:
    * Mostly for whiteboard authentication or network connection issues. At this time, you can pop up the window to inform the user. If it is a 401 error, please check whether the room roomToken is correct.
2. Whiteboard disconnected halfway
    * The whiteboard comes with a part of disconnection logic. When the network is interrupted, the whiteboard will try to reconnect. If the internal whiteboard fails to reconnect, it will fail.

### Whiteboard size changes

When the size of the `div` bound by the whiteboard changes, you need to actively call the` refreshViewSize` method of `room`.

Including but not limited to:
1. Because the browser window `window` changes, the` div` size changes.
2. Due to business needs, actively adjust the page layout, causing the size of the `div` to change.
After the above situation, the developer needs to manually execute the `room.refreshViewSize ()` method.

```js
function refreshViewSize() {
    // Action when the room variable is exposed to a global variable.
    room && room.refreshViewSize();
};
window.addEventListener("resize", refreshViewSize);
// When the div is removed from the HTML DOM, call removeEventListener to remove the listener.
```

## Online code

[codepen source code](https://codepen.io/leavesster/pen/PooaawL)  
[codepen web page](https://cdpn.io/leavesster/debug/PooaawL/XBrGRqZGNeKM)

## 推荐

* [Initialization parameters -> room parameters](../parameters/room.md)：Relevant configuration can be performed when the room is initialized.
* [Status monitoring](../features/state.md): Listen for changes in room status (members join and exit, room pages, etc.).
* [Tool operation](../features/tools.md): Use `brush`,` rectangle`, `round` to insert` picture`.
* [Perspective operation](../features/view.md): Control user visible range, zoom, and move behavior.
* [Whiteboard operation](../features/operation.md): Control user permissions.
* [Custom event](../features/events.md): Enhance the whiteboard function to realize the business requirements of global notification.
* [Page operations](../features/scenes.md): Realize multi-page whiteboards and switch needs.