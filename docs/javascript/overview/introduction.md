---
id: js-introduction
title: 介绍
sidebar_label: 简要
---

白板 sdk 使用 `Typescript` 编写。在部分文档中，会直接解释对应类的 `.d.ts` 中的 API。

## 运行环境

* 软件

sdk 可以运行在任意支持 es5 的现代浏览器中，兼容性支持可以查看 [ECMAScript 5](https://caniuse.com/#feat=es5)。  

* 硬件

sdk 无需任何额外支持，即可运行在 iPad，Surface，Wacom等手写板上。

## 相关 demo

1. [react-whiteboard](https://github.com/netless-io/netless-react-whiteboard)
    * 有部分业务实现代码，阅读对应文档，进行部署即可快速查看集成效果。
1. [white-react-demo](https://github.com/duty-os/white-react-demo)
    * 当遇到 bug 时，推荐使用该 demo 进行最小环境复现，迅速定位问题。
1. [white-demo-web](https://github.com/duty-os/white-demo-web/tree/master/quickStart/2.0)
    * quick-start 中所用 cdn 安装形式的 demo

>提示：
反馈问题时，如果能带上在以上任意的 demo 中复现的代码，能够更快的解决定位问题。


## sdk 版本，及其历史版本

1. [white-web-sdk](https://www.npmjs.com/package/white-web-sdk)
    * 非 React 框架开发
1. [white-react-sdk](https://www.npmjs.com/package/white-react-sdk)
    * React 框架开发（依赖 white-web-sdk，安装时，会自动集成后者，无需重复安装）

### 2.0.0 正式版

### 2.0.0 正式版 - 2019-06-23

正式版与之前beta 版本，API 基本一致。但是不能与低版本sdk 进行互联。可与 Android 2.0.0 正式版，以及 iOS 2.1.0 版本进行互联。

>2019.7 前接入客户，在升级前请联系 SDK 团队，切换服务器配置。