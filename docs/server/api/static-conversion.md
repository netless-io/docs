---
id: server-static-conversion
title: 文档转图片
---

## 一、静态文档转换

> 静态文档转换是指将 PPT、PPTX、Word、PDF 等格式转换成图片的服务，主要是帮助客户在白板中插入演示资料来辅助在线授课或者远程会议。

## 二、前置条件

### 1. netless 的转码服务调用示意图

> 需要在 netless 管理控制台配置三方云存储，目的是：
>
> 1. 允许 netless 转码服务器可以从客户的云存储空间中读取资源，写入资源。
>
> 2. 配置存储支持跨域，方面在白板上面展示。

![static_conversion_frame@2x](https://ohuuyffq2.qnssl.com/static_conversion_frame@2x.png)

### 2. 在管理控制台上开启服务

## 开始使用

``` typescript
// 引入 white-web-sdk
import {WhiteWebSdk} from "white-web-sdk";

// 创建 WhiteWebSdk 对象，调用 pptConverter 成员方法
const whiteWebSdk = new WhiteWebSdk();
const pptConverter = whiteWebSdk.pptConverter("输入 roomToken");


// 1、调用 pptConverter 的成员方法 convert 开始转码
// 2、convert 的参数类型参考 PptConvertParams
type PptConvertParams = {
    readonly url: string;
    readonly kind: PptKind;
    readonly target?: OssTarget;
    readonly onProgressUpdated?: (progress: number) => void;
    readonly checkProgressInterval?: number;
    readonly checkProgressTimeout?: number;
};

// 请求转码，获得每一个页面的数据
res = await pptConverter.convert({
            // ppt 在云存储中地址，注意需要在控制台配置
  					url: pptURL,
  					// enum PptKind {
            // 		Dynamic = "dynamic", pptx 转网页请参照其他文档：
          	//  	Static = "static",	文档转图片
       			// }
            kind: "static", 
  					// 转码进度监听
            onProgressUpdated: progress => {
                if (onProgress) {
                    onProgress(PPTProgressPhase.Converting, progress);
                }
            },
        });

// 将获得的数据展示出来
// Scenes 是文件树结构，filename 可以类比为你想存储在 Scene 根文件夹下叫做 filename 的子文件夹
// room 对象是在加入房间的时候参数，具体参见其他文档：
room.putScenes(`/${filename}`, res.scenes);
room.setScenePath(`/${filename}/${res.scenes[0].name}`);

```

## 效果展示

![static_ppt_screen](https://ohuuyffq2.qnssl.com/static_ppt_screen.png)

