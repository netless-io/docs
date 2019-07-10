---
id: android-introduction
title: 简要说明
sidebar_label: 简要说明
---

依赖库：DSBridge-Android, gson

版本：
Android SDK API Level Level: ≥ 19  
API 19 (Android 4.4) – Kitkat, released October 2013

相关 repo:

1. [Android-demo](https://github.com/duty-os/white-demo-android)

## SDK 版本列表

[最新版本列表——发版自动更新](https://jitpack.io/#duty-os/white-sdk-android)

### [2.3.2] - 2019-07-09
- 更新视角移动，视觉矩形移动 API参数类型
- 优化动态 PPT

### [2.3.0] - 2019-07-04
- 增加截图 API
- 增加根据 index 切换场景 API

### [2.2.1] - 2019-07-04
- 修复 PPT 转换工具初始化错误

### [2.2.0] - 2019-07-02
- 添加 PPT 转换支持
- 添加动态 PPT 控制API
- 添加视角移动，视角调整 API

### [2.0.4] - 2019-06-24
- 恢复只读 API（后续将拆分为两个 API）
### [2.0.3] - 2019-06-24
- 兼容旧版本静态 ppt 回放

### [2.0.0] - 2019-06-23

#### 兼容性变化
与之前版本 API 兼容，但是无法与低版本互连，进入同一房间。
可以与 iOS 2.1.0，web 2.0.0 正式版互连，无法与 iOS 2.1.0 以下版本，以及 web 2.0.0-beta 开头的版本互连。

>2019.06.24 前接入的客户，在升级至该版本时，请联系 SDK 团队，确认服务器指向版本。  
>更多内容，请查看 [2.0.0正式版发布](/blog/2019/06/22/release-note)