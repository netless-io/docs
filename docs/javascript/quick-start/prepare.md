---
id: js-prepare
title: 集成准备
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

本文以纯 `HTML` + `JavaScript` 文本接入做介绍，并且使用 `es6` 语法。

实际开发中， `vue` 与 `react` 经过配置后，可以转义成 `es5` 。

## 1. 获取 sdkToken

阅读 [接入准备](/blog/2019/05/02/first-step)，注册账号，获取 sdk token。

## 2. 添加 SDK 到项目中

<!--DOCUSAURUS_CODE_TABS-->
<!-- head 中 引入 js 文件-->
<br>
创建 `index.html` ，在其中写入一下内容。

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://sdk.herewhite.com/white-web-sdk/2.2.11
.css">
        <script src="https://sdk.herewhite.com/white-web-sdk/2.2.11
.js"></script>
        <script src="index.js"></script>
    </head>
    <body>
        <div id="whiteboard" style="width: 100%; height: 100vh;"></div>
    </body>
</html>
```
<!--包管理工具安装-->

```shell
# yarn 安装方式
yarn add white-web-sdk@^2.2.11

# 或者使用 npm 安装方式
npm install white-web-sdk@^2.2.11
 --save

# 不使用动态 ppt 的客户，可以暂时停留在 beta7 版本
```

<!--END_DOCUSAURUS_CODE_TABS-->
