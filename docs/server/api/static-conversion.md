---
id: server-static-conversion
title: 文档转图片（静态文档转换）
---

静态文档转换是指将 PPT、PPTX、Word、PDF 等格式文件，转换成图片的服务。主要是帮助客户在白板中插入演示资料来辅助在线授课或者远程会议。该功能由 SDK 服务器提供，需要与服务器进行交互。

在最新版本中，我们将这部分交互，封装在了 SDK 中，开发者只需要在后台开启服务，配置存储地址，即可在项目中，通过 `Converter` 类（不同平台，名称略有不同）进行转换。

## 准备工作

### 1. 根据 [配置云存储](/docs/blog/add-driver) 文章，在 [console](https://console.herewhite.com) 中配置云存储

### 2. 在管理控制台上开启静态文档服务

1. 进入 [console](https://console.herewhite.com)，点击左侧列表中的 <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> ，进入应用管理页面。

2. 找到 `文档转图片` 进行开通，更新 QPS ，结束操作。

<details>
<summary>**点击展开：console 中操作示意图**</summary>

* 静态文档转换初始状态
![静态文档初始状态](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static0.png)

* 静态文档转换管理页面
![静态文档管理页面](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static1.png)

* 关闭静态文档转换服务
![静态文档停止服务](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static2.png)

</details>

## API 使用说明

静态文档转换功能由“发起转换任务”和“查询转换任务”两个 API 组成

### 发起转换任务

`POST /services/conversion/tasks`

>在服务端可以使用 sdk token。客户端封装类要求使用 roomToken，避免 sdk token 泄露。

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken 或 token | string | {{roomtoken}} 或 {{token}}|

* body参数

字段 | 类型 | 描述 |
--  | -- | -- |
sourceUrl | stirng | 需要进行转换的文件的地址 |
serviceType | string | 服务类型，静态文档转换固定为 "static_conversion" |

> 在发起转换任务前请确保您已经在 console 上开启了“文档转图片”服务并配置 QPS 上限大于 0，否则该接口将会报"Service not enable"、"Task waiting line is full"等异常

* body 例子

```json
{
    "sourceUrl": "https://xxxx.xxx.xxx.com/xxxx.pptx",
    "serviceType": "static_conversion"
}
```

* response 例子

```JSON
{
    "code": 200,
    "msg": {
        "succeed": true,
        "reason": "",
        "taskUUID": "xxx6a660a6274c898b1689902734cxxx"
    }
}
```
task UUID 长度为 32 位，是转换任务的唯一标识

### 查询转换任务

`GET /services/conversion/tasks/{{taskUUID}}/progress?serviceType=static_conversion`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken 或 token | string | {{roomtoken}} 或 {{token}}|

* response 例子

```JSON
{
    "code": 200,
    "msg": {
        "task": {
            "convertStatus": "Finished",
            "reason": "",
            "totalPageSize": 3, // 文档总页数
            "convertedPageSize": 3, // 文档已转换完成页数
            "convertedPercentage": 100, // 文档转换进度百分比
            "convertedFileList": [  // 文档转换结果列表
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/1.png"
                },
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/2.png"
                },
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/3.png"
                }
            ],
            "prefix": "https://xxxx.xxx.xxx.com/" // 文档转换结果前缀
        }
    }
}
```

> 1. 静态转换任务将会返回每一页的宽高，该宽高单位是 px，但由于数字可能会过大导致在白板中渲染时超出视野，用户可以仅仅使用比例，自定义合适的宽度或高度
> 2. 用户使用返回结果中的 "prefix" 仅在转换结果为 "Finished" 时有效
> 3. 转换任务需要用户轮询结果，时间间隔建议为 3 秒以上

`convertStatus` 存在以下几种情况：
- Waiting: 由于 QPS 到达上限等原因任务在等待中
- Converting: 任务正在执行中
- NotFound: 根据 taskUUID 未找到对应任务信息
- Finished: 任务执行完成且正常
- Fail: 任务执行失败，失败时，会有提示 reason

## SDK 封装类使用

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
    kind: "static", 
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

blog
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
  [converter startConvertTask:@"文档地址" type:ConvertTypeStatic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
      NSLog(@"progress:%f", progress);
  } completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
      NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
      if (ppt) {
          // 场景相关内容，详情参考[场景管理](/docs/advance/scenes.md)文档
          [self.room putScenes:@"/static" scenes:ppt.scenes index:0];
          //第一页
          [self.room setScenePath:@"/static/1"];
      }
  }];
}
@end
```

<!--Android/Java-->
```Java
Converter c = new Converter(this.roomToken);
c.startConvertTask("文档地址", Converter.ConvertType.Static, new ConverterCallbacks(){
    @Override
    public void onFailure(ConvertException e) {
        logAction("ppt fail");
    }

    @Override
    public void onFinish(ConvertedFiles ppt, ConversionInfo convertInfo) {
        if (ppt.getScenes() != null) {
            // 场景相关内容，详情参考[场景管理](/docs/advance/scenes.md)文档
            room.putScenes("static", ppt.getScenes(), 0); 
            // 第一页
            room.setScenePath("static/1");
        }
    }

    @Override
    public void onProgress(Double progress, ConversionInfo convertInfo) {
        logAction(String.valueOf(progress));
    }
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 调用示意图

![static_conversion_frame@2x](/img/static_conversion_frame@2x.png)
