---
id: js-view
title: Perspective operation
---

## Whiteboard internal coordinate system

`sdk` whiteboard is infinite content, with the center of the initial point as the center, extending infinitely in four directions, and allowing users to move and zoom the whiteboard by means of mouse wheel, gestures and other methods. In order to define the position of the content that the user is watching, `sdk` introduces the concept of` whiteboard internal coordinate system`.

> `Whiteboard internal coordinate system`:  **When the whiteboard is initialized, the midpoint of the whiteboard` div` is the origin of the coordinates, the positive direction of the X axis is right, and the positive direction of the Y axis is downward.**

### Coordinate Transformation API

Because the `whiteboard internal coordinate system` is different from the traditional method of using the upper left corner as the coordinate origin (the XY axis is the same), and after the user zooms, it is difficult to know the current position after moving. `sdk` provides the following API, which accepts a coordinate with the upper left corner of the whiteboard` div` as the origin of the coordinates, and returns the position of the point in the whiteboard `internal coordinate system` (the coordinates are affected by movement and scaling).

```typescript
// Displayer.d.ts
// room player use for public

public convertToPointInWorld(point: {x: number, y: number}): {x: number, y: number};
```

## Anchor mode

Since all users can view content in different positions of the whiteboard by means of mobile zoom, etc., in order to meet the needs of `all users` watching the same location,` sdk` has added the function of `anchor mode`.

After using `room.setViewMode (" broadcaster ")` to set a user in the room as the anchor, other users will automatically enter the viewer mode. `sdk` will use` zoom` to `move the whiteboard of users in the“ audience mode ”(hereinafter referred to as` audience`) to ensure that the audience can see the complete content presented by the `anchor` user (hereinafter referred to as the anchor).

### When the content of the audience is superfluous
> Depending on the proportion of the viewer's screen and the anchor, the viewer may see more content than the anchor.

![perspective](/screenshot/perspective.jpeg)

In the anchor mode, all the content that the anchor sees will be synchronized to the audience. However, the screen ratio of the viewer may be inconsistent with that of the anchor. In order to fully display the content of the anchor, a zoom adjustment is performed.
Similar to movie playback, in order to maintain the original picture proportion and retain the original content, on some monitors, scaling is performed and black borders appear.

## Perspective mode-anchor, audience, free (default)

As mentioned earlier, you can set the user as a host through `room.setViewMode (" broadcaster ")`. The main introduction is the `anchor`. In fact, there are three viewing modes for` sdk`, which are `anchor, audience, free (default)`.

The following are the parameters supported by `setViewMode`:

```Typescript
export declare enum ViewMode {
    // Free mode
    // Users can freely zoom and move the perspective.
    // Even if there are anchors in the room, the anchor cannot influence the user's perspective.
    Freedom = "freedom",
    // Follow / Audience Mode
    // The user will follow the anchor's perspective. Where the anchor is watching, the user follows.
    // In this mode, if the user zooms or moves the camera, it will automatically switch back to freedom mode.
    Follower = "follower",
    // Anchor mode
    // The perspective mode of other people in the room is automatically modified to follower, and the user's perspective is forced to be viewed.
    // If there is another anchor in the room, the anchor's perspective mode will also be forced to change to follower.
    Broadcaster = "broadcaster",
};
```

> Audience / following mode, any operation will actively change to `free mode`, no longer follow the anchor. If you want to ensure that this behavior is prohibited, please disable all user operations through the [Whiteboard Operation-Disable Operation] (./operation.md#disableOperations) API.

### Sample code

```JavaScript
// Set anchor, other users will automatically switch to follow mode (including new users)
room.setViewMode("broadcaster");
// Free, users in follow mode will automatically switch to this mode once there is any operation
room.setViewMode("freedom");
// Follow mode
room.setViewMode("follower");
```

```JavaScript
// Disable user operation, then switch to follower
room.disableOpertation = true;
room.setViewMode("follower");
```

### Get the current view state

```Typescript
// This type is one of the room status attributes. For details, see the [Status Management] document.
export type BroadcastState = {
    // Current user perspective mode
    // 1. "freedom" perspective, the perspective will not follow anyone
    // 2. "follower" follows the perspective and will follow the speaker in the room
    // 3. "broadcaster" speaker perspective, the perspective of others in the room will follow me
    mode: ViewMode;
    // Room speaker ID.
    // Undefined if there are no speakers in the current room
    broadcasterId?: number;
    broadcasterInformation?: {
      // MemberId of the anchor user
      id: number,
      // When the anchor user joins the room, the attached payload
      payload?: any
    }
};
```

```javascript
console.log(room.state.broadcastState);
// Output when there is currently no anchor
> {mode: "freedom", broadcasterId: undefined, broadcasterInformation: undefined}
```

## Update whiteboard width and height-update div data<span class="anchor" id="refrehViewSize">

The whiteboard of different users may have different sizes. When using `bindHtmlElement`,` room` and `player` will read the width and height of the corresponding` div`. According to the width and height, the content to be displayed on the whiteboard is laid out and aligned with `coordinates Department of origin`.
```typescript
///Displayer.d.ts
//room player use for public
public bindHtmlElement(element: HTMLDivElement | null): void;
```

When the width and height of the whiteboard `div` are changed, since the width and height data of` room` and `player` no longer match the` div` correctly, many unexpected behaviors will be caused. Need to call:
```typescript
///Displayer.d.ts
public refreshViewSize(): void;
```

> Therefore, the developer needs to call the `room.refreshViewSize ()` method when the `div` size changes to update the width and height data of the whiteboard.  
> This situation generally occurs when:
> 1. The size of the whiteboard `div` changes due to window changes
> 2. Due to business needs, change the size of the whiteboard `div`

## Adjust perspective center-coordinate position, zoom<span class="anchor" id="moveCamera">

> New API is added in 2.2.0, and animation options are added in 2.2.2; this API is supported by replay and real-time room

The SDK provides the `moveCamera` API to adjust the viewing angle. The parameters are optional. The SDK adjusts the center of view and the zoom ratio based on the incoming parameters.

### TypeScript definition

```typescript
/// Displayer.d.ts
// room player use for public
// Are optional parameters, only modify existing fields
public moveCamera(camera: Partial<Camera> & Readonly<{animationMode?: AnimationMode}>): void;

export type Camera = {
    // The x coordinate of the center point of the whiteboard div relative to the internal coordinate system of the whiteboard
    readonly centerX: number;
    // The y coordinate of the center point of the whiteboard div relative to the internal coordinate system of the whiteboard
    readonly centerY: number;
    // zoom ratio, default is 1. > 1 means zoom in (visible range reduced), <1 means zoom out (visible range expanded)
    readonly scale: number;
};

// 2.2.2 new API
export enum AnimationMode {
    // Continuous animation (default)
    Continuous = "continuous",
    // Instantaneous
    Immediately = "immediately",
}
```

### Sample code

```javascript
room.moveCamera({
  centerX: 237,
  centerY: 120,
  scale: 1.2,
  animationMode: "immediately"
})
```

## Spread ppt

```typescript
/** 
 * Scale the ppt content proportionally to ensure that the current ppt is completely displayed in the current whiteboard.
 * This API is one-time and is only valid if ppt exists on the current page.
 */
public scalePptToFit(animationMode: AnimationMode = AnimationMode.Continuous): void;
```

## Adjust the field of view <span class = "anchor" id = "moveCameraToContain">

>New APIs are added in 2.2.0, and animation options are added in 2.2.2; this API is supported in both replay and real-time room.

Inside the whiteboard there is a concept of “visual rectangle” (coordinates of the upper left corner of the width and height), which is used to represent the area that the user's whiteboard must accommodate. (Can be simply understood as `field of view`).

### TypeScript 定义

```typescript
/// Displayer.d.ts
// room player use for public
public moveCameraToContain(rectangle: Rectangle & Readonly<{animationMode?: AnimationMode}>): void;

// Visual rectangle: all data in the whiteboard's internal coordinate system
export type Rectangle = {
    readonly width: number;
    readonly height: number;
    readonly originX: number;
    readonly originY: number;
};

// 2.2.2 new API
export enum AnimationMode {
    // Continuous animation (default)
    Continuous = "continuous",
    // Instantaneous
    Immediately = "immediately",
}
```

### Sample code

#### 1. Spread ppt

```javascript
// Fill the user's whiteboard with the ppt background image in the room
const width = room.state.sceneState.scenes[room.state.sceneState.index].ppt.width;
const height = room.state.sceneState.scenes[room.state.sceneState.index].ppt.height;

room.moveCameraToContain({
  originX: - width / 2,
  originY: - height / 2,
  width: width,
  height: height,
  // Animation is optional
  animationMode: "immediately" // 2.2.2 Added API, continuous: continuous animation (default), immediate: complete instantly
});
```

> If the width-to-height ratio of the ppt is inconsistent with the whiteboard `div`,` sdk` will adjust the user ’s final `visual rectangle` to ensure that the incoming range can be completely displayed. This behavior logic is similar to the processing logic when the anchors and the viewer's whiteboard divs are inconsistent.

#### 2. Return to the origin and resize the visual rectangle

```javascript
let width = 960;
let heigh = 480;
room.moveCameraToContain({
  originX: - width / 2,
  originY: - height / 2,
  width: width,
  height: height,
})
```

## Lock perspective<span class="anchor" id="disableCameraTransform">

> 2.2.0 New API

This method will prohibit users from actively modifying the viewing angle through mouse wheel zooming, gestures, grabbing tools and other actions. However, teaching aids can still be used.
Developers can still modify the user's location via the `moveCamera`,` moveCameraToContain` API.

```typescript
/// Displayer.d.ts
// room player use for public
disableCameraTransform: boolean;
```

```javascript
// Lock perspective
room.disableCameraTransform = true;
// Unlock perspective
room.disableCameraTransform = false;
```

## Limited field of view

> 2.3.0 New API

The field of view limitation consists of three parts:

1. Coordinate center
2. Width Height
3. Maximum minimum

`sdk` first ensures that the user's field of view is limited to the range formed by the width and height of the coordinate center, and then the maximum and minimum limits are used to limit the user's zoom ratio.

### TypeScript definition

```typescript
/// Displayer.d.ts
// room player use for public
public setCameraBound(cameraBound: CameraBound): void;

// Limit range
export type CameraBound = {
    // When the user moves out of the boundary, they feel the resistance (0.0 ~ 1.0).
    // 0 is no resistance, 1.0 cannot move out of the boundary. (After letting go, be sure to return to the limit)
    // Default 0.75
    readonly damping?: number;

// Limited field of view
    // Generate the midpoint coordinates (internal coordinates) for the calculation of the limit range, and use the width and height to form the limit range
    // 0 if not passed
    readonly centerX?: number;
    readonly centerY?: number;
    // Limit the width and height of the range calculation。
    // If Infinity is selected (default), it means that the direction is not restricted.
    readonly width?: number;
    readonly height?: number;
    // Zoom limited to this range.
    readonly maxContentMode?: ContentMode;
    // A strategy to calculate the minimum field of view based on the above coordinates, width and height
    readonly minContentMode?: ContentMode;
};

// ContentMode can take the following values:

// The state when the viewing angle is enlarged to 1.2 times.
export contentModeScale(1.2);

// Fill mode: Enlarges the border to the long side of the perspective to the short side of its border.
// The perspective at this time ensures that everything seen in the picture is within the boundary.
// And the things within the boundaries are not necessarily in the picture.
export contentModeAspectFill()

// Fit mode: Enlarges the border to the short side of the perspective to the long side of its border.
// The perspective at this time ensures that things within the boundary must be in the picture.
// But what is seen in the picture is not necessarily within the boundary.
export contentModeAspectFit()

// In Fill mode, continue to enlarge the picture by 1.2 times.
export contentModeAspectFillScale(1.2)

// In Fit mode, continue zooming in 1.2x.
export contentModeAspectFitScale(1.2)

// In Fit mode, fill the 200-pixel gap on the side.
export contentModeAspectFitSpace(200)
```

### Sample code

```javascript
room.setCameraBound({
    centerX: 120,
    centerY: 320,
    width: 200,
    height: 300,
});
```

The above code will limit the viewing angle to a rectangle with (x: 120, y: 320) coordinates as the midpoint, a width of 200 and a height of 300.

If you want to remove the limitation of the perspective range, you can execute the following code.

```javascript
room.setCameraBound({
    centerX: 0,
    centerY: 0,
    width: Infinity,
    height: Infinity,
});
```

You can also set an initial viewing range limit before joining the room.

```javascript
whiteWebSdk.joinRoom({
    uuid: roomUUID,
    roomToken: roomToken,
    cameraBound: {
      centerX: 120,
      centerY: 320,
      width: 200,
      height: 300,
    },
});
```

Not only `room` can set the viewing range limit, but also `player`.

```javascript
player.setCameraBound({
    centerX: 120,
    centerY: 320,
    width: 200,
    height: 300,
});
```

> Setting or initializing the viewing angle range for a room only takes effect on itself and does not affect other users of the room.

## Related documents

[Anchor one-to-many service implementation](blog/broadcast.md)