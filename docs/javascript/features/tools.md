---
id: js-tools
title: 教具操作
---

本章`room`变量，都是白板房间实例。

## 普通教具

`room`的`state`中，存在`memberState`属性（可以阅读[状态管理](./state.md)查看更多`state`信息）。  
普通教具都可以通过`memberState`进行描述。

### MemberState 结构

```typescript
type MemberState = {
    // 当前教具名称
    currentApplianceName: string;
    // 当前教具颜色，为一个整数数组，分别代表 [R, G, B]，范围为 0-255的整数。
    // 该值影响所有普通教具
    strokeColor: Color;
    // 当前教具粗细，默认 4
    strokeWidth: number;
    // 文字教具字体大小，默认 16px
    textSize: number;
};
```

### 种类

| 名称 | 字符串 | 描述 |
| --- | ------ | --- |
| 选择 | `selector` | 选择，可以选择一个或多个图形，并将其移动，缩放，删除（del按键） |
| 铅笔（默认） | `pencil` | 画出带颜色的轨迹 |
| 矩形 | `rectangle` | 画出矩形或者正方形（shift按键）|
| 椭圆 | `ellipse` | 画出椭圆或正圆（shift按键）|
| 橡皮 | `eraser` | 删除轨迹 |
| 文字 | `text` | 编辑、输入文字 |
| 直线 | `straight` | 画出直线的工具 |
| 箭头 | `arrow` | 画出箭头的工具 |
| 抓手工具 | `hand` | 拖动白板画布的工具 |
| 激光笔工具 | `laserPointer` | 激光笔工具，用于指出重点内容 |

### 调整教具（种类，颜色，粗细，大小）

```javascript
// 修改教具，只需要传入想要修改的字段即可
room.setMemberState({
    currentApplianceName: "pencil",
    strokeColor: [255, 0, 0],
    strokeWidth: 4,
    textSize: 14,
});
```

### 教具信息查询

可以通过以下方法访问`memberState`中内容。

```js
const memberState = room.state.memberState;
const appliance = room.state.memberState.currentApplianceName;
//...其他教具细节
```

### 橡皮擦擦除图片配置

橡皮擦可以额外配置，是否能够擦除图片：

1. 在初始化时，根据[初始化参数-房间参数](../parameters/room.md#disableeraseimage)中的`disableEraseImage`字段配置:`是否可以擦除图片（默认可以）`
1. 设置 `room.disableEraseImage` 属性。

## 图片（网络地址）

`sdk`支持向当前白板页面中插入网络图片（如需本地图片，请自行处理上传，获得网络图片逻辑）。

### Typescript 方法签名

```typescript
type ImageInformation = {
    // 图片唯一识别符，通过该 uuid 来保证 completeImageUpload 更新了正确的 insertImage 地址
    uuid: string;
    // 图片中心在白板内部坐标系的坐标。中心远点为初始化白板时的中心
    centerX: number;
    centerY: number;
    // 想要显示的宽高，该宽高为白板未缩放前宽高
    width: number;
    height: number;
    // 图片是否允许被删除
    locked: boolean;
};

//插入图片占位符
public insertImage(imageInfo: ImageInformation): void;
//图片url替换
public completeImageUpload(uuid: string, src: string): void;
```

### 示例代码

1. 调用`insertImage`方法，确保`uuid`字符串唯一，配置图片位置（大小，中心位置）信息。
然后通过服务器，或者本地上传至云存储仓库中，获取到要插入图片信息的网络地址，在调用 `方法2`, 传入图片网络地址。

```JavaScript
// 方法1 插入图片占位信息
// 通过 uuid 来保证，completeImageUpload 更新的是同一张图片地址
room.insertImage({
    uuid: uuid,
    centerX: x,
    centerY: y,
    width: imageFile.width,
    height: imageFile.height,
    locked: false,
});
// 方法2 传入图片占位 uuid，以及图片网络地址。
room.completeImageUpload(uuid, imageUrl)
```

### `图片教具`与`ppt背景图`区别

区别| 插入背景图`putScenes` | 插入图片`insertImage`+`completeImageUpload`
---------|----------|---------
 与页面关系 | 新建一个带背景图的空白页面 | 在当前页面插入了一张图片，根据绘制关系，决定前后 |
 位置 | 居中 | 根据`insertImage`传入参数的位置信息，在白板内部系中布局 |
 橡皮 | 不可涂改 | 默认可以涂改，可以通过修改`room`的`disableEraseImage`属性或在初始化时，配置`disableEraseImage`参数更改|

## 抓手工具

### 快捷键设置

请阅读[初始化参数-SDK参数](../parameters/sdk.md#handToolKey)中的`handToolKey`字段说明。

### 主动激活/关闭

直接修改`room`的`handToolActive`属性。

```js
//主动激活
room.handToolActive = true;
//主动关闭
room.handToolActive = false;
```

### 激活/关闭回调

当抓手工具被激活（包括主动激活）时，会回调[初始化参数-房间参数](../parameters/room.md#disableeraseimage)中`callbacks`的`onHandToolActive` 方法。

## 禁用教具

>2.2.0 新增 API

通过修改`room`的`disableDeviceInputs`属性或在初始化时，配置`disableDeviceInputs`参数。

```javascript
// 禁止教具操作
room.disableDeviceInputs = true;
// 恢复教具操作
room.disableDeviceInputs = false;

sdk.joinRoom({uuid: "uuid", roomToken: "roomToken", disableDeviceInputs: true})
.then(function(room) {
    //room 操作
});
```
