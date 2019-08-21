---
id: ios-tools
title: 教具使用
---

SDK 提供多种工具，如选择器、铅笔、文字、圆形工具、矩形工具。
这些功能的展现形式，关系到具体网页应用本身的交互设计、视觉风格。因此，白板上没有直接提供这些 UI 组件。你需要通过程序调用的方式，来让白板使用这些功能。

本文中的 API，都可以在 `WhiteRoom` 类中查看。本文示例代码中的 `room` 即为 `whiteRoom` 的实例。

## 教具

```Objective-C

//WhiteMemberState.h 文件

typedef NSString * WhiteApplianceNameKey;

extern WhiteApplianceNameKey const AppliancePencil;
extern WhiteApplianceNameKey const ApplianceSelector;
extern WhiteApplianceNameKey const ApplianceText;
extern WhiteApplianceNameKey const ApplianceEllipse;
extern WhiteApplianceNameKey const ApplianceRectangle;
extern WhiteApplianceNameKey const ApplianceEraser;

@interface WhiteMemberState : WhiteObject
/** 教具，初始教具为pencil，无默认值 */
@property (nonatomic, copy) WhiteApplianceNameKey currentApplianceName;
/** 传入格式为[@(0-255),@(0-255),@(0-255)]的RGB */
@property (nonatomic, copy) NSArray<NSNumber *> *strokeColor;
/** 画笔粗细 */
@property (nonatomic, strong) NSNumber *strokeWidth;
@property (nonatomic, strong) NSNumber *textSize;
@end

```

### 教具列表

| 名称 | Objective-C 常量 | 描述 |
| :--- | :--- | :--- |
| 选择 | ApplianceSelector | 选择、移动、放缩 |
| 铅笔 | AppliancePencil | 画出带颜色的轨迹 |
| 矩形 | ApplianceRectangle | 画出矩形 |
| 椭圆 | ApplianceEllipse | 画出正圆或椭圆 |
| 橡皮 | ApplianceEraser | 删除轨迹 |
| 文字 | ApplianceText | 编辑、输入文字 |

### 切换教具

White SDK 提供多种教具，我们可以通过生成 `WhiteMemberState` 实例，来设置当前的教具。

* 例子：我们将当前教具设置为「铅笔」工具：

```Objective-C
WhiteMemberState *memberState = [[WhiteMemberState alloc] init];
//白板初始状态时，教具默认为 pencil
memberState.currentApplianceName = AppliancePencil;
[whiteRoom setMemberState:memberState];
```

>由于 iOS webview 限制，2.0.5 之前的版本，键盘无法弹出。可以根据 [support webview keyboard](https://stackoverflow.com/questions/32449870/programmatically-focus-on-a-form-in-a-webview-wkwebview) 文章，关闭 webview 内部限制。

>当文字教具框，在软键盘遮盖范围内时，iOS 系统会自动滚动进行滚动，但是软键盘消失时，不会自动回复。可以自行调用 `whiteboardView.scrollView.contentOffset = CGPointZero`。
>2.1.0 在 whiteboardView 内部处理了键盘事件，进行了恢复。如果想要自己处理该情况，可以将 `whiteboardView` 的 `disableKeyboardHandler` 设置为 `YES`。

### 设置教具颜色，粗细

`WhiteMemberState` 还有其他属性:

```Objective-C
@interface WhiteMemberState : WhiteObject
/** 传入格式为[@(0-255),@(0-255),@(0-255)]的RGB */
@property (nonatomic, copy) NSArray<NSNumber *> *strokeColor;
/** 画笔粗细 */
@property (nonatomic, strong) NSNumber *strokeWidth;
@property (nonatomic, strong) NSNumber *textSize;
```

1. `strokeColor` 属性，可以调整教具的颜色。该属性，能够影响铅笔、矩形、椭圆、文字工具颜色。
2. `strokeWidth` 属性，可以调整教具粗细。该属性，能够影响铅笔、矩形、椭圆、工具颜色。

### 获取当前教具
```Objective-C
[room getMemberStateWithResult:^(WhiteMemberState *state) {
    NSLog(@"%@", [state jsonString]);
}];
```

## 禁止教具操作<span class="anchor" id="disableDeviceInputs">

>2.2.0 新增 API

你可以通过如下方法屏蔽教具。

```Objective-C
// 禁止教具操作
[room disableDeviceInputs:YES];
// 恢复教具操作
[room disableDeviceInputs:NO];
```