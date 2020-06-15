---
id: ios-view
title: 视角操作
---

本文中的 API，都可以在 `WhiteRoom` 类中查看。本文示例代码中的 `room` 即为 `whiteRoom` 的实例。

White SDK 提供的白板是向四方无限延伸的。同时也允许用户通过鼠标滚轮、手势等方式移动白板。因此，即便是同一块白板的同一页，不同用户的屏幕上可能看到的内容是不一样的。为了满足，所有用户观看同一内容的需求，本文引入了「`主播模式`」这个概念。

## 主播视角

sdk 支持将房间内的某一个人设为主播（其他用户会自动变成 `观众模式`），该用户屏幕上看到的内容即是其他所有观众看到的内容。
当主播进行视角的放缩、移动时，其他人的屏幕也会自动进行放缩、移动等操作，来保证，可以观看到主播端所有的可见内容。

* 观众端显示的内容，多于主播端的情况

主播模式中，主播所看到的内容，会全部同步到观众端。但是由于观众端屏幕比例可能与主播端不一致。为了完全显示主播端的内容，会进行缩放调整，类似于电影播放时，为了保持原始画面比例并保留原始内容，在某些显示器上，会进行比例缩放，会出现黑边。

## 视角模式 —— 主播，观众，自由（默认）

```Objective-C
typedef NS_ENUM(NSInteger, WhiteViewMode) {
    // 自由模式
    // 用户可以自由放缩、移动视角。
    // 即便房间里有主播，主播也无法影响用户的视角。
    WhiteViewModeFreedom,
    // 追随模式
    // 用户将追随主播的视角。主播在看哪里，用户就会跟着看哪里。
    // 在这种模式中，如果用户进行缩放、移动视角操作，将自动切回 freedom模式。
    WhiteViewModeFollower,
    // 主播模式
    // 房间内其他人的视角模式会被自动修改成 follower，并且强制观看该用户的视角。
    // 如果房间内存在另一个主播，该主播的视角模式也会被强制改成 follower。
    WhiteViewModeBroadcaster,
};

//以下类，只有在 fireRoomStateChanged: 回调事件中，才会使用。
@interface WhiteBroadcastState : WhiteObject
//视角模式
@property (nonatomic, assign) WhiteViewMode viewMode;
@property (nonatomic, assign) NSInteger broadcasterId;
@property (nonatomic, strong) WhiteMemberInformation *broadcasterInformation;
@end

```

### 设置视角模式

* 例子：设置当前用户为主播视角

```
//只需要传入枚举值即可
[whiteRoom setViewMode:WhiteViewModeBroadcaster];
```

### 获取当前视角状态

```Objective-C
[self.room getBroadcastStateWithResult:^(WhiteBroadcastState *state) {
    NSLog(@"%@", [state jsonString]);
}];
```

## 视角中心同步

同一个房间的不同用户各自的屏幕尺寸可能不一致，这将导致他们的白板都有各自不同的尺寸。实际上，房间的其他用户会将白板的中心对准主播的白板中心（注意主播和其他用户的屏幕尺寸不一定相同）。

我们需要通过如下方法设置白板的尺寸，以便主播能同步它的视角中心。

```Objective-C
[room refreshViewSize];
```

尺寸应该和白板在产品中的实际尺寸相同（一般而言就是浏览器页面或者应用屏幕的尺寸）。如果用户调整了窗口大小导致白板尺寸改变。应该重新调用该方法刷新尺寸。

## 调整视角

>2.2.0新增 API，2.2.2 增加动画选项；回放 replay 与 实时房间 room 都支持该 API

```Objective-C
@interface WhiteDisplayer
// 调整视角中心
- (void)moveCamera:(WhiteCameraConfig *)camera;
// 调整视觉矩形
- (void)moveCameraToContainer:(WhiteRectangleConfig *)rectange;
@end
```

<span id="moveCamera">
### 调整视角中心

`moveCamera` API，可以用来调整视角，参数均为可选参数。SDK 会根据传入参数，调整视角中心与缩放比例。

```Objective-C
@interface WhiteCameraConfig : WhiteObject
@property (nonatomic, strong, nullable) NSNumber *centerX;
@property (nonatomic, strong, nullable) NSNumber *centerY;
/** 缩放比例，原先 zoomScale 已弃用 */
@property (nonatomic, strong, nullable) NSNumber *scale;
/**
 AnimationMode 默认为 AnimationModeContinuous，
 其他属性，均为可选值，需要使用 NSNumber
 */
@property (nonatomic, assign) AnimationMode animationMode;

@end
```

<span id="moveCameraToContain">
### 调整视觉矩形

除了调整视角中心，SDK 还提供调整视觉矩形API。

> 视觉矩形表示你的视角必须容纳的区域。当你设置好视觉矩形后，视角会自动调整到刚好可以完整展示视觉矩形所表示的范围。

```Objective-C
@interface WhiteRectangleConfig : WhiteObject

- (instancetype)initWithInitialPosition:(CGFloat)width height:(CGFloat)height;
/** 移动到初始位置，并根据宽高进行缩放 */
- (instancetype)initWithInitialPosition:(CGFloat)width height:(CGFloat)height animation:(AnimationMode)mode;

/** 白板内部坐标，以中心点为初始点，此处 originX: - width / 2，originY: -height /2 */
- (instancetype)initWithOriginX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height;
- (instancetype)initWithOriginX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height animation:(AnimationMode)mode;

@property (nonatomic, assign) CGFloat originX;
@property (nonatomic, assign) CGFloat originY;
@property (nonatomic, assign) CGFloat width;
@property (nonatomic, assign) CGFloat height;
@property (nonatomic, assign) AnimationMode animationMode;

@end
```

## ppt 铺满当前屏幕

> [Whiteboard](https://github.com/netless-io/Whiteboard-iOS) 开源版本 2.5.1 新增 API

```Objective-C
/**
 将 ppt 等比例铺满屏幕（参考 UIViewContentModeScaleAspectFit ）。
 该操作为一次性操作，不会持续锁定。
 如果当前页没有 ppt，则不会进行缩放。
 @param mode 动画参数，连续动画，或者瞬间切换
 */
- (void)scalePptToFit:(WhiteAnimationMode)mode;
```

## 禁止视角变化<span class="anchro" id="disableCameraTransform">

>2.2.0 新增 API

开发者可以通过如下方法禁止用户手动调整视角（使用鼠标滚轮缩放、Touch 板手势移动，缩放、移动端双指操作移动）。

```Objective-C
// 禁止用户主动改变视野
[room disableCameraTransform:YES];
// 恢复用户视野变化权限
[room disableCameraTransform:NO];
```

>你仍然通过程序调整视角；用户仍然可以进行笔画等输出操作。


## 相关文档

[主播一对多业务实现](/docs/doc/broadcast)
