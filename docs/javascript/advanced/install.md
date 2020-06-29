---
id: install
title: 安装
---

本章将介绍若干种安装 White SDK 的方法。你可以根据自己团队的技术栈来选择适合的方法。

## 安装 White SDK

可以用包管理工具（如 npm 和 yarn）来安装 White SDK，或者直接引入 JS 文件。

### 使用 npm 或 yarn 来安装

npm 和 yarn 是 JavaScript 社区知名的包管理工具。如果你的刚好使用了它们之一，就可以直接用它们来安装 White SDK。如果你不知道什么是包管理工具，可以先阅读下面这两篇文章。

* [《About npm》](https://docs.npmjs.com/about-npm/)
* [《Introducation \| yarn》](https://yarnpkg.com/getting-started)

使用如下命令安装 `white-web-sdk`。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```bash
npm install white-web-sdk
```

<!--yarn-->

```bash
yarn add white-web-sdk
```startå
```

<!--END_DOCUSAURUS_CODE_TABS-->

如果你用 React 开发 Web 应用，可以安装 `white-react-sdk`。该库是 `white-web-sdk` 的超集，既提供了可供 React 直接使用的组件，又可以完全代替 `white-web-sdk`。

### 直接引入 JS 来安装

你可能决定不用任何包管理工具来安装。比如，为了减少 JS 文件的大小，以优化页面加载速度，决定仅在需要使用白板的页面中使用 White SDK。那么，也可以通过在 `<head>` 中直接引入 JS 文件的 URL 来安装 White SDK。

在的 `html` 文件中的 `<head>` 中插入如下代码即可。

```markup
<head>
    <script src="https://sdk.herewhite.com/white-web-sdk/2.9.0.js"></script>
</head>
```

## 在项目中引入 White SDK

如果用了 `webpack` 之类的打包工具，并用 npm、yarn 之类的包管理工具安装 White SDK，就可以通过如下方式引入项目。

在进阶教程接之后的内容中，我们将默认你用这种方式来引入项目。

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
var WhiteWebSdk = require("white-web-sdk");
```

<!--ES 6-->

```typescript
import WhiteWebSdk from "white-web-sdk";
```

<!--TypeScript-->

```typescript
import * as WhiteWebSdk from "white-web-sdk";
```

<!--END_DOCUSAURUS_CODE_TABS-->

如果用了在 `<head>` 中直接引用 JS 文件的 URL 的方式来安装 White SDK，则可以用如下代码取到名为 `WhiteWebSdk` 的全局变量。

```javascript
var WhiteWebSdk = window.WhiteWebSdk;
```

> `<script>` 标签在 `<head>` 中的排列顺序很重要。请确保 `white-web-sdk`的 JS 文件在你的业务代码的 JS 文件之前。只有这样，业务代码才能顺利获取全局变量 `WhiteWebSdk`。

## 使用枚举类型

White SDK 的 API 普遍用到枚举类型。例如，你可以通过如下代码引用 `RoomPhase` 这个枚举类型。

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
var RoomPhase = require("white-web-sdk").RoomPhase;
console.log(RoomPhase.Connected);
```
<!--ES 6-->

```javascript
import { RoomPhase } from "white-web-sdk";
console.log(RoomPhase.Connected);
```

<!--TypeScript-->

```typescript
import { RoomPhase } from "white-web-sdk";
console.log(RoomPhase.Connected);
```

<!--END_DOCUSAURUS_CODE_TABS-->

`white-web-sdk` 中，所有枚举类型本质上是 `string` 。举个例子，`RoomPhase.Connected` 的值就是字符串 `"connected"`。这个例子可以推而广之，其实所有枚举类型都可以用它的小驼峰命名法的字符串代替。

> 如果不了解小驼峰命名法则，可以先阅读[《驼峰式大小写](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)》。

我们建议不要用字符串代替枚举。这种方式开发难度很高，如果不小心拼错了单词，出了 bug，也很难定位。使用枚举的话，IDE 和编译器可以直接拦截掉拼写错误。

> 如果用在 `<head>` 中插入 `<script>` 的方式来安装 White SDK，则无法使用枚举类型。此时，你不得不用字符串代替枚举类型。
