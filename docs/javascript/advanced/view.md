---
id: view
title: 视角
---


Netless 互动白板允许移动视角、放缩视角，也允许禁止视角做操作，甚至可以自定义视角跟随。

到此章为止，我们假设你已经将 Netless 互动白板 SDK 安装并引入了项目，并且已经获取到实时房间实例 `room` 对象。如果没有，你可能跳过了之前的章节，强烈建议你先阅读[《安装》](https://developer.netless.link/javascript/advanced-tutorial/installation)[《实时房间》](https://developer.netless.link/javascript/advanced-tutorial/realtime-room)。

> 本章教程只会让你把视角操作的相关内容涉猎一遍。如果想深入了解相关内容，可以在阅读完本章后参考[《视角与坐标》](https://developer.netless.link/documents/client/view-and-coordinates)。

## 主动操作视角

视角操作基于白板的**世界坐标系**。Netless 互动白板的场景是一个无边无际的空间，从中心原点向四方无限延伸。中心原点的坐标为 \(0, 0\)，横轴为 x 轴，方向向右，纵轴为 y 轴，方向向下。这个坐标系是绝对的，不随视角的变化而变化。如果对此想了解更多，可以阅读[《视角与坐标》](https://developer.netless.link/documents/client/view-and-coordinates)。

在实践中，可以通过如下方法，把屏幕坐标系转化成世界坐标系。屏幕坐标系的原点在白板中心，放缩比例和占位符 `<div>` 的坐标系一致（该坐标系会受到 transform 影响）。

```javascript
var pointInScreen = {x: 100, y: 150};
var pointInWorld = room.convertToPointInWorld(pointInScreen);
```

在了解了世界坐标系和屏幕坐标系的关系，以及转换方法后，就可以开始主动操作视角了。例如，可以通过如下方法，把镜头的中心移动到世界坐标 \(100, 120\) 的位置。

```javascript
room.moveCamera({
    centerX: 100,
    centerY: 120,
    animationMode: "immediately",
});
```

执行完这个操作后，可以看到，屏幕的中心对准了世界坐标为 \(100, 120\) 的位置。注意参数 `animationMode` 的值为 `"immediately"`，这标明切换镜头的动作是一瞬间完成。如果觉得这个动作太生硬，可以调整这个参数。

```javascript
room.moveCamera({
    centerX: 100,
    centerY: 120,
    animationMode: "continuous",
});
```

调整后的切镜头过程柔和了很多，它会播一段连续的动画，将镜头切过去。你还可以通过如下方式一边切镜头，一边把画面放大（就像把镜头向画面推进一样）。

```javascript
room.moveCamera({
    centerX: 200,
    centerY: 260,
    scale: 1.5,
    animationMode: "continuous",
});
```

如此一来，画面放大了 50%。当然，我们可以不水平移动镜头，仅改变画面放缩比例。

```javascript
room.moveCamera({
    scale: 1.2,
    animationMode: "continuous",
});
```

## 设备直接操作视角

即使一行代码不写，用户也可以通过设备操作来调整视角。例如，智能手机用户可以通过手势移动视角，捏手指放缩视角。在 MacBook 用户可以通过触控板移动和放缩视角。如果鼠标带滚轮，用户可以用滚轮放缩视角。

如果你希望用户自由改变视角，用如下方法可以禁止这些操作。

```javascript
room.disableCameraTransform = true;
```

当然，你随时可以恢复这些操作。

```javascript
room.disableCameraTransform = false;
```

注意，该属性为 `true` 时，仅仅禁止设备操作。你依然可以用上一章节介绍的 `moveCamera` 方法主动调整视角。

## 锁定视角边界

Netless 互动白板的场景是无边无界的，如果不加限制，用户的视角不知道会跑到什么地方。想象一个在线课堂的业务场景。

老师通过 PPT 想学生授课。我们希望学生专注于 PPT。学生有时会放大画面，仔细阅读 PPT 的某一段内容。这一操作应该是被允许的。但学生有时会把视角弄到偏离 PPT 很远的位置，以至于手忙脚乱找不到 PPT 在哪，这种操作应该被禁止。

一旦学生视角偏离 PPT 太远，可以通过调用如下代码，拉回学生的视角，PPT 重新铺满学生的屏幕。

```javascript
room.scalePptToFit("immediately");
```

还有一种做法：把所有用户的视角限制在中央 PPT 上，当用户视图脱离 PPT 时，视角会被自动拉回来。假如PPT 尺寸为 `1024 * 768`，可以用如下代码把所有人的视角限制在以世界坐标 \(0, 0\) 为中心，宽为 1024，高为 768 的矩形之中。

```javascript
room.setCameraBound({
    centerX: 0,
    centerY: 0,
    width: 1024,
    height: 768,
});
```

甚至可以在加入房间前，就限制视角边界。

```javascript
whiteWebSdk.joinRoom({
    uuid: "房间 uuid",
    roomToken: "房间 room token",
    cameraBound: {
        centerX: 0,
        centerY: 0,
        width: 1024,
        height: 768,
    },
});
```

注意，上面这两种操作，都只影响到当前用户，不会影响房间里的其他人。如果希望房间里所有人都限制视角，则需要让他们各自调用该方法。

最后，可以调用如下方法取消视角边界限制。

```javascript
room.setCameraBound({
    centerX: 0,
    centerY: 0,
    width: Infinity,
    height: Infinity,
});
```
