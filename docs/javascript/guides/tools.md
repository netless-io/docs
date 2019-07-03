---
id: js-tools
title: 教具使用
---

本教程中的 `room` 都是白板房间实例。具体可以参考 [quick-start](/docs/js/quick-start/js-declare) 中，加入房间的相关实现。

## 教具

sdk 提供多种教具，我们可以通过调用 `room` 的 `setMemberState` API，修改 `room` 的 `memberState` 来切换当前的教具。

```javascript
// 将当前教具切换成「铅笔」工具可以使用如下代码。
room.setMemberState({
    currentApplianceName: "pencil",
});
```

可以通过如下代码获取当前房间的教具名称。

```javascript
room.state.memberState.currentApplianceName
```

white-web-sdk 提供如下教具。

| 名称 | 字符串 | 描述 |
| :--- | :--- | :--- |
| 选择 | selector | 选择、移动、放缩 |
| 铅笔 | pencil | 画出带颜色的轨迹 |
| 矩形 | rectangle | 画出矩形或者正方形（shif） |
| 椭圆 | ellipse | 画出椭圆或正圆（shift） |
| 橡皮 | eraser | 删除轨迹 |
| 文字 | text | 编辑、输入文字 |

## 调色盘

通过如下代码可以修改调色盘的颜色。

```javascript
room.setMemberState({
    strokeColor: [255, 0, 0],
});
```

通过将 RGB 写在一个数组中，形如 [255, 0, 0] 来表示调色盘的颜色。

也可以根据如下代码获取当前调色盘的颜色。

```javascript
room.state.memberState.strokeColor
```

调色盘能影响铅笔、矩形、椭圆、文字工具的效果。

## 笔画文字大小

```javascript
// 画笔教具大小
room.setMemberState({
    strokeWidth: 1,
});

// 文字教具大小
room.setMemberState({
    textSize: 1
})
```

## 禁止教具操作<span id="disableDeviceInputs">

你可以通过如下方法屏蔽教具。

```javascript
room.disableDeviceInputs = false;
```