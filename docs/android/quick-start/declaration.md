---
id: android-declare
title: 概述
---

熟悉白板的从创建到结束的生命周期，以及事件回调。

## 流程

1. 在 sdk 后台创建账号，并将 SDK 集成到 Android 项目中，在后台获取[APP identitier](/faq/app-identifier)
1. 在 Android 项目中，创建白板实例，初始化 SDK
1. 通过与 sdk 业务服务器通讯，在 sdk 服务器端，创建房间
1. 获得房间 uuid 与 roomToken，调用 sdk 加入房间方法，并传入房间状态回调

## 源码获取

本章节所有代码，均可在[White-demo-android](https://github.com/duty-os/white-demo-android) 中获取。
