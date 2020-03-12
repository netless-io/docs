---
id: viewmode
title: 视角模式-主播与跟随者
---

## 简要

本文介绍如何实现：一对多形式，主播对观众的业务场景。

>阅读本文前，请先阅读各端文档中`快速开始`部分，完成基础接入。

## 概念介绍：视角模式<span class="anchor" id="viewmode">

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

>主动设置`跟随`模式时，需要房间中存在主播，否则不会生效。

>在`跟随者`，如果主动改变了自己的视角（双指缩放、移动白板），`视角模式`都会自动从`跟随模式`切换到`自由模式`。  
如果想要一直保持`跟随模式`，可以调用 sdk 的`禁止视角移动API`（具体见下文观众端业务实现代码），禁用用户调整视野。

### 主播与跟随者视野区别

由于不同用户的屏幕（白板）宽高比例不一定一致，SDK 为了保证能够完整显示`主播`屏幕内的内容，会主动对`跟随者`的白板，进行缩放（同步的是视野，而非缩放比例——zoomScale）。

* 以下为示例图：

![viewmode-01](/img/viewmode.001.png)
![viewmode-02](/img/viewmode.002.png)

### 自由模式

当房间不存在`主播`时，所有都为`自由模式`。  
该状态不同步`视野内容`，只会将内容同步给所有用户。

## 业务实现<span class="anchor" id="implement">

开发者在客户端，自行区分`主播`与`跟随者`，也可以提供按钮功能，让用户主动切换。

### 主播

* 在主播用户进入房间时，主动设置。
* 在用户主动选择成为主播时，再进行调用。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web-->
```typescript
//Javascript 
room.setViewMode("broadcaster");
//Typescript
room.setViewMode(ViewMode.Broadcaster);
```
<!--iOS/Objective-C-->
```Objective-C
[room setViewMode:WhiteViewModeBroadcaster];
```
<!--Android/Java-->
```Java
room.setViewMode(ViewMode.Broadcaster);
```

<!--END_DOCUSAURUS_CODE_TABS-->

### 跟随者

>观众端业务实现，是基于`主播`模式用户已存在的前提。

>如需要观众通过操作变成`自由`模式。这里通过调用白板的`禁止视角变化`来达到目的。  

如果主播与观众端固定不变，且观众端无操作需求（无互动），可以在加入房间时就调用`禁止操作API`。（也可以在加入房间时，直接配置参数）。

* 禁止操作 API，为`禁止教具操作`，`禁止视角变化`（移动缩放）两个 API 的集合，以下为各端 API 文档链接：

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
[白板操作-禁止操作:disableOperations](/docs/javascript/guides/js-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/javascript/guides/js-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/javascript/guides/js-view#disableCameraTransform)
<!--iOS/Objective-C-->
[白板操作-禁止操作:disableOperations](/docs/ios/guides/ios-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/ios/guides/ios-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/ios/guides/ios-view#disableCameraTransform)
<!--Android/Java-->
[白板操作-禁止操作:disableOperations](/docs/ios/guides/js-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/ios/guides/js-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/ios/guides/js-view#disableCameraTransform)
<!--END_DOCUSAURUS_CODE_TABS-->

#### 调用 `禁止视角变化`API 时机：

1. 在观众端用户进入时主动设置（主播已存在）。
1. 当有用户成为主播，其他用户自动切换为`跟随`模式。

>后者请阅读各端`视角操作`文档，在房间状态发生改变的回调中，调用`禁止视角变化`API。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web-->
```js
room.disableCameraTransform = true;

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
//typescript
room.setViewMode(ViewMode.Follower);
//javascript
room.setViewMode("follower");
```
<!--iOS/Objective-C-->
```Objective-C
[room disableCameraTransform:YES];

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
[room setViewMode:WhiteViewModeFollower];
```
<!--Android/Java-->
```Java
room.disableCameraTransform(true);

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
room.setViewMode(ViewMode.Follower);
```
<!--END_DOCUSAURUS_CODE_TABS-->
