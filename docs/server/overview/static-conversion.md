---
id: server-static-conversion
title: 文档转图片（不保留动画）
---


静态文档转换是指将 PPT、PPTX、Word、PDF 等格式文件，转换成图片的服务。主要是帮助客户在白板中插入演示资料来辅助在线授课或者远程会议。该功能由 SDK 服务器提供，需要与服务器进行交互。

在最新版本中，我们将这部分交互，封装在了 SDK 中，开发者只需要在后台开启服务，配置存储地址，即可在项目中，通过 `Converter` 类（不同平台，名称略有不同）进行转换。

## 文档转图片注意事项

1. 页数理想数值在 50 页以内，超过 100 页的文档有一定可能性转换超时。
2. PPT、PPTX、Word、PDF 以 PDF 转换结果最为准确。
3. 文档内引用的图片分辨率越高转换速度越慢。
4. 图片素材格式以 png 和 jpg 最为推荐。
5. 如果发现转码过程中样式表达过于不准确，请导出 pdf 后进行重新转换。
6. 本功能实现基于 [libreoffice](https://www.libreoffice.org/)，由于 libreoffice 历史悠久、代码复杂，遇到转换 bug 我们难以自行处理。所以客户使用前先做充分的与测试，如果不符合预期请使用三方转换服务。

## 准备工作

### 1. 根据 [配置云存储](/docs/blog/add-driver) 文章，在 [console](https://console.herewhite.com) 中配置云存储

### 2. 在管理控制台上开启静态文档服务

1. 进入 [console](https://console.netless.link)，点击左侧列表中的，进入应用管理页面。

2. 找到对应的项目，点击配置按钮开通。

## 调用示意图

![static_conversion_frame@2x](/img/static_conversion_frame@2x.png)
