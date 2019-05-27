---
id: js-declare
title: 目标和流程
---

## 目标

熟悉白板的从创建到结束的声明周期

## 流程

1. 创建项目集成 SDK。
2. 在服务器创建一个房间，获得房间的唯一识别标志 `uuid`。
3. 通过 `sdkToken` 和 `uuid`，换取具有进入此房间的秘钥  `roomToken`。
4. 初始化 SDK，调用加入成员方法 `jionRoom` 进入房间。
5. 监听到进入房间成功后渲染出白板.
6. 调用 `disconnect()` 房间结束
