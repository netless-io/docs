---
id: js-document
title: 文档转换
---

## 前提条件

sdk 服务器提供两种方式将大部分文档转换成白板可用的资源：

1. [文档转图片:word,pdf,ppt,pptx——静态转换](server/overview/static-conversion.md)
1. [文档转网页:pptx——动态转换](server/overview/dynamic-conversion.md)

>请确保在[console](https://console.herewhite.com) 开启对应转换服务。

## 转换任务

>转换服务实际上是几个网络请求拼接，将网络可见地址传给 sdk服务器，并轮询请求。  
>SDK 内部，已经将转换任务处理封装成了`pptConverter`类，开发者无需关心与 sdk 端交互，对于动静态转换，也只需要确认传入的 url 文件类型以及转换类型匹配即可。

### Typescript 方法签名

```typescript
export type PptConvertParams = {
    //转换资源地址
    readonly url: string;
    //转换类型
    readonly kind: PptKind;
    //上传回调，可选参数。转换进度，范围：0-1。
    readonly onProgressUpdated?: (progress: number) => void;
    //进度检查频率，毫秒。可选参数，默认 1.5 秒。
    readonly checkProgressInterval?: number;
    //超时时间，毫秒。可选参数，默认 5 分钟。
    readonly checkProgressTimeout?: number;
};

//转换任务类型
export enum PptKind {
    //静态，word，ppt，pdf，pptx
    Static = "static",
    //动态，pptx 转网页
    Dynamic = "dynamic",
}

//白板页面结构
export type SceneDefinition = {
    readonly name?: string;
    readonly ppt?: PptDescription;
};

//白板背景图（ppt）结构
export type PptDescription = {
    readonly src: string;
    readonly width: number;
    readonly height: number;
};

//转换结果
export type Ppt = {
    readonly uuid: string;
    readonly kind: PptKind;
    readonly width: number;
    readonly height: number;
    readonly slideURLs: ReadonlyArray<string>;
    //白板页面（场景）数组，格式已匹配，可以直接调用 room 的 putScenes API插入白板页面
    readonly scenes: ReadonlyArray<SceneDefinition>;
};

//转换接口
export interface PptConverter {
    convert(params: PptConvertParams): Promise<Ppt>;
}
```

### 示例代码

```typescript
import {WhiteWebSdk} from "white-web-sdk";
const whiteWebSdk = new WhiteWebSdk();
// roomToken 鉴权使用
const pptConverter = whiteWebSdk.pptConverter("输入 roomToken");
// 请求转码，获得每一个页面的数据
res = await pptConverter.convert({
    // 需要进行转换资源的网络地址，请确保可以正常访问
    url: pptURL,
    // 转换类型
    kind: "static" | "dynamic",
    // 转换进度监听
    onProgressUpdated: progress => {
      console.log(progress);
    },
    checkProgressInterval: 1500,
    checkProgressTimeout: 5 * 60 * 1000,
});

// 如果对新增的白板页面中，图片大小不满意，可以自己重新构建一个 scenes 数组，修改其中宽高

// 关于 putScenes，setScenePath 的更多信息，请阅读[页面（场景）管理]文档
// 将转换结果都塞进 ppt 目录中。如果要在一个房间中，插入多个转换任务，请取不同目录名称
room.putScenes(`/ppt`, res.scenes);
// put API 只是新增白板，并不会主动切换，需要通过 setAPI，主动设置到精确路径.
room.setScenePath(`/ppt/${res.scenes[0].name}`);
```

## 动态 PPT API

### 动画前进后退

通过以下 API，来控制动态 ppt 页面动画。

```javascript
room.pptNextStep(); // 下一步（下一页）
room.pptPreviousStep() // 上一步（上一页）
```

当当前页面的 ppt 动画已经全部执行完毕，再次调用 `room.pptNextStep` 时，会自动进入下一页动态 ppt 页面。`room.pptPreviousStep()` 效果类似。

### 自定义字体

`pptx`中，如果包含了非常规字体（付费字体），开发者可以在初始化时，配置自定义字体映射来支持。  
该 API 需要一个网络地址，开发者需要将字体文件上传到开发者自己的业务服务器或云存储中。然后在初始化`sdk`时，传入`fonts`字段。

```javascript
const whiteWebSdk = new WhiteWebSdk({
  appIdentifier: "{{appIdentifier}}"
  // ...其他配置项
  fonts: {
    "Calibri": "https://your-cdn.com/Calibri.ttf",
    "宋体": "https://your-cdn.com/Songti.ttf",
    "楷体": "https://your-cdn.com/Kaiti.ttf",
 },
});
```

## 动态 PPT 音视频回调
动态 ppt 内的音视频在播放时会有回调通知用户，回调方法在作为参数在加入房间时传入，包括：

```javascript
onPPTMediaPlay
onPPTMediaPause
onPPTMediaPlayError
```

具体方法签名请参考： 

[onPPTMediaPlay](/docs/javascript/parameters/js-room#onpptmediaplay)

[onPPTMediaPause](/docs/javascript/parameters/js-room#onpptmediapause)

[onPPTMediaPlayError](/docs/javascript/parameters/js-room#onpptmediaplayerror)
