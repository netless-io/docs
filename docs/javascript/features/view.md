---
id: js-view
title: 视角操作
---

## 白板内部坐标系

`sdk`白板为无限内容，以初始点中心为中心，向四个方向无限延伸，并允许用户通过鼠标滚轮、手势等方式移动，缩放白板。为了定义用户正在观看的内容位置，`sdk`引入了「`白板内部坐标系`」这个概念。

>`白板内部坐标系`: **以白板初始化时，白板`div`中点为坐标原点，X 轴正方向向右，Y 轴正方向向下。**

### 坐标转换API

由于`白板内部坐标系`与传统左上角为坐标原点的做法不同（XY 轴一致），且经过用户缩放，移动后，难以得知当前位置。`sdk`提供以下 API ，该 API 接受一个以白板`div`左上角为坐标原点的坐标，返回该点在白板`内部坐标系`中的位置（该坐标受移动，缩放影响）。

```typescript
///Displayer.d.ts
//room player 通用

public convertToPointInWorld(point: {x: number, y: number}): {x: number, y: number};
```

## 主播模式

由于所有用户都可以通过移动缩放等方式，观看白板不同位置的内容，所以为了满足`所有用户`观看同一个位置的需求，`sdk`添加了`主播模式`这个功能。

使用`room.setViewMode("broadcaster")`将房间内的某个用户设为`主播`后，其他用户会自动进入`观众模式`。`sdk`会通过`缩放`，`移动``观众模式`的用户（以下简称`观众`）的白板，来保证观众能看到`主播`用户（以下简称主播）呈现的完整内容。

### 观众内容多余主播的情况

> 根据观众屏幕比例与主播的不同，会造成观众看到的内容可能比主播更多。

![perspective](/screenshot/perspective.jpeg)

主播模式中，主播所看到的内容，会全部同步到观众端。但是由于观众端屏幕比例可能与主播端不一致。为了完全显示主播端的内容，会进行缩放调整。
类似于电影播放时，为了保持原始画面比例并保留原始内容，在某些显示器上，会进行比例缩放，会出现黑边。

## 视角模式 —— 主播，观众，自由（默认）

前面提到可以通过`room.setViewMode("broadcaster")`将用户设置为主播。前面主要介绍了`主播`，其实`sdk`一共有三种视角模式，分别为`主播，观众，自由（默认）`

以下为`setViewMode`支持的参数：

```Typescript
export declare enum ViewMode {
    // 自由模式
    // 用户可以自由放缩、移动视角。
    // 即便房间里有主播，主播也无法影响用户的视角。
    Freedom = "freedom",
    // 追随/观众模式
    // 用户将追随主播的视角。主播在看哪里，用户就会跟着看哪里。
    // 在这种模式中，如果用户进行缩放、移动视角操作，将自动切回 freedom模式。
    Follower = "follower",
    // 主播模式
    // 房间内其他人的视角模式会被自动修改成 follower，并且强制观看该用户的视角。
    // 如果房间内存在另一个主播，该主播的视角模式也会被强制改成 follower。
    Broadcaster = "broadcaster",
};
```

>观众/跟随模式，进行任何操作，都会主动变更为`自由模式`，不再跟随主播。如果要保证禁止该行为，请通过[白板操作-禁止操作](./operation.md#disableOperations)API禁止用户所有操作。

### 示例代码

```JavaScript
//设置主播，其他用户自动切换为跟随模式（包括新用户）
room.setViewMode("broadcaster");
//自由，在跟随模式下的用户，一旦有任何操作，就会自动切换为该模式
room.setViewMode("freedom");
//跟随模式
room.setViewMode("follower");
```

```JavaScript
//禁止用户操作，再切换为跟随者
room.disableOpertation = true;
room.setViewMode("follower");
```

### 获取当前视角状态

```Typescript
// 该类型为房间状态属性之一，详情见[状态管理]文档
export type BroadcastState = {
    // 当前用户视角模式
    // 1."freedom" 自由视角，视角不会跟随任何人
    // 2."follower" 跟随视角，将跟随房间内的演讲者
    // 2."broadcaster" 演讲者视角，房间内其他人的视角会跟随我
    mode: ViewMode;
    // 房间演讲者 ID。
    // 如果当前房间没有演讲者，则为 undefined
    broadcasterId?: number;
    broadcasterInformation?: {
      // 主播用户的 memberId
      id: number,
      // 主播用户加入房间时，附带的 payload
      payload?: any
    }
};
```

```javascript
console.log(room.state.broadcastState);
// 当前无主播时输出
> {mode: "freedom", broadcasterId: undefined, broadcasterInformation: undefined}
```

## 更新白板宽高 —— 更新 div 数据

不同用户的白板可能尺寸不同,在使用`bindHtmlElement`时，`room`与`player`会读取对应`div`的宽高，根据宽高，布局白板所需要展示的内容，并对准`坐标系原点`。

```typescript
///Displayer.d.ts
//room player 通用
public bindHtmlElement(element: HTMLDivElement | null): void;
```

当白板`div`的宽高发生改变时，由于`room`与`player`没有的宽高数据不再正确匹配`div`，会造成很多意想不到的行为。此时需要调用：

```typescript
///Displayer.d.ts
public refreshViewSize(): void;
```

>因此，开发者需要在`div`大小发生变化时，调用`room.refreshViewSize()`方法，更新白板宽高数据。  
>该情况一般发生在：
>
>1. 由于 window 发生改变，导致的白板`div`大小变化
>2. 由于业务需求，改变白板`div`大小

## 调整视角中心 —— 坐标位置，缩放

>2.2.0新增 API，2.2.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API

SDK 提供 `moveCamera` API，来调整视角，参数均为可选参数。SDK 会根据传入参数，调整视角中心与缩放比例。

### TypeScript 定义

```typescript
/// Displayer.d.ts
// room player 通用
// 均为可选参数，只修改存在的字段
public moveCamera(camera: Partial<Camera> & Readonly<{animationMode?: AnimationMode}>): void;

export type Camera = {
    // 白板 div 中心点相对于白板内部坐标系的x坐标
    readonly centerX: number;
    // 白板 div 中心点相对于白板内部坐标系的y坐标
    readonly centerY: number;
    // 缩放比例，默认为 1。>1 表示放大（可见范围缩小），<1 表示缩小（可见范围扩大）
    readonly scale: number;
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

```javascript
room.moveCamera({
  centerX: 237,
  centerY: 120,
  scale: 1.2,
  animationMode: "immediately"
})
```

## 铺满 ppt

```typescript
/** 
 * 等比例缩放ppt 内容，保证当前 ppt 完整的展现在当前白板中。
 * 该API 为一次性，只有当前页面存在 ppt 时，才有效。
 */
public scalePptToFit(animationMode: AnimationMode = AnimationMode.Continuous): void;
```

## 调整视野范围<span class="anchor" id="moveCameraToContain">

>2.2.0新增 API，2.2.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API。

白板内部有一个`视觉矩形`(宽高+左上角坐标)的概念，用以表示用户白板必须容纳的区域。（可以简单理解为`视野`）。

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

[主播一对多业务实现](docs/doc/viewmode/)