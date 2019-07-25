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

## 相关 demo<span id='demo'>

1. [react-whiteboard](https://github.com/netless-io/netless-react-whiteboard)
    * 有部分业务实现代码，同时有线上已部署 demo。阅读对应文档，进行部署，即可快速查看集成效果。
1. [rtc-react-whiteboard](https://github.com/leavesster/netless-rtc-react-whiteboard)
    * 带有 rtc 业务实现的 demo，同时有线上已部署 demo。阅读对应文档，进行部署，即可快速查看集成效果。
1. [white-react-demo](https://github.com/duty-os/white-react-demo)
    * 当遇到 bug 时，推荐使用该 demo 进行最小环境复现，迅速定位问题。
1. [white-demo-web](https://github.com/duty-os/white-demo-web/tree/master/quickStart/2.0)
    * quick-start 中所用 cdn 安装形式的 demo

>提示：
反馈问题时，如果能带上在以上任意的 demo 中复现的代码，能够更快的解决定位问题。


## sdk

1. [white-web-sdk](https://www.npmjs.com/package/white-web-sdk)
    * 非 React 框架开发
1. [white-react-sdk](https://www.npmjs.com/package/white-react-sdk)
    * React 框架开发（依赖 white-web-sdk，无需重复安装）

`white-web-sdk` 与 `white-react-sdk` 版本一致，每次同时发版。

## 版本更新记录

### 2.2.8 - 2019-07-25

> - 修复了 Windows 上断线重连的缺陷

### 2.2.7 - 2019-07-23

> - 修复了无法断线重连的缺陷
> - 优化了移动端橡皮工具的体验
> - 修复了动态 PPT 排版的若干缺陷

### 2.2.6 - 2019-07-17

> - 修复了动态 PPT 排版渲染上的一些缺陷
> - 修复了加入房间时有时找不到教具的缺陷

### 2.2.5 - 2019-07-12

> - 修复了初始化视角可能失败的缺陷
> - 动态 PPT 修复了一些文字排版的缺陷

### 2.2.4 - 2019-07-06

> - 动态 PPT 支持多媒体播放
> - 动态 PPT 支持更多的动画
> - 动态 PPT 修复了一些图形渲染的缺陷

### 2.2.2 - 2019-07-01

> - 支持选择调整视角的动画模式
> - 支持渲染场景快照

### 2.2.1 - 2019-06-29

> - 支持主动调整视角
> - 支持为动态 PPT 自定义字体文件
> - 支持禁止镜头、禁止设备输入

### 2.0.3 - 2019-06-24

> - 修复：在 beta 版录制的回放时 PPT 的尺寸错误
> - 修复：Preview 的展示区域不会随着屏幕 scale 变化而变化

### 2.0.0 - 2019-06-23

正式版与之前beta 版本，API 基本一致。
但是不能与低版本sdk 进行互联。可与 Android 2.0.0 正式版，以及 iOS 2.1.0 版本进行互联。

>2019.06.24 前接入的客户，在升级至该版本时，请联系 SDK 团队，确认服务器指向版本。
>更多内容，请查看 [2.0.0正式版发布](/blog/2019/06/22/release-note)