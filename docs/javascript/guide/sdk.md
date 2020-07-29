---
id: js-sdk
title: SDK集成
---

## SDK项目

1. [white-web-sdk](https://www.npmjs.com/package/white-web-sdk)
    * 非 React 框架开发推荐使用
1. [white-react-sdk](https://www.npmjs.com/package/white-react-sdk)
    * React 框架开发（依赖 white-web-sdk，无需重复安装）

`white-web-sdk`与`white-react-sdk`版本一致，每次同时发版。

## 集成方式

获取app-identifier，具体请查看：[查看 APP identitier](/blog/app-identifier)

### 1. 包管理工具集成

<!--DOCUSAURUS_CODE_TABS-->
<!--使用 js sdk 开发-->
添加依赖：

```shell
# yarn
yarn add white-web-sdk
# npm
npm install white-web-sdk --save
```

代码：

```javascript
import {WhiteWebSdk} from 'white-web-sdk';
```

<!--使用 react-sdk开发-->
添加依赖：

```shell
# yarn
yarn add white-react-sdk
# npm
npm install white-react-sdk --save
```

代码：

```javascript
import * as React from "react";
import {Room, RoomPhase, RoomWhiteboard, WhiteWebSdk} from "white-react-sdk";
```

<!--END_DOCUSAURUS_CODE_TABS-->

### 2. script 标签集成

```html
<script src="https://sdk.herewhite.com/white-web-sdk/2.8.0.js"></script>
<script>
    //全局变量 WhiteWebSdk
    let sdk = new WhiteWebSdk({appIdentifier: "{{appIdentifier}}"});
</script>
```

## TypeScript 支持

使用`TypeScript`开发时，在项目`tsconfig.json`中添加以下配置，即可获得语法提示。

```json
{
    "compilerOptions": {
        "skipLibCheck": true,
        "paths": {
            "*" : ["node_modules/white-web-sdk/types/*"]
        }
    }
}
```

## 推荐阅读

1. [开源项目](./open-source.md)