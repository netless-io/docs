---
id: js-operation
title: 白板操作
---

代码中的 `room` 变量为 sdk `joinRoom` 初始化成功后，返回的 `room` 实例。

## 插入图片

sdk 支持向当前白板页面中插入图片，首先调用 `方法1` ，传递 uuid，以及图片位置（大小，中心位置）信息。uuid 是一个任意字符串，保证在每次调用时，使用不同值即可。
然后通过服务器，或者本地上传至云存储仓库中，获取到要插入图片信息的网络地址，在调用 `方法2`, 传入图片网络地址。

```JavaScript
// 方法1 插入图片占位信息
// 通过 uuid 来保证，completeImageUpload 更新的是同一张图片地址
room.insertImage({
    uuid: uuid, 
    //图片中心在白板内部坐标的
    centerX: x, 
    centerY: y, 
    //图片在白板中显示的大小
    width: imageFile.width, 
    height: imageFile.height
});
// 方法2 传入图片占位 uuid，以及图片网络地址。
room.completeImageUpload(uuid, imageUrl)
```

### 插入PPT 与插入图片 的区别

区别| 插入PPT | 插入图片
---------|----------|---------
 调用后结果 | 会自动新建多个白板页面，但是仍然保留在当前页（所以无明显区别），需要通过翻页API进行切换 | 产生一个占位界面，插入真是图片，需要调用 `completeImageUpload` 方法，传入占位界面的 uuid，以及图片的网络地址 |
 移动 | 无法移动，所以不需要位置信息 | 可以移动，所以插入时，需要提供图片大小以及位置信息
 与白板页面关系 | 插入 ppt 的同时，白板就新建了一个页面，这个页面的背景就是 PPT 图片 | 是当前白板页面的一部分，同一个页面可以加入多张图片

## 只读

>2.2.0 开始，该 API 拆分为：  
禁止用户移动，缩放 API：`disableCameraTransform` (详情请参考 [视角操作-禁止视角变化](./view.md#disableCameraTransform))；  
禁止用户输入 API：`disableDeviceInputs` (详情请参考 [教具使用-禁止教具操作](./tool.md#disableDeviceInputs) API。

```JavaScript
// 禁止响应用户手势
room.disableOperations = true;
// 恢复响应用户手势
room.disableOperations = false;
```

>2.0.0 正式版修复该 API 没有正确阻止 MacBook 触控板等之类的手势缩放行为。

## 缩放

>2.2.0 开始，该 API 不再推荐使用。新 API 提供动画选项，详情请参考 [视角操作-调整视角](./view.md#moveCamera)

用户可以通过手势，放缩白板。
另一方面 sdk 也支持通过 `zoomChange` 来缩放。

```javascript
// 与原始白板大小的比例
room.zoomChange(3);
// 获取当前缩放比例
let scale = room.state.zoomScale;
```

## 用户信息透传

>2.0.0正式版新增 API

```Javascript
export declare type JoinRoomParams = {
    readonly uuid: string;
    readonly roomToken: string;
    readonly userPayload?: any;
    readonly disableOperations?: boolean;
    readonly cursorAdapter?: CursorAdapter;
};
```

`WhiteWebSdk` `joinRoom` API 中第一个参数中的 `userPayload` 字段，现在支持任意类型（可以被 JSON 序列化即可）。

该字段的信息，会由 SDK 完整的传递给服务器，各个客户端，都可以在 `room.state.roomMember` 中进行读取。
>如果需要在 Android iOS 端使用 SDK 自带的显示用户头像功能，请在 userPayload 中的 avatar 字段传入用户头像地址。

### 用户鼠标显示

请参考介绍页面提供的 demo 实现

<details><summary>**2.0.0-beta.6~7 用户鼠标实现**</summary>

#### 1. 传入用户信息

在调用 sdk `joinRoom` API 时，额外传入 `userPayload` 字段。其中 userId 应为唯一值，否则，同一个 userid，先加入房间的用户会被后来的用户踢出房间。
具体字段为下面配置:

```Typescript
export type UserPayload = {
    //id 为遗留值，直接填0即可
    readonly id: number;
    readonly nickName: string;
    readonly avatar?: string;
    readonly userId: string;
};
```

#### 2. 读取用户信息

该信息会保存在 `room.state.roomMembers` 中， roomMembers 为数组，其中元素为以下格式。

```Typescript
export type RoomMember = {
    readonly memberId: number;
    readonly isRtcConnected: boolean;
    readonly information?: MemberInformation;
};
```

传入的 UserPayload 会对应转换在 `RoomMember` 的 `information` 字段中。memberId 则是 sdk 服务器，根据用户加入顺序分配的一个递增数字。

#### 3. 更新用户头像信息

当用户进行移动时，sdk 会回调创建 sdk 时，传入的 `onCursorViewsUpdate` 方法。

```Typescript
export type CursorUpdateDescription = {
    appearSet: CursorView[];
    disappearSet: CursorView[];
    updateSet: CursorView[];
};

export type CursorView = {
    readonly memberId: number;
    readonly x: number;
    readonly y: number;
};

```

该回调方法会返回一个 `CursorUpdateDescription` 结构。里面的用户信息，分为三种，分别为：出现的用户信息集合，消息的用户信息集合，更新的用户信息集合。

每个用户信息的具体内容，都在 `CursorView` ，可以根据 `memberId` 从 `room.state.roomMembers` 查找到对应的用户信息。

`x,y` 则是，该用户在白板上的位置。该坐标点的坐标原点，为白板左上角。x，y 则为用户坐标点距离白板左上角的位置。对应的，白板右下角坐标点，x，y 数值，即为白板的宽高。

推荐实现思路：在白板 div 之上，盖一层同样大小的 div，将 用户头像放在该 div 上。

以下为可以使用的 less 文件

```less
//覆盖在白板之上的 div
.user-cursor-layout {

  pointer-events: none;

  z-index: 4;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  > * {
    position: absolute;
  }
}

//用户头像
.user-cursor-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

//用户图片
.user-cursor-img {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin: 2px;
}

.user-cursor-tool {
  width: 16px;
  height: 16px;
  position: absolute;
  border-radius: 8px;
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  margin-top: -14px;
  margin-left: 16px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</details>

## 主动延时

>`2.0.0-beta.7` 新增API

```JavaScript
//延时 1 秒播放
room.timeDelay = 1000;
//获取白板主动延时时间
let delay = room.timeDelay;
```

使用 `room.timeDelay` 方法，可以快速设置白板延时，可以人为给白板增加一部分延时，延迟播放。

注意点：

1. 参数单位为毫秒。
1. 该方法只对本地客户端有效。
1. 该方法会同时影响自定义时间，用户头像回调事件。
1. 用户本地绘制，仍然会实时出现。

## 清屏 API

* 2.0.0-beta.6 及其后续版本提供

```Java
/**
 清除当前屏幕内容

 @param retainPPT 是否保留 ppt
 */
let retainPpt = true;
room.cleanCurrentScene(retainPpt);
```