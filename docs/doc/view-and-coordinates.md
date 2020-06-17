---
id: view-and-coordinates
title: 视角与坐标
---

老师和学生的会用各种各样不同屏幕尺寸的设备来使用白板，最怕出现的问题是由于屏幕的大小比例不一样，导致相互看到的内容不一样，那么教学就很难进行下去。这篇文章我们会详细说明一下如何通过白板的几个 API 来完成这个设置。

## 什么是视角跟随和视觉矩形

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/visual-rectangle.mp4">
</video>

* 前半段演示中，老师端的怎么移动的时候学生会跟着移动。这个概念就是**视角跟随**。
* 后半段演示中，老师端和学生端虽然比例不一样、大小不一样但是蓝框都能显示完整，因为跟随状态下，学生一定会议最大的程度显示老师端的全部内容。概念就是**视觉矩形。**

## 怎么使用这些功能呢

注意理解以下代码。

```javascript
room.setViewMode(ViewMode.Follower); // 调用者去跟随设置为 Broadcaster 的用户
room.setViewMode(ViewMode.Broadcaster); // 调用者让其他用户跟随自己
room.setViewMode(ViewMode.Freedom); // 调用者不跟随任何人，视角处于自由模式
room.disableCameraTransform = true // 调用者被禁止移动视角，往往是学生
room.disableCameraTransform = false // 调用者被允许移动视角，往往是老师
```

推荐用法。

```javascript
room.setViewMode(ViewMode.Follower); // 学生跟随老师
room.setViewMode(ViewMode.Broadcaster); // 老师设置为主播
room.disableCameraTransform = true // 学生禁止 zoom 改变视角
room.disableCameraTransform = false // 老师允许 zoom 改变视角
```

这样学生就不会跟随老师失败，一直保证白板画面一致。

## 概念介绍：视角模式

首先介绍实现该业务所需要了解的概念——**视角模式**。

视角模式一共有三种：

* `主播模式`：只能有一个用户为该模式，该模式下的用户，**以下简称为`主播`**。
* `跟随模式`：房间中存在`主播`时，进入房间时的默认状态；房间中有人切换为`主播`，其他人默认进入该状态。该模式下的用户，可以称之为`观众`或`跟随者`。**以下简称为`跟随者`**。
* `自由模式`：房间中无`主播`时，进入房间时的默认状态。

### 主播模式

该模式为抢占式，后来者可以挤掉已经成为`主播模式`的用户。需要开发者手动维护权限列表。

sdk 会将`主播`端用户的屏幕内容，整个同步给所有`跟随者`。

### 跟随模式

由于屏幕比例不同，`跟随者`可能会看到比`主播`更多的内容。

> 主动设置`跟随`模式时，需要房间中存在主播，否则不会生效。
> 在`跟随者`，如果主动改变了自己的视角（双指缩放、移动白板），`视角模式`都会自动从`跟随模式`切换到`自由模式`。  
> 如果想要一直保持`跟随模式`，可以调用 sdk 的`禁止视角移动API`（具体见下文观众端业务实现代码），禁用用户调整视野。

### 主播与跟随者视野区别

由于不同用户的屏幕（白板）宽高比例不一定一致，SDK 为了保证能够完整显示`主播`屏幕内的内容，会主动对`跟随者`的白板，进行缩放（同步的是视野，而非缩放比例——zoomScale）。

* 以下为示例图：

![viewmode.001](/img/viewmode.001.png)

![viewmode.001](/img/viewmode.002.png)

### 自由模式

当房间不存在`主播`时，所有都为`自由模式`。  
该状态不同步`视野内容`，只会将内容同步给所有用户。

## 业务实现

开发者在客户端，自行区分`主播`与`跟随者`，也可以提供按钮功能，让用户主动切换。

### 主播

* 在主播用户进入房间时，主动设置。
* 在用户主动选择成为主播时，再进行调用。

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
import { ViewMode } from "white-web-sdk";

room.setViewMode(ViewMode.Broadcaster);
```

<!--Objectivec-->

```OC
[room setViewMode:WhiteViewModeBroadcaster];
```

<!--Java-->
```Java
room.setViewMode(ViewMode.Broadcaster);
```
<!--END_DOCUSAURUS_CODE_TABS-->

### 跟随者

观众端业务实现，是基于`主播`模式用户已存在的前提。如需要观众通过操作变成`自由`模式。这里通过调用白板的`禁止视角变化`来达到目的。

如果主播与观众端固定不变，且观众端无操作需求（无互动），可以在加入房间时就调用`禁止操作API`。（也可以在加入房间时，直接配置参数）。

* 禁止操作 API，为`禁止教具操作`，`禁止视角变化`（移动缩放）两个 API 的集合，以下为各端 API 文档链接。

**调用 禁止视角变化API 时机：**

1. 在观众端用户进入时主动设置（主播已存在）。
2. 当有用户成为主播，其他用户自动切换为`跟随`模式。
