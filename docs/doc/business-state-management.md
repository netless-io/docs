---
id: business-state-management
title: 房间业务状态管理
---


房间的业务状态用于改变白板的行为，或承载自定义业务逻辑。注意，业务状态与[实时房间状态](https://developer.netless.link/documents/client/realtime-room-state-management)是不同的概念。

## 管理字典类型的 object

实时房间有 3 个字典类型的 object 数据结构：Global State、Member State、Broadcast State。它们都是 key-value 结构，你可以在客户端、前端任意地读取和修改它们。

如下代码可以读取它们。

```javascript
var globalState = room.state.globalState;
var memberState = room.state.memberState;
var broadcastState = room.state.broadcastState;
```

如下代码可以修改它们的某个 key-value 对。

```javascript
room.setGlobalState({
    "foobar": "hello world",
});

room.setMemberState({
    "foobar": "hello world",
});
```

也可以在加入房间时，插入回调函数来监听它们的变化。

```javascript
var joinRoomParams = {
    uuid: uuid,
    roomToken: roomToken,
};
whiteWebSdk.joinRoom(joinRoomParams, {
    onRoomStateChanged: function(modifyState) {
        if (modifyState.globalState) {
            // Global State 发生了变化
            var globalState = modifyState.globalState;
        }
        if (modifyState.memberState) {
            // Member State 发生了变化
            var memberState = modifyState.memberState;
        }
        if (modifyState.broadcastState) {
            // Broadcast State 发生了变化
            var broadcastState = modifyState.broadcastState;
        }
    },
});
```

## Global State

这是一个全局字典类型的 object 数据结构。它能被整个房间的用户读取、监听。任何用户在此之中写入的信息也会被整个房间看到。你可以基于这个特征，实现自定义业务逻辑。

## Member State

房间里每一个可写用户都有自己独一无二的一份 Member State，这是一个字典类型的 object。其生命周期自用户加入房间起开始，直到用户离开房间。了解了它的特征后，可以自由修改它，以实现自定义业务逻辑。

此外，Member State 中有一些预定义字段，这些自定义字段和教具的行为有关。具体如下。

| 字段名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| currentApplianceName | string | 当前教具名称 |
| strokeColor | \[integer, integer, integer\] | 笔迹颜色 |
| strokeWidth | number | 笔迹粗细 |
| textSize | integer | 文字字号 |
| pencilOptions | object | 铅笔工具参数 |

### 如何描述颜色

你也许注意到了 `strokeColor` 字段，这个字段用来描述当前笔迹的颜色。你需要 R、G、B 三个数字（取值 0～255），描述你想要的颜色。（可参考[《三原色光模式](https://zh.wikipedia.org/wiki/%E4%B8%89%E5%8E%9F%E8%89%B2%E5%85%89%E6%A8%A1%E5%BC%8F)》了解更多。）

例如，通过如下代码，可以让笔迹的颜色变成绿色。

```javascript
room.setMemberState({
    strokeColor: [0, 255, 0],
});
```

### 如何修改铅笔工具参数

铅笔工具参数 `pencilOptions` 是一个 object，它有更进一步的子结构。

| 字段名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| enableDrawPoint | boolean | 是否允许画点：仅仅单击鼠标时，应该画一个点，还是什么都画不出来。 |
| disableBezier | boolean | 是否禁止以贝塞尔曲线绘制铅笔笔迹，了解[《贝塞尔曲线》](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)。 |
| sparseWidth | number | 抽稀算法参数 |
| sparseHump | number | 抽稀算法参数 |

## Broadcast State

这是一个字典类型的 object，用来描述广播视角与视角跟随的状态。更多细节你可以参考[《视角与坐标》](https://developer.netless.link/documents/client/view-and-coordinates)章节，此处只作简单说明。

Broadcast State 的字段列表及其描述如下。

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| mode | 枚举：freedom、follower、broadcaster | 当前视角跟随模式 |
| broadcasterId | number | 当前主播的 `userId`。如果没有主播，则为 `undefined`。 |

你可以通过如下代码修改 `mode` 字段。

```javascript
room.setViewMode("broadcaster");
```

## User Payload

在以可写模式加入房间后，你可以插入一个自定义数据结构。该自定义数据结构一经传入，就无法被修改。房间里的其他人在获取用户列表时，可以获取列表中每个用户在加入房间时传入的 `userPayload` 数据。你可以根据这个特性设计自定义业务逻辑。

通过如下代码，在加入房间是传入特定的数据结构。

```javascript
var userPayload = {
    ... // 自定义数据结构
};
whiteWebSdk.joinRoom({
    uuid: uuid,
    roomToken: roomToken,
    userPayload: userPayload,
});
```

如果你希望加入房间的每个用户都与你自己的业务数据库中的用户关联，可以在 `userPayload` 中绑定你自己的 User ID。

```javascript
var userPayload = {
    ..., // 其他自定义数据结构
    userId: "业务数据库中的 User ID",
};
```

> 绑定业务逻辑的 User ID 后，你可以通过 User ID 来查询 Netless 互动白板的线上日志。如此一来，你的业务用户系统就与 Netless 的线上日志关联了起来。
