---
id: js-introduction
title: 使用须知
sidebar_label:
---

白板 sdk 使用 `Typescript` 编写。在部分文档中，会直接解释对应类的 `.d.ts` 中的 API。

## ts 语法提示<span class="anchor" id="declare">

使用 Typescript 开发时，在项目`tsconfig.json`中添加以下配置，即可获得语法提示。

```json
"compilerOptions": {
    "paths": {
        "*" : ["node_modules/white-web-sdk/types/*"]
    }
}
```

## 运行环境<span class="anchor" id="env">

* 软件

sdk 可以运行在任意支持 es5 的现代浏览器中，兼容性支持可以查看 [ECMAScript 5](https://caniuse.com/#feat=es5)。

* 硬件

sdk 无需任何额外支持，即可运行在 iPad，Surface，Wacom等手写板上。

## 开源代码<span class="anchor" id="demo">

1. [netless-rtc-react-whiteboard](https://github.com/leavesster/netless-rtc-react-whiteboard)
    * 带有 rtc 业务实现的 demo，同时有线上已部署 demo。阅读对应文档，进行部署，即可快速查看集成效果。
2. [white-react-demo](https://github.com/duty-os/white-react-demo)
    * 当遇到 bug 时，推荐使用该 demo 进行最小环境复现，迅速定位问题。
3. [white-demo-web](https://github.com/duty-os/white-demo-web/tree/master/quickStart/2.0)
    * quick-start 中所用 cdn 安装形式的 demo
4. [netless-react-whiteboard](https://github.com/netless-io/netless-react-whiteboard)
    * 有部分业务实现代码，同时有线上已部署 demo。阅读对应文档，进行部署，即可快速查看集成效果。

>提示：
反馈问题时，如果能带上在以上任意的 demo 中复现的代码，能够更快的解决定位问题。


## SDK地址<span class="anchor" id="sdk">

1. [white-web-sdk](https://www.npmjs.com/package/white-web-sdk)
    * 非 React 框架开发
1. [white-react-sdk](https://www.npmjs.com/package/white-react-sdk)
    * React 框架开发（依赖 white-web-sdk，无需重复安装）

`white-web-sdk` 与 `white-react-sdk` 版本一致，每次同时发版。
