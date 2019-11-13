---
id: js-operation
title: 白板操作
---


## 只读<span class="anchor" id="disableOperations">

>2.2.0 开始，该 API 可以由以下两个 API 代替:  
1. 视角锁定 API：`disableCameraTransform` (详情请参考 [视角操作-锁定视角](./view.md#disableCameraTransform))；  
1. 禁用教具 API：`disableDeviceInputs` (详情请参考 [教具操作-禁用教具](./tools.md#disableDeviceInputs))

```JavaScript
/// room.d.ts
// 禁止响应用户手势
room.disableOperations = true;
// 恢复响应用户手势
room.disableOperations = false;
```

## 缩放

>2.2.0 开始，该 API 不再推荐使用。新 API 提供动画选项，详情请参考 [视角操作-调整视角](./view.md#moveCamera)

用户可以通过手势，放缩白板。
另一方面 sdk 也支持通过 `zoomChange` 来缩放。

```javascript
///displayer.d.ts
// room player 通用

// 与原始白板大小的比例
room.zoomChange(3);
// 获取当前缩放比例
let scale = room.state.zoomScale;
```

## 主动延时

```JavaScript
//room.d.ts
//延时 1 秒播放
room.timeDelay = 1000;
//获取白板主动延时时间
let delay = room.timeDelay;
```

使用 `room.timeDelay` 方法，可以快速设置白板延时，可以人为给白板增加一部分延时，延迟播放。

注意点：

1. 参数单位为毫秒。
1. 该方法只对本地客户端有效。
1. 该方法会同时影响自定义事件。
1. 用户本地绘制，仍然会实时出现。

## 清屏

```js
///room.d.ts
/**
 * 清除当前屏幕内容
 * @param retainPPT 是否保留 ppt
 */
let retainPpt = true;
room.cleanCurrentScene(retainPpt);
```