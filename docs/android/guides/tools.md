---
id: android-tools
title: 教具使用
---

## 教具

教具作为当前用户自己的状态，在 SDK 中，属于 `MemberState` 管理。


```java
public class Appliance {
    // 铅笔
    public final static String PENCIL = "pencil";
    // 选择
    public final static String SELECTOR = "selector";
    // 矩形
    public final static String RECTANGLE = "rectangle";
    // 椭圆
    public final static String ELLIPSE = "ellipse";
    // 橡皮
    public final static String ERASER = "eraser";
    // 文字
    public final static String TEXT = "text";
    // 直线
    public final static String STRAIGHT = "straight";
    // 箭头
    public final static String ARROW = "arrow";
    // 抓手工具，切换后，单指即可平移
    public final static String HAND = "hand";
    // 激光笔，显示用户鼠标/手指位置，但是不会绘制任何内容
    public final static String LASER_POINTER = "laserPointer";
}

public class MemberState {
    // 当前工具，修改它会切换工具。具体参数可以参考 Appliance 中常量
    private String currentApplianceName;
    // 线条的颜色，将 RGB 写在一个数组中。形如 [255, 128, 255]。
    private int[] strokeColor;
    // 线条的粗细
    private Double strokeWidth;
    // 文字的字号
    private Double textSize;
    ... setter/getter
}
```

### 切换教具

White SDK 提供多种教具，我们可以通过修改 `memberState` 来切换当前的教具。例如，将当前教具切换成「铅笔」工具可以使用如下代码。
```java
MemberState memberState = new MemberState();
memberState.setCurrentApplianceName("pencil");
room.setMemberState(memberState);
```
可以通过如下代码获取当前房间的教具名称。

```java
room.getMemberState().getCurrentApplianceName();
```

### 颜色

通过如下代码可以修改调色盘的颜色。
```java
MemberState memberState = new MemberState();
memberState.setStrokeColor(new int[]{255, 0, 0});
room.setMemberState(memberState);
```
通过将 RGB 写在一个数组中，形如 [255, 0, 0] 来表示调色盘的颜色。

也可以根据如下代码获取当前调色盘的颜色。
```java
room.getMemberState().getStrokeColor();
```
调色盘能影响铅笔、矩形、椭圆、文字工具的效果。

## 禁止教具操作<span class="anchor" id="disableDeviceInputs">

>2.2.0 新增 API

你可以通过如下方法屏蔽教具。

```java
// 禁止教具操作
room.disableDeviceInputs(true);
// 恢复教具操作
room.disableDeviceInputs(false);
```