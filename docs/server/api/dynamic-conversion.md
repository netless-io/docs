---
id: server-dynamic-conversion
title: 文档转网页（动态文档转换）
---

动态文档转换是指将 pptx 格式的文件，转换成网页的服务。

>相对于静态文档转换，动态文档转换，保留了 ppt 文件中的顺序动画，提供切换控制功能。

## 准备工作

### 1. 根据 [配置云存储](/docs/blog/blog-add-driver) 文章，在 [console](https://console.herewhite.com) 中配置云存储

### 2. 在管理控制台上开启动态文档服务

1. 进入 [console](https://console.herewhite.com)，点击左侧列表中的 <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> ，进入应用管理页面。

2. 找到 `文档转图片` 进行开通，更新 QPS ，结束操作。

<details>
<summary>**点击展开：console 中操作示意图**</summary>

* 动态文档转换初始状态
![动态文档转换初始状态](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic0.png)

* 动态文档转换管理页面
![动态文档转换管理页面](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic1.png)

* 关闭动态文档转换服务
![关闭静态文档转换服务](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic2.png)

</details>


## 服务端 API

动态文档转换功能由“发起转换任务”和“查询转换任务”两个 API 组成

### 发起转换任务


`POST /services/conversion/tasks?token={{token}}`

或

`POST /services/conversion/tasks?roomToken={{roomToken}}`

>在服务端可以使用 sdk token。客户端封装类要求使用 roomToken，避免 sdk token 泄露。

* body参数

字段 | 类型 | 描述 |
--  | -- | -- |
sourceUrl | stirng | 需要进行转换的文件的地址 |
serviceType | string | 服务类型，动态文档转换固定为 "dynamic_conversion" |

* body

```json
{
    //请确保该文件可下载
    "sourceUrl": "https://xxxx.xxx.xxx.com/xxxx.pptx",
    "serviceType": "dynamic_conversion"
}
```

* response

> 在发起转换任务前请确保您已经在 [console](https://console.herewhite.com) 上开启了`文档转网页`服务并配置 QPS 上限大于 0，否则该接口将会报 `Service not enable`、`Task waiting line is full`。

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
task UUID 长度为 32 位，是转换任务的唯一标识。后续请求中需要以该 task 作为查询。

### 查询转换任务进度

`GET /services/conversion/tasks/{{taskUUID}}/progress?serviceType=dynamic_conversion&token={{token}}`

或

`GET /services/conversion/tasks/{{taskUUID}}/progress?serviceType=dynamic_conversion&roomToken={{roomToken}}`

* response

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
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide1.xml"
                },
                {
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide2.xml"
                },
                {
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide3.xml"
                }
            ],
            "prefix": "pptx://xxxx.xxx.xxx.com/" // 文档转换结果前缀
        }
    }
}
```

> 1. 动态转换任务将会返回每一页的宽高，该宽高单位是 px
> 2. 用户使用返回结果中的 "prefix" 仅在转换结果为 "Finished" 时存在
> 3. 转换任务需要用户轮询结果，时间间隔建议为 3 秒以上

`convertStatus` 存在以下几种情况：
- Waiting: 由于 QPS 到达上限等原因任务在等待中
- Converting: 任务正在执行中
- NotFound: 根据 taskUUID 未找到对应任务信息
- Finished: 任务执行完成且正常
- Fail: 任务执行失败，失败时，会有提示 reason

### 拼接 SDK 可用数据

获取转换结果后，需要自行进行拼接转换为 sdk 可用的场景数据（scenes）。

该部分可以交由客户端自行拼接，或者在服务器端拼好，以 JSON 格式发送给客户端。

#### 1. 交由客户端自行拼接

将转换结果的 `json`，`taskId`，还有 `prefix` 转给客户端，进行拼接。（推荐方式，因为客户端仍然需要转换成 sdk 支持的 scene 类进行传入）

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```javascript
// info 为转换结果返回的 response
const count = info.totalPageSize;
const scenes: {name: string, ppt: PptDescription}[] = [];
const ppts = info.convertedFileList;
for (let i = 0; i < ppts; ++ i) {
    const url = `${prefix}${ppts[i].conversionFileUrl}`;
    slideURLs[i] = url;
    scenes[i] = {
        // 请使用字符串
        name: `${i + 1}`,
        ppt: {src: url, width: info.width, height: info.height},
    };
}
// scenes 即为白板支持的数据格式
```
<!--iOS/Objective-C-->
```Objective-C
// response 为转换结果返回的 response
NSInteger count = [response[@"totalPageSize"] integerValue];
NSArray *ppts = response[@"convertedFileList"];
NSMutableArray<WhiteScene *> *scenes = [NSMutableArray arrayWithCapacity:count];

for (int i = 0; i < ppts; i++) {
    NSDictionary *dict = ppts[i];
    WhitePptPage *pptPage = [[WhitePptPage alloc] init];
    pptPage.src = [NSString stringWithFormat:@"%@%@", prefixUrl ? : @"", dict[@"conversionFileUrl"]];
    pptPage.width = [response[@"width"] doubleValue];
    pptPage.height = [response[@"height"] doubleValue];
    WhiteScene *scene = [[WhiteScene alloc] initWithName:[NSString stringWithFormat:@"%d", i+1] ppt:pptPage];
    [scenes addObject:scene];
}
// scenes 数组，即为白板支持的数据格式。iOS 端接收到 JSON 后，可以主动转换为WhiteScenes
```
<!--Android/Java-->
```Java
// json 即为查询结果 API 返回的 json
Integer count = json.get("totalPageSize").getAsInt();
JsonArray ppts = json.get("convertedFileList").getAsJsonArray();
Scene[] scenes = new Scene[count];

for (int i = 0; i < ppts.size(); i++) {
    PptPage pptPage = new PptPage(String.valueOf(i+1), json.get("width").getAsDouble(), json.get("height").getAsDouble());
    JsonObject object = array.get(i).getAsJsonObject();
    pptPage.setSrc(prefix + object.getAsJsonObject("conversionFileUrl").getAsString());
    sliderURLs[i] = pptPage.getSrc();
    scenes[i] = new Scene(String.valueOf(i+1), pptPage);
}
// scenes 数组，即为白板支持的数据格式。Android 端接收到 JSON 后，需要主动转换
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### 2. 转换成 JSON 发给客户端

```JSON
scenes: [
    {
        //name 为字符串即可
        "name" : "1",
        // height，width 为 info 中返回的宽高
        "height" : {info.heigh},
        "width" : {info.width},
        //数字索引值+1，第一页即为 slide1.xml,第二页为 slide2.xml
        "src" : {prefix}/{taskId}/slide/slide1.xml
    },
    {
        //name 为字符串即可
        "name" : "2",
        // height，width 为 info 中返回的宽高
        "height" : ${info.heigh},
        "width" : ${info.width},
        //数字索引值+1，第一页即为 slide1.xml,第二页为 slide2.xml
        "src" : {prefix}/{taskId}/slide/slide2.xml
    }
]
```

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
