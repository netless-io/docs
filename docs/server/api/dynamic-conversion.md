---
id: server-dynamic-conversion
title: 文档转网页（动态文档转换）
---

动态文档转换是指将 pptx 格式的文件，转换成网页的服务。

>相对于静态文档转换，动态文档转换，保留了 ppt 文件中的顺序动画，提供切换控制功能。

## 准备工作

### 1. 根据 [配置云存储](/blog/2019/06/18/add-driver) 文章，在 [console](https://console.herewhite.com) 中配置云存储

### 2. 在管理控制台上开启动态文档服务

1. 进入 [console](https://console.herewhite.com)，点击左侧列表中的 <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> ，进入应用管理页面。

1. 找到 `文档转图片` 进行开通，更新 QPS ，关闭操作。

<details>
<summary>**点击展开：console 中操作示意图**</summary>

* 动态文档转换初始状态
![动态文档转换初始状态](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic0.png)

* 动态文档转换管理页面
![动态文档转换管理页面](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic1.png)

* 关闭动态文档转换服务
![关闭静态文档转换服务](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic2.png)

</details>

## SDK 封装类使用

### 使用转换 API

>iOS Android 2.2.0 新增 API

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
import {WhiteWebSdk} from "white-web-sdk";
const whiteWebSdk = new WhiteWebSdk();
// 服务端鉴权用
const pptConverter = whiteWebSdk.pptConverter("输入 roomToken");


// 1、调用 pptConverter 的成员方法 convert 开始转码
// 2、convert 的参数类型参考 PptConvertParams
type PptConvertParams = {
    readonly url: string; //静态文档的网络地址，请确保可以下载
    readonly kind: PptKind; //文档转换类型，静态为 PptKind.static(typescript) 或者 "static" (javascript)
    readonly onProgressUpdated?: (progress: number) => void;
    readonly checkProgressInterval?: number;  // 轮询间隔时间
    readonly checkProgressTimeout?: number; // 超时时间
};

// 请求转码，获得每一个页面的数据
res = await pptConverter.convert({
    // ppt 在云存储中地址，注意需要在控制台配置
    url: pptURL,
    kind: "dynamic", 
    // 转换进度监听
    onProgressUpdated: progress => {
        if (onProgress) {
            onProgress(PPTProgressPhase.Converting, progress);
        }
    },
});

// convert 返回的数据结构
export type Ppt = {
    // 服务器端，转换任务的 uuid
    readonly uuid: string;
    readonly kind: PptKind;
    readonly width: number;
    readonly height: number;
    // 预览页面地址
    readonly slideURLs: ReadonlyArray<string>;
    // ppt场景数据格式，使用该属性，即可直接插入新的场景页面
    readonly scenes: ReadonlyArray<SceneDefinition>;
};

// room 对象是在加入房间的时候参数，具体参见[场景管理](/docs/advance/scenes.md)文档
room.putScenes(`/${filename}`, res.scenes);
room.setScenePath(`/${filename}/${res.scenes[0].name}`);
```
<!--iOS/Objective-C-->

```Objective-C
#import <WhiteSDK.h>
// 详情请见 sdk WhiteConverter.h WhiteConversionInfo.h
@implementation RoomCommandListController
- (void)convertStatic {
  WhiteConverter *converter = [[WhiteConverter alloc] initWithRoomToken:self.roomToken];
  [converter startConvertTask:@"文档地址" type:ConvertTypeDynamic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
      NSLog(@"progress:%f", progress);
  } completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
      NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
      if (ppt) {
          // 场景相关内容，详情参考[场景管理](/docs/advance/scenes.md)文档
          [self.room putScenes:@"/dynamic" scenes:ppt.scenes index:0];
          //第一页
          [self.room setScenePath:@"/dynamic/1"];
      }
  }];
}
@end
```

<!--Android/Java-->
```Java
Converter c = new Converter(this.roomToken);
c.startConvertTask("文档地址", Converter.ConvertType.Dynamic, new ConverterCallbacks(){
    @Override
    public void onFailure(ConvertException e) {
        logAction("ppt fail");
    }

    @Override
    public void onFinish(ConvertedFiles ppt, ConversionInfo convertInfo) {
        if (ppt.getScenes() != null) {
            // 场景相关内容，详情参考[场景管理](/docs/advance/scenes.md)文档
            room.putScenes("dynamic", ppt.getScenes(), 0); 
            // 第一页
            room.setScenePath("dynamic/1");
        }
    }

    @Override
    public void onProgress(Double progress, ConversionInfo convertInfo) {
        logAction(String.valueOf(progress));
    }
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### 进度顺序切换

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```javascript
room.pptNextStep(); // 下一页（下一步）
room.pptPreviousStep() // 上一页（上一步）
```
<!--iOS/Objective-C-->
```Objective-C
[room pptNextStep]; // 下一页（下一步）
[room pptPreviousStep]; // 上一页（上一步）
```
<!--Android/Java-->
```Java
room.pptNextStep(); // 下一页（下一步）
room.pptPreviousStep(); // 上一页（上一步）
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 效果展示

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="http://ogbaxzius.bkt.clouddn.com/pptx_demo.mp4">
</video>
