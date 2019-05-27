---
id: js-declare
title: 概述
---

本章节中 demo，可在 [简要](../overview/introduction.md) 中查看。

## 本章目的

熟悉白板的从创建到结束的声明周期。

## 流程

1. 创建项目集成 SDK。
4. 初始化 SDK，使用 sdk token 向服务器请求，创建房间或者获取特定房间的 room token，调用 `jionRoom` 传入 uuid，room token，及房间状态变化回调。
6. 调用 `disconnect` ，退出房间。