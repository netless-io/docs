---
id: js-player
title: replay
---

## Start Replay

> Prerequisites for replay. When creating a room, you should declare the mode to `historied` so that the room will perform cloud recording.

```js
var roomUUID = "..."; // required，The uuid of the replay room.
var roomToken = ".."; // required，roomToken corresponding to playback room
// For more initialization sdk parameters, please see the [initialization parameters] document
var whiteWebSdk = new WhiteWebSdk();
// For more initialization parameters of the playback room, please see the [Initialization Parameters] document.
whiteWebSdk.replayRoom({
    room: roomUUID,
    roomToken: roomToken
}).then(function(player) {
    // Similar to room call, after getting the player instance, you need to bind player to the div in HTML
    player.bindHtmlElement(document.getElementById('whiteboard'));
    // start play
    player.play();
})
```

## Stop The Replay

```js
player.stop();
```

After calling the `stop` API, the data stored in the `player` will be released and cannot be played any more. If the replay is needed, you should use the `sdk` to call `replayRoom` method to regenerate a new `player` instance.

## Note

### Initial exception handling

Initializing the playback room API returns a promise, which may produce errors (wrong room authentication information, audio or video parsing errors), and so on. It needs to be handled in the exception, and at this time, the room initialization fails and needs to be re-initialized.

### Playback status processing

Playback needs to obtain resources from the server. When the playback status changes from `waitingFirstFrame` to` paused`, it can be played. For more information, please see the [Playback Features] document for details

### With video playback limitation

Because Safari has strict privacy restrictions, audio and video files with sound cannot be played using the code.
At present, playback in Safari needs to be buffered by `player` (check the [playback function] document to understand the playback status), and the file can be replayed by clicking.

### Whiteboard size changes

When the size of the `div` bound by the whiteboard changes, you need to actively call the` refreshViewSize` method of `room`.
including but not limited to:

1. The size of the `div` changes due to changes in the browser window `window`.
2. Due to business needs, actively adjust the page layout, causing the size of the `div` to change.

After the above situation, the developer needs to manually execute the `room.refreshViewSize ()` method.

```js
function resize() {
  player && player.refreshViewSize();
}

window.addEventListener("resize", resize);

// When the div is removed from the HTML DOM, call removeEventListener to remove the listener
```

## Online code

* Pure whiteboard playback:

[codepen source code](https://codepen.io/leavesster/pen/pooKVaM)  
[codepen display page](https://cdpn.io/leavesster/debug/pooKVaM/ZorBazKxbJJM)

## Related documents

* [Initialization-playback parameters](../parameters/player.md)：During playback, the parameters must be and can be configured.
* [Status monitoring](../features/state.md)：When monitoring replay, the room status (number of rooms, page status, global status, etc.) changes.
* [Replay](../features/replay.md)，Learn more：
    1. How to support audio and video playback
    2. Playback control: play, pause, fast forward, release resources
* [Custom event](../features/events.md)：When monitoring the replay, the custom events used by developers in the real-time room according to their unique business.
* [Whiteboard operation](../features/operation.md)：User interaction logic (move, zoom whiteboard) when managing playback.
