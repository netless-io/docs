---
id: ios-document
title: 文档转换与播放
---

阅读本文前，请先阅读 server 端文档: [文档转图片](/docs/server/overview/server-static-conversion)、[文档转网页](/docs/server/overview/server-dynamic-conversion)，确保已经在 [console](https://console.netless.link) 开通对应服务。

SDK 将于 SDK 服务器的交互封装成了 `WhiteConverter` 类，开发者无需在客户端关心与 SDK 服务器端的交互。

## 展示转换后文档

对于 pptx 文档而言，每一页都将与白板的一个场景对应。

一个有 24 页的 pptx 文件，将在白板上创建 24 个场景。关于场景概念，详情请见 [场景管理](/docs/ios/guides/ios-scenes)。

```Objective-C
WhiteConverter *converter = [[WhiteConverter alloc] initWithRoomToken:self.roomToken];
[converter startConvertTask:@"url" type:ConvertTypeDynamic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
    NSLog(@"progress:%f", progress);
} completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
    NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
    if (ppt) {
        [self.room putScenes:@"/dynamic" scenes:ppt.scenes index:0];
        [self.room setScenePath:@"/dynamic/1"];
    }
}];
```

## 动态 PPT 动画/翻页

你可以通过调用如下方法来播放动态 PPT，当当前页面 PPT 的动画全部执行完成后，再次调用该方法时，会自动进入下一页场景。

```javascript
[room pptNextStep]; // 下一页（下一步）
[room pptPreviousStep]; // 上一页（上一步）
```

## 动态 PPT 音视频通知

>2.9.12 新增 API

`WhiteCommonCallbackDelegate`在原有的基础上，新增以下两个 API 回调，可以接受动态 PPT 音视频，播放与暂停回调。

```Objective-C
/**
 * 动态 ppt 中的音视频媒体，播放通知
 */
- (void)pptMediaPlay;

/**
 * 动态 ppt 中的音视频媒体，暂停通知
 */
- (void)pptMediaPause;
```

## 自定义字体

如果你的 pptx 中包含了不属于我们默认字体列表中的字体，你可以通过配置自定义字体列表来支持。首先，你需要将字体文件上传到你自己的服务器或对象存储平台。然后，将字体文件的 URL 在 sdk 初始化时以如下代码配置。

```javascript
WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
config = @{@"Calibri": @"https://your-cdn.com/Calibri.ttf", 
            @"宋体": @"https://your-cdn.com/Songti.ttf",
            @"楷体": @"https://your-cdn.com/Kaiti.ttf"};
//初始化 SDK 时，带入 config
```
