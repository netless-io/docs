---
id: mini-introduction
title: 简要说明
sidebar_label: 简要说明
---

## 运行环境

微信小程序，采用 Webview 技术进行集成，效果如下：

![mini-finally](/screenshot/mini-finally.png)

## 相关 repo

1. [netless-mini-whiteboard](https://github.com/netless-io/netless-mini-whiteboard)
    * 微信小程序集成 Demo



## Changelog

### 2.2.12 - 2019-08-15

> - 修复了动态 PPT 的若干缺陷

### 2.2.11 - 2019-08-06

> - 修复了缺陷：房间有主播时，新进房间的用户的白板看不到任何东西
> - 修复了白板排版的缺陷

### 2.2.10 - 2019-08-02

> - 优化了重连的逻辑

### 2.2.9 - 2019-07-30

> - 修复了多人同时进入房间时，一定几率无法加入房间的缺陷

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