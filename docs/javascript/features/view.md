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
// room player 通用
public moveCameraToContain(rectangle: Rectangle & Readonly<{animationMode?: AnimationMode}>): void;

// 视觉矩形：均为白板内部坐标系数据
export type Rectangle = {
    readonly width: number;
    readonly height: number;
    readonly originX: number;
    readonly originY: number;
};

// 2.2.2 新增 API
export enum AnimationMode {
    // 连续动画（默认）
    Continuous = "continuous",
    // 瞬间完成
    Immediately = "immediately",
}
```

### 示例代码

#### 1. ppt铺满

```javascript
// 在 room 中将 ppt 背景图铺满用户白板
const width = room.state.sceneState.scenes[room.state.sceneState.index].ppt.width;
const height = room.state.sceneState.scenes[room.state.sceneState.index].ppt.height;

room.moveCameraToContain({
  originX: - width / 2,
  originY: - height / 2,
  width: width,
  height: height,
  // 动画为可选参数
  animationMode: "immediately" // 2.2.2 新增 API，continuous:连续动画（默认），immediately: 瞬间完成
});
```

>如果 ppt 的宽高比例与白板`div`不一致，`sdk`会调整用户最终的`视觉矩形`，保证传入的范围，能够完整的被显示出来。该行为逻辑，与`主播`和`观众`的白板 div不一致时的处理逻辑类似。

#### 2. 回到原点，并调整视觉矩形大小

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

## 锁定视角<span class="anchor" id="disableCameraTransform">

>2.2.0 新增 API

该方法将禁止用户通过鼠标滚轮缩放、手势，抓手工具等行为，来主动修改视角。但是仍然可以使用教具。
开发者仍然可以通过`moveCamera`,`moveCameraToContain`API 修改用户的位置。

```typescript
/// Displayer.d.ts
// room player 通用
disableCameraTransform: boolean;
```

```javascript
// 锁定视角
room.disableCameraTransform = true;
// 解锁视角
room.disableCameraTransform = false;
```

## 限制视野范围

> 2.3.0 新增 API

视野范围限制由三部分组成：

1. 坐标中心
1. 宽高
1. 最大最小限制

`sdk`首先保证把用户视野限定在以坐标中心+宽高形成的范围内，然后再通过最大最小限制来限制用户可以进行缩放的比例。

### TypeScript 定义

```typescript
/// Displayer.d.ts
// room player 通用
public setCameraBound(cameraBound: CameraBound): void;

// 限制范围
export type CameraBound = {
    // 当用户移出边界时，感受到的阻力（0.0 ~ 1.0）。
    // 0 为无阻力，1.0 则无法移动出边界。(松手后，一定回到限制范围内)
    // 默认 0.75。
    readonly damping?: number;

//限制视野范围
    // 生成 限制范围计算用的 中点坐标（内部坐标），配合 width，height 组成限制范围
    // 不传则为 0，0
    readonly centerX?: number;
    readonly centerY?: number;
    // 限制范围计算用的宽高，
    // 如果取 Infinity（默认），则表示该方向不做限制。
    readonly width?: number;
    readonly height?: number;
//限制在该范围内的缩放
    readonly maxContentMode?: ContentMode;
    // 根据上面坐标，宽高，计算最小视野范围的策略
    readonly minContentMode?: ContentMode;
};

// ContentMode 可以取以下值：

// 将视角放大到 1.2 倍时的状态。
export contentModeScale(1.2);

// Fill 模式：将边界放大到直到视角的长边对其边界的短边。
//           此时的视角保证了画面内所见之物都在边界之内。
//           而边界之内的事物不一定在画面之中。
export contentModeAspectFill()

// Fit 模式：将边界放大到直到视角的短边对其边界的长边。
//          此时的视角保证了边界之内的事物一定在画面之中。
//          但画面中所见之物不一定在边界之内。
export contentModeAspectFit()

// 在 Fill 模式下，继续将画面放大 1.2 倍。
export contentModeAspectFillScale(1.2)

// 在 Fit 模式下，继续将画面放大 1.2 倍。
export contentModeAspectFitScale(1.2)

// 在 Fit 模式下，在侧边填充 200 像素的空隙。
export contentModeAspectFitSpace(200)
```

### 代码示例

```javascript
room.setCameraBound({
    centerX: 120,
    centerY: 320,
    width: 200,
    height: 300,
});
```

以上代码会将视角限制在一个以 (x: 120, y: 320) 坐标为中点的，宽为 200，高为 300 的矩形范围之内。

如果你希望取消视角范围限制，可以执行如下代码。

```javascript
room.setCameraBound({
    centerX: 0,
    centerY: 0,
    width: Infinity,
    height: Infinity,
});
```

你也可以在加入房间之前，提前设置初始视角范围限制。

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

不但 ``room`` 可以设置视角范围限制，``player`` 也可以。

```javascript
player.setCameraBound({
    centerX: 120,
    centerY: 320,
    width: 200,
    height: 300,
});
```

>为房间设置或初始化视角范围仅仅对自己生效，不会影响房间的其他用户。

## 相关文档

[主播一对多业务实现](blog/broadcast.md)