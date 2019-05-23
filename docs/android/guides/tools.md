---
id: android-tools
title: 使用教具
---

# 教具

```java
public class MemberState {
    // 当前工具，修改它会切换工具。有如下工具可供挑选：
    // 1. selector 选择工具
    // 2. pencil 铅笔工具
    // 3. rectangle 矩形工具
    // 4. ellipse 椭圆工具
    // 5. eraser 橡皮工具
    // 6. text 文字工具
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

## 切换教具

White SDK 提供多种教具，我们可以通过修改 `memberState` 来切换当前的教具。例如，将当前教具切换成「铅笔」工具可以使用如下代码。
```java
MemberState memberState = new MemberState();
memberState.setCurrentApplianceName("pencil");
room.setMemberState(memberState);
```
可以通过如下代码获取当前房间的教具名称。

```java
room.getMemberState(new Promise<MemberState>() {
    @Override
    public void then(MemberState memberState) {
        memberState.getCurrentApplianceName();
    }

    @Override
    public void catchEx(Exception t) {

    }
});
```

## 教具列表

| 名称 | 字符串 | 描述 |
| :--- | :--- | :--- |
| 选择 | selector | 选择、移动、放缩 |
| 铅笔 | pencil | 画出带颜色的轨迹 |
| 矩形 | rectangle | 画出矩形 |
| 椭圆 | ellipse | 画出正圆或椭圆 |
| 橡皮 | eraser | 删除轨迹 |
| 文字 | text | 编辑、输入文字 |


## 调色盘

通过如下代码可以修改调色盘的颜色。
```java
MemberState memberState = new MemberState();
memberState.setStrokeColor(new int[]{255, 0, 0});
room.setMemberState(memberState);
```
通过将 RGB 写在一个数组中，形如 [255, 0, 0] 来表示调色盘的颜色。

也可以根据如下代码获取当前调色盘的颜色。
```java
room.getMemberState(new Promise<MemberState>() {
    @Override
    public void then(MemberState memberState) {
        memberState.getStrokeColor();
    }

    @Override
    public void catchEx(Exception t) {

    }
});
```
调色盘能影响铅笔、矩形、椭圆、文字工具的效果。
