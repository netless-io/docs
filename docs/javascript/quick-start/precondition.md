---
id: js-precondition
title: 前提条件
---

本章节以纯`HTML`+`JavaScript`文本接入做介绍，并且使用`es6`语法，进行开发。
实际开发中，`vue`与`react`经过配置后，可以转义成`es5`。

本文介绍在正式使用白板 SDK 前，需要做的准备。

## 1. 获取 sdkToken

阅读 [接入准备](blog/begin-netless.md)，注册账号，获取 sdk token。

## 2. 添加 SDK 到项目中

创建 `index.html` ，在其中写入以下内容：

```HTML
<!DOCTYPE html>
<html>
    <head>
        <!-- 版本号根据最新版本更改即可 -->
        <link rel="stylesheet" href="https://sdk.herewhite.com/white-web-sdk/2.5.1.css">
        <script src="https://sdk.herewhite.com/white-web-sdk/2.5.1.js"></script>
        <script>
            //后续实现代码
        </script>
    </head>
    <body>
        <div id="whiteboard" style="width: 100%; height: 100vh;"></div>
    </body>
</html>
```

> react 项目的集成 sdk 方式请参考 [SDK集成](../guide/sdk.md)。并在项目中 index.html 的 ```<body>``` 内添加一个
```<div id="whiteboard" style="width: 100%; height: 100vh;"></div>``` 元素以便我们挂载白板

## 整体流程示意图
![quick_start_flow](/img/quick_start_flow.png)

## 推荐阅读

1. [实时房间](./room.md)
1. [回放房间](./player.md)