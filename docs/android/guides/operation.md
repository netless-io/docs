---
id: android-operation
title: 白板操作
---

## 插入图片

相关 API：

```Java
public void insertImage(ImageInformation imageInfo);
public void completeImageUpload(String uuid, String url);
```

1. 首先创建 `ImageInformation` 类，配置图片，宽高，以及中心点位置，设置 uuid，确保 uuid 唯一即可。
1. 调用 `insertImage:` 方法，传入 `ImageInformation` 实例。白板此时就先生成一个占位框。
1. 图片通过其他方式上传或者通过其他方式直接获取到图片的网络，在获取图片地址后，调用
`completeImageUpload` 方法，uuid 参数为 `insertImage:` 方法传入的 uuid，src 为实际图片网络地址。

### 插入PPT 与插入图片 的区别

区别| 插入PPT | 插入图片
---------|----------|---------
 调用后结果 | 会自动新建多个白板页面，但是仍然保留在当前页（所以无明显区别），需要通过翻页API进行切换 | 产生一个占位界面，插入真是图片，需要调用 `completeImageUploadWithUuid:src:` ,传入占位界面的 uuid，以及图片的网络地址 |
 移动 | 无法移动，所以不需要位置信息 | 可以移动，所以插入时，需要提供图片大小以及位置信息
 与白板页面关系 | 插入 ppt 的同时，白板就新建了一个页面，这个页面的背景就是 PPT 图片 | 是当前白板页面的一部分，同一个页面可以加入多张图片

## 图片网址替换

部分情况下，我们需要对某个图片进行签名，以保证图片只在内部使用。

替换API可以在图片实际插入白板前进行拦截，修改最后实际插入的图片地址。**该方法对 ppt 图片和普通插入图片都有效。**
在回放时，图片地址仍然为未替换的地址，也需要通过此 API 进行签名。

```Java
WhiteSdkConfiguration sdkConfig = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
//必须在sdk 初始化时，就设置替换
sdkConfig.setHasUrlInterrupterAPI(true);

//初始一个实现了 UrlInterrupter interface 的类，作为 WhiteSDK 初始化参数即可。
UrlInterrupterObject interrupter = new UrlInterrupterObject()
WhiteSdk whiteSdk = new WhiteSdk(whiteBroadView PlayActivity.this, interrupter);
```

>该方法会同时对 ppt插入以及图片插入API起效。

>该 API 会在渲染时，被频繁调用。如果没有需求，就不需要使用该方法。

## 禁止操作<span class="anchor" id="disableOperations">

> 2.2.0 开始，该 API 拆分为：
禁止用户移动，缩放 API：`disableCameraTransform` (详情请参考 [视角操作-禁止视角变化](./view.md#disableCameraTransform))；
禁止用户输入 API：`disableDeviceInputs` (详情请参考 [教具使用-禁止教具操作](./tools.md#disableDeviceInputs) API。

你可以通过 `room.disableOperations(true)` 来禁止用户操作白板。

你可以通过 `room.disableOperations(false)` 来恢复用户操作白板的能力。

## 只读模式

> 2.6.0 及其更高版本支持


## 缩放

一方面通过手势可以放缩白板（iOS 和 Android 上使用双指手势、mac os 使用双指手势、windows 使用鼠标中键的滚轮），另一方面也可以通过 `zoomChange` 来缩放白板。

```java
room.zoomChange(10);
```

## 背景色

白板本身底色为透明，如需设置背景色，只需要对 WhiteboardView 设置 backgroundColor 即可。

## 用户信息透传

>2.0.0 正式版新增 API

从 2.0.0 开始，SDK 支持开发者在加入房间时，携带部分额外信息。
>该字段会被转换为 JSON 中的一个 value，所以需要满足 JSON 对 JSON 元素的约束。

在其他客户端，可以通过查询房间 `roomMembers` 来获取各个用户携带的信息。

### 用户头像显示

>2.0.0-beta7 版本新增功能。2.0.0 正式版，功能有所增强。

1. 初始化 SDK 时，将 `WhiteSdkConfiguration` 中的 `userCursor` 设置为 `true`。
1. 配置加入房间时，传入的 `RoomParams` `userPayload` 字段，并且确保存在 `avatar` 字段。

```Java
WhiteSdkConfiguration sdkConfiguration = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1, true);
sdkConfiguration.setUserCursor(true);
```

```Java
HashMap<String, String> payload = new HashMap<>();
payload.put("avatar", "https://example.com/user.png");
RoomParams roomParams = new RoomParams("uuid", "roomToken", payload);
```

>2.0.0-beta7 版本，可以配置 `MemberInformation` 字段。

## 主动延时

*1.x 不提供该 API， `2.0.0-beta8` 新增API。*

```Java
//Room.java
//设置延迟秒数
public void setTimeDelay(Integer timeDelay)
//获取本地客户端，自动延时的秒数
public Integer getTimeDelay()
```

快速设置白板延时，人为给白板增加一部分延时，延迟播放，满足 HLS 情况下与音视频同步的需求。

注意点：

1. 参数单位为秒。
1. 该方法只对本地客户端有效。
1. 该方法会同时影响自定义时间，用户头像回调事件。
1. 用户本地绘制，仍然会实时出现。


## 清屏 API

* 2.0.0-beta10 及其后续版本提供

```Java
/**
 清除当前屏幕内容

 @param retainPPT 是否保留 ppt
 */
public void cleanScene(boolean retainPpt)
```

## 日志上传功能

>2.4.2 新增API

2.4.2 开始，sdk 会收集 sdk 中的debug 日志，主要涉及 API 调用时的输出。

在使用`WhiteSdkConfiguration`初始化 SDK 时，配置 `WhiteSdkConfiguration` 中 `LoggerOptions` 选项，调用`LoggerOptions`的`setDisableReportLog`方法，设置为 true 后，再初始化 WhiteSDK 即可关闭上传内容。