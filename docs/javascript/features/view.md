---
id: js-view
title: 视角操作
---

sdk 提供的白板是向四方无限延伸的，同时也允许用户通过鼠标滚轮、手势等方式移动白板。因此，即便是同一块白板的同一页，不同用户的屏幕上可能看到的内容是不一样的。为了满足，所有用户观看同一内容的需求，本文引入了「`主播模式`」这个概念。

## 主播视角

sdk 支持将房间内的某一个人设为主播（其他用户会自动变成 `观众模式`），该用户屏幕上看到的内容即是其他所有观众看到的内容。
当主播进行视角的放缩、移动时，其他人的屏幕也会自动进行放缩、移动等操作，来保证，可以观看到主播端所有的可见内容。

* 观众端显示的内容，多于主播端的情况

主播模式中，主播所看到的内容，会全部同步到观众端。但是由于观众端屏幕比例可能与主播端不一致。为了完全显示主播端的内容，会进行缩放调整，类似于电影播放时，为了保持原始画面比例并保留原始内容，在某些显示器上，会进行比例缩放，会出现黑边。

## 视角模式 —— 主播，观众，自由（默认）

```Typescript
export declare enum ViewMode {
    // 自由模式
    // 用户可以自由放缩、移动视角。
    // 即便房间里有主播，主播也无法影响用户的视角。
    Freedom = "freedom",
    // 追随模式
    // 用户将追随主播的视角。主播在看哪里，用户就会跟着看哪里。
    // 在这种模式中，如果用户进行缩放、移动视角操作，将自动切回 freedom模式。
    Follower = "follower",
    // 主播模式
    // 房间内其他人的视角模式会被自动修改成 follower，并且强制观看该用户的视角。
    // 如果房间内存在另一个主播，该主播的视角模式也会被强制改成 follower。
    Broadcaster = "broadcaster",
};
```

### 设置视角模式

* 例子：设置当前用户为主播视角

```JavaScript
room.setViewMode("broadcaster");
room.setViewMode("freedom");
room.setViewMode("follower");
```

### 获取当前视角状态

```Typescript
// 该类型为房间状态属性之一，详情见[状态管理]文档
export type BroadcastState = {
    // 当前视角模式，有如下：
    // 1."freedom" 自由视角，视角不会跟随任何人
    // 2."follower" 跟随视角，将跟随房间内的演讲者
    // 2."broadcaster" 演讲者视角，房间内其他人的视角会跟随我
    mode: ViewMode;
    // 房间演讲者 ID。
    // 如果当前房间没有演讲者，则为 undefined
    broadcasterId?: number;
};
```

```javascript
room.state.broadcastState
```

## 视角中心同步<span class="anchor" id="refrehViewSize">

同一个房间的不同用户各自的屏幕尺寸可能不一致，这将导致他们的白板都有各自不同的尺寸。实际上，房间的其他用户会将白板的中心对准主播的白板中心（注意主播和其他用户的屏幕尺寸不一定相同）。

我们需要通过如下方法设置白板的尺寸，以便主播能同步它的视角中心。

```JavaScript
room.refreshViewSize();
```

尺寸应该和白板在产品中的实际尺寸相同（一般而言就是浏览器页面或者应用屏幕的尺寸）。如果用户调整了窗口大小导致白板尺寸改变。应该重新调用该方法刷新尺寸。

## 调整视角<span class="anchor" id="moveCamera">

>2.2.0新增 API，2.2.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API

SDK 提供 `moveCamera` API，来调整视角，参数均为可选参数。SDK 会根据传入参数，调整视角中心与缩放比例。

```javascript
room.moveCamera({
  // 均为可选参数
  // 视角中心，x，y 坐标原点为初始页面的额重点，xy 正方向分别为右侧，下侧。
  centerX: 237, // 视角中心坐标的 x 坐标
  centerY: 120, // 视角中心坐标的 y 坐标
  scale: 1.2, // 放缩比例
  animationMode: "immediately" // 2.2.2 新增 API，continuous:连续动画（默认），immediately: 瞬间完成
})
```

## 调整视觉矩形<span class="anchor" id="moveCameraToContain">

>2.2.0新增 API，2.2.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API

除了调整视角中心，SDK 还提供调整视觉矩形API。

> 视觉矩形表示你的视角必须容纳的区域。当你设置好视觉矩形后，视角会自动调整到刚好可以完整展示视觉矩形所表示的范围。

```javascript

room.moveCameraToContain({
  originX: - 200, // 视觉矩形左上角在白板内部坐标位置
  originY: - 120, // 视觉矩形左上角在白板内部坐标位置
  width: 400, // 视觉矩形在白板内部坐标的宽度，会影响缩放比例，可以传入 ppt 的宽
  height: 240, // 视觉矩形在白板内部坐标的高度，会影响缩放比例，可以传入 ppt 的高
  // 动画为可选参数
  animationMode: "immediately" // 2.2.2 新增 API，continuous:连续动画（默认），immediately: 瞬间完成
});
```

### 回到原点，并调整视觉矩形大小

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

## 禁止视角变化<span class="anchor" id="disableCameraTransform">

>2.2.0 新增 API

开发者可以通过如下方法禁止用户手动调整视角（使用鼠标滚轮缩放、Touch 板手势移动，缩放、移动端双指操作移动）。

```javascript
// 禁止用户主动改变视野
room.disableCameraTransform = true;
// 恢复用户视野变化权限
room.disableCameraTransform = false;
```

>你仍然通过程序调整视角；用户仍然可以进行笔画等输出操作。

## 视角限制

> 2.2.0 新增 API

开发者可以通过如下方式限制视角的范围。

```javascript
room.setCameraBound({
    centerX: 120, // 限制范围（矩形）的中间点的 x 坐标
    centerY: 320, // 限制范围（矩形）的中间点的 y 坐标
    width: 200, // 限制范围（矩形）的宽
    height: 300, // 限制范围（矩形）的高
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

**注意**：为房间设置或初始化视角范围仅仅对自己生效，不会影响房间的其他用户。

以下是视角范围限制相关的全部参数：

```typescript
export type CameraBound = {

    // 越出边界时手势的阻力（范围 0.0 ~ 1.0）
    // 使用多指触碰改变视角时，如果越出边界。该值越大，感受到的阻力越大。
    // 当取 0.0 时，完全感受不到阻力。
    // 当取 1.0 时，完全无法用手势将视角移出边界一分一毫。
    // 取中间值，则感受介乎两者之间。
    readonly damping?: number;

    // 限制范围（矩形）的中间点的 x 坐标
    readonly centerX?: number;

    // 限制范围（矩形）的中间点的 y 坐标
    readonly centerY?: number;

    // 限制范围（矩形）的宽。
    // 如果取 Infinity，则表示不加限制。
    readonly width?: number;

    // 限制范围（矩形）的高。
    // 如果取 Infinity，则表示不加限制。
    readonly height?: number;

    // 对视角推拉的限制。视角放大的极限。
    readonly maxContentMode?: ContentMode;

    // 对视角推拉的限制。视角缩小的极限。
    readonly minContentMode?: ContentMode;
};
```

其中，``ContentMode`` 可以取如下值。

```typescript

// 将视角放大到 1.2 倍时的状态。
contentModeScale(1.2);

// Fill 模式：将边界放大到直到视角的长边对其边界的短边。
//           此时的视角保证了画面内所见之物都在边界之内。
//           而边界之内的事物不一定在画面之中。
contentModeAspectFill()

// Fit 模式：将边界放大到直到视角的短边对其边界的长边。
//          此时的视角保证了边界之内的事物一定在画面之中。
//          但画面中所见之物不一定在边界之内。
contentModeAspectFit()

// 在 Fill 模式下，继续将画面放大 1.2 倍。
contentModeAspectFillScale(1.2)

// 在 Fit 模式下，继续将画面放大 1.2 倍。
contentModeAspectFitScale(1.2)

// 在 Fit 模式下，在侧边填充 200 像素的空隙。
contentModeAspectFitSpace(200)
```

## 相关文档

[主播一对多业务实现](/docs/blog/blog-broadcast)
