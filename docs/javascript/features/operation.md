---
id: js-operation
title: Whiteboard operation
---

## Readonly<span class="anchor" id="disableOperations">

> Starting from 2.2.0, the API can be replaced by the following two APIs:  
1. Perspective locking API: `disableCameraTransform` (for details, please refer to [Perspective Operations -> Locking Perspective](./view.md#disableCameraTransform));
2. Disable tool API: `disableDeviceInputs` (for details, please refer to [tool operation -> disable tool](./tools.md#disableDeviceInputs))

```JavaScript
/// room.d.ts
// Disable responding to user gestures
room.disableOperations = true;
// Respond to user gestures
room.disableOperations = false;
```

## Customize GlobalState

`globalState` is currently an` Object`. Developers can insert their own fields in `globalState` to share the state information required by their business throughout the room.

```js
// Just pass in the fields that need to be updated and return the complete new GlobalState
const newGlobalState = room.setGlobalState({key: "newValue"});
```

* Note

> `globalState` is only for lightweight use, the storage content is as small as possible (recommended within 100KB), when updating, only the fields that need to be updated in` GlobalState` are passed in.

## Zoom

> Starting with 2.2.0, this API is no longer recommended. New API provides animation options, please refer to [Viewpoint Operation -> Adjust Viewpoint](./view.md#moveCamera)

The user can zoom out the whiteboard with gestures.
On the other hand, SDK also supports zooming with `zoomChange`.

```javascript
///displayer.d.ts
// "room" & "player" for public use

// Proportion to original whiteboard size
room.zoomChange(3);
// Get the current zoom ratio
let scale = room.state.zoomScale;
```

## Active delay

```JavaScript
//room.d.ts
// Delay 1 second
room.timeDelay = 1000;
// Get active delay time of whiteboard
let delay = room.timeDelay;
```

Use the `room.timeDelay` method to quickly set the whiteboard delay. You can artificially add a delay to the whiteboard to delay playback.

* Note

> 1. The parameter unit is millisecond.
> 2. This method works only for local clients.
> 3. This method also affects custom events.
> 4. The user draws locally and still appears in real time.

## Clear screen

```js
///room.d.ts
/**
 * Clear the current screen content
 * @param retainPPT Whether to keep ppt
 */
let retainPpt = true;
room.cleanCurrentScene(retainPpt);
```

## Active disconnection

```js
///room.d.ts
await room.disconnect();
//... Successfully disconnected
```