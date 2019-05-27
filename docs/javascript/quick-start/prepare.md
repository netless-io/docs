---
id: js-prepare
title: 集成客户端
sidebar_label: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。


## 1. 获取 sdkToken

阅读 [接入准备](/blog/2019/05/02/first-step)，注册账号，获取 sdk token。

## 2. 添加 SDK 到项目中

<!--DOCUSAURUS_CODE_TABS-->
<!--CDN 安装-->

### 2.1 在 `<head>` 引入 css 和 js 文件

```html
    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" href="https://sdk.herewhite.com/white-web-sdk/2.0.0-beta.7.css">
            <script src="https://sdk.herewhite.com/white-web-sdk/2.0.0-beta.7.js"></script>
            <script src="index.js"></script>
        </head>
        <body>
            <div id="whiteboard" style="width: 100%; height: 100vh;"></div>
        </body>
    </html>
```
<!--包管理工具安装-->

### 2.1 使用 npm 管理

```bash
    npm install white-web-sdk --save
```

### 2.2 使用 yarn 管理

```bash
    yarn add white-web-sdk
```

<!--END_DOCUSAURUS_CODE_TABS-->
