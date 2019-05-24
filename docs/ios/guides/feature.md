---
id: ios-feature
title: 高级功能
---

本文中的 API，都可以在 `WhiteRoom.h` 文件中查看。

本文示例代码中的 `room` 即为 `WhiteRoom` 的实例。

## 插入图片

```Objective-C

@interface WhiteRoom : NSObject

/**
 1. 先使用 insertImage API，插入占位图
 */
- (void)insertImage:(WhiteImageInformation *)imageInfo;

/**
 2. 再通过 completeImageUploadWithUuid:src: 替换内容
 替换占位图中的内容

 @param uuid insertImage API 中，imageInfo 传入的图片 uuid
 @param src 图片的网络地址
 */
- (void)completeImageUploadWithUuid:(NSString *)uuid src:(NSString *)src;

/** 封装上述两个 API */
- (void)insertImage:(WhiteImageInformation *)imageInfo src:(NSString *)src;

@end
```

<details><summary>插入图片 API——需要异步获取图片地址</summary>

1. 首先创建 `WhiteImageInformation` 类，配置图片，宽高，以及中心点位置，设置 uuid，确保 uuid 唯一即可。
1. 调用 `insertImage:` 方法，传入 `WhiteImageInformation` 实例。白板此时就先生成一个占位框。
1. 图片通过其他方式上传或者直接获取图片地址后，调用
`completeImageUploadWithUuid: src:` 方法，uuid 参数为 `insertImage:` 方法传入的 uuid，src 为图片网络地址。

</details>

<br>
v2版本中，我们将插入图片 API 封装成了一个 API。如果开发者在插入图片时，已经知道图片信息，可以直接使用封装好的 API

```Objective-C
WhiteImageInformation *info = [[WhiteImageInformation alloc] init];
info.width = 200;
info.height = 300;
info.uuid = @"WhiteImageInformation";
[self.room insertImage:info src:@"https://white-pan.oss-cn-shanghai.aliyuncs.com/101/image/alin-rusu-1239275-unsplash_opt.jpg"];
```

### 插入PPT 与插入图片 的区别

区别| 插入PPT | 插入图片
---------|----------|---------
 调用后结果 | 会自动新建多个白板页面，但是仍然保留在当前页（所以无明显区别），需要通过翻页API进行切换 | 产生一个占位界面，插入真是图片，需要调用 `completeImageUploadWithUuid:src` ,传入占位界面的 uuid，以及图片的网络地址 |
 移动 | 无法移动，所以不需要位置信息 | 可以移动，所以插入时，需要提供图片大小以及位置信息
 与白板页面关系 | 插入 ppt 的同时，白板就新建了一个页面，这个页面的背景就是 PPT 图片 | 是当前白板页面的一部分，同一个页面可以加入多张图片

## 图片网址替换

部分情况下，我们需要对某个图片进行签名，以保证图片只在内部使用。

替换API可以在图片实际插入白板前进行拦截，修改最后实际插入的图片地址。**该方法对 ppt 图片和普通插入图片都有效。**
在回放时，图片地址仍然为未替换的地址，也需要通过此 API 进行签名。

该方法为 `WhiteCommonCallbackDelegate` 协议中的一个申明方法，属于被动调用。

**如需启用，请在初始化 SDK 时，将 `WhiteSdkConfiguration` 的 `enableInterrupterAPI` 属性，设置为 YES。** 并在 `WhiteSDK` 初始化时，使用一下方法传入实现了该 protocol 的实例 

```Objective-C
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback
```

或者在想要使用时，调用 `whiteSDK` 的 `setCommonCallbackDelegate:` 方法，设置。

## 只读

```Objective-C
/** 进入只读模式，不响应用户任何手势 */
- (void)disableOperations:(BOOL)readonly;
```

## 缩放

用户可以通过手势（iOS上使用双指swipe手势、模拟器中按住 option + 鼠标进行模拟）对白板进行缩放操作。
另一方面，开发者也可以通过 `zoomChange` 来进行缩放。

* 代码设置缩放

```Objective-C
/**
 缩小放大白板
 @param scale 相对于原始大小的比例，而不是相对当前的缩放比例
 */
- (void)zoomChange:(CGFloat)scale;
```

* 代码获取缩放值

```Objective-C
- (void)getZoomScaleWithResult:(void (^) (CGFloat scale))result;
```

## 移动

白板支持双指手势，双指进行平移，即可移动白板（模拟器中可以通过 shift + option + 鼠标，来模式该手势）。

目前不支持使用代码进行移动。

## 用户头像显示

* 2.0.2 版本，新增功能

### 实现步骤：

#### 1. 初始化

在初始化 SDK 时，设置 WhiteSdkConfiguration 中的 userCursor 参数。

```Objective-C

@interface WhiteSdkConfiguartion ： WhiteObject

/** 显示操作用户头像(需要在加入房间时，配置用户信息) */
@property (nonatomic, assign) BOOL userCursor;

@end
```

#### 2. 加入房间

通过以下 API ，在加入房间的时候，就传入用户信息

```Objective-C
@interface WhiteSDK : NSObject
//加入房间API
- (void)joinRoomWithConfig:(WhiteRoomConfig *)config callbacks:(nullable id<WhiteRoomCallbackDelegate>)callbacks completionHandler:(void (^) (BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error))completionHandler;
@end
```


```Objective-C
@interface WhiteRoomConfig : WhiteObject
//初始化房间参数，传入用户信息
- (instancetype)initWithUuid:(NSString *)uuid roomToken:(NSString *)roomToken memberInfo:(WhiteMemberInformation * _Nullable)memberInfo;
@end
```

在初始化房间参数 `WhiteRoomConfig` 时，传入 `WhiteMemberInformation` 实例。
如果配置用户头像信息地址（推荐使用 https 地址，否则需要开启 iOS ATS 功能，允许 http 链接），如果不配置，则会显示 SDK 的默认占位符。
注意： **当加入的用户 userId 一致时，后加入的用户，会将前面加入的用户踢出房间**。

## 主动延时

*1.x 不提供该 API， `2.0.3` 新增API。*

```Objective-C
@interface WhiteRoom : NSObject
## 设置白板延时秒数
- (void)setTimeDelay:(NSTimeInterval)delay;
## 获取白板当前主动延迟时间
@property (nonatomic, assign, readonly) NSTimeInterval delay;
@end
```

快速设置白板延时，人为给白板增加一部分延时，延迟播放，满足 HLS 情况下与音视频同步的需求。

注意点：

1. 该方法只对本地客户端有效。
1. 该方法会同时影响自定义时间，用户头像回调事件。
1. 用户本地绘制，仍然会实时出现。

## 清屏 API

* 2.0.1 新增 API

```Objective-C
@interface WhiteRoom : NSObject
/**
 清除当前屏幕内容

 @param retainPPT 是否保留 ppt
 */
- (void)cleanScene:(BOOL)retainPPT;
@end
```