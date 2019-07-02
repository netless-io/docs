---
id: js-view
title: 视角同步
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

## 视角中心同步

同一个房间的不同用户各自的屏幕尺寸可能不一致，这将导致他们的白板都有各自不同的尺寸。实际上，房间的其他用户会将白板的中心对准主播的白板中心（注意主播和其他用户的屏幕尺寸不一定相同）。

我们需要通过如下方法设置白板的尺寸，以便主播能同步它的视角中心。

```JavaScript
room.refrehViewSize();
```

尺寸应该和白板在产品中的实际尺寸相同（一般而言就是浏览器页面或者应用屏幕的尺寸）。如果用户调整了窗口大小导致白板尺寸改变。应该重新调用该方法刷新尺寸。

## 主动调整视角

### 移动视角位置，改变缩放比例

```javascript
room.moveCamera({
  centerX: 237, // 视角中心坐标的 x 坐标
  centerY: 120, // 视角中心对准的 y 坐标
  scale: 1.2, // 放缩比例
});
```

通过 `moveCamera` 来调整视角时，你不必输入完整的参数。例如，你可以通过如下方式来仅仅调整放缩比例，而保持视角中心不变。

```javascript
room.moveCamera({
  scale: 1.2,
});
```

### 调整整体视角位置

你也可以通过设置视觉矩形的方式，调整视角。

> 视觉矩形表示你的视角必须容纳的区域。当你设置好视觉矩形后，视角会自动调整到刚好可以完整展示视觉矩形所表示的范围。

```javascript
room.moveCameraToContain({
  originX: - 200,
  originY: - 120,
  width: 400,
  height: 240,
});
```

>白板以中心点作为坐标原点，如果想要回到初始位置，并调整视角大小，可以参考以下代码:

```javascript
let width = 960;
let heigh = 480;
room.moveCamerToContain({
  originX: - width / 2,
  originY: - height / 2,
  width: width,
  height: height,
})
```

## 禁止调整视角

你可以通过如下方法禁止用户手动调整视角（使用鼠标滚轮、Touch 板手势、移动端双指操作等）。

```javascript
room.disableCameraTransform = false;
```

你仍然通过程序调整视角，用户仍然可以进行笔画等输出操作。

## 相关文档

[主播一对多业务实现](/docs/advance/advance-broadcast?platform=ios)