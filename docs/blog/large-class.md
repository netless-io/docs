---
id: large-class
title: 如何使用大课模式
---

## 1. 只读模式和互动模式的设计区别

### 1.1 互动模式设计架构

![isWritable_true](/img/isWritable_true.png)

- 优势说明：
  - 通过 netless 链路加速网络和核心机房直连，延时低互动性能好。
  - 每个客户端具对等的功能，可以收发全部消息，使用全部的 api。
- 问题说明：
  - 核心 room 直连的房间路数有限，到达上限后性能会有单点性能问题。
  - netless 链路加速网络成本较高。

### 1.2 只读模式设计架构

![isWritable_false](/img/isWritable_false.png)

- 优势说明：
  - 订阅路数只和 getway 集群规模相关，去除单点问题可以承载超大课堂。
  - 使用公有云的长连接加速链路，资费成本更低。
- 问题说明：
  - 延时会相应增大。
  - 订阅客户不具备向服务器写的功能，sdk 的核心方法基本都不能调用，只能订阅观看。

## 2. 如何选择启用哪种模式

- 1 对 1 & 50 人以内的小班推荐使用互动模式。
- 50 人以上大班课 & 不限制人数的公开课推荐使用只读模式。
- 只读模式理论上不限制人数上限，课程规模确实比较大可以联系我们先沟通。

## 3. 代码上需要怎么实现

- [web 具体代码实现](/docs/javascript/features/js-readonly)
- [iOS 具体代码实现](/docs/ios/guides/ios-readonly/)
- [Android 代码实现](/docs/android/guides/android-readonly/)
