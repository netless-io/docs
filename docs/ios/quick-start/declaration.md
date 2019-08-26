---
id: ios-declare
title: 概述
---

通过本章教程，熟悉白板的从创建到结束的生命周期，以及事件回调。

## 流程

1. 在 sdk 后台创建账号，并将 SDK 集成如 iOS 项目中
1. 在 iOS 项目中，创建白板实例，初始化 SDK
1. 与 sdk 服务器通讯，通过 sdk token 通过鉴权，创建房间获取房间 uuid 与 roomToken，或者直接查询特定房间 uuid 的 room token。
1. 调用 sdk 加入房间方法，传入 uuid 以及 room token。
1. 实现白板房间状态回调协议

## Demo

demo 地址： [White-sdk-ios-release](https://github.com/duty-os/white-sdk-ios-release) 中获取。
