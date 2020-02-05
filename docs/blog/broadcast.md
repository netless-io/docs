---
id: broadcast
title: 主播与观众
---

## 简要

本文介绍如何实现： 一对一，一对多（无互动）形式，主播对观众的业务场景。

>阅读本文前，请先阅读各端文档中`快速开始`部分，完成基础接入。

## 概念介绍：视角模式<span class="anchor" id="viewmode">

首先介绍实现该业务所需要了解的概念——**视角模式**。

视角模式一共有三种：`主播`，`跟随`，`自由`。

### 主播模式

一个房间，只能有一个主播；当新用户调用主播时，旧主播也会同时变为跟随者。  
sdk 会保证主播端所有的屏幕内容，都完整的同步给`跟随`模式下的用户（观众）。

>当有用户成为主播时，房间其他用户视角模式，都会自动变成`跟随`模式。此时，新加入用户，视角模式均为`跟随`模式。

### 跟随模式

`跟随`模式的用户（以下将跟随模式下的用户称为观众），会同步看到`主播`模式用户的所有屏幕内容。  

>主动设置`跟随`模式时，需要房间中存在主播，否则会自动切换回自由模式。

>在`跟随`模式下的用户，如果进行了任意操作（移动白板，缩放视野，进行笔画等教具操作），都会自动从`跟随`模式切换到`自由`模式。  
如果想要一直保持`跟随`模式，可以调用 sdk 的`禁止操作API`（具体见下文观众端业务实现代码），禁止白板响应用户操作。
 
* 屏幕

由于不同用户的屏幕（白板）宽高比例可以不一致，所以为了保证能够显示主播端的所有内容，sdk 会在观众端主动进行缩放（同步的是视野，而非缩放比例——zoomScale），保证主播屏幕中的所有内容都能被观众看到。

![perspective](/screenshot/perspective.jpeg)

### 自由模式

当房间不存在时主播，所有人均为自由视角。该状态不同步视野位置，只会将内容同步给所有用户。

>当用户处于跟随模式时，进行任何操作（缩放，移动，笔画操作），都会自动切换成自由视角。  

## 业务实现<span class="anchor" id="implement">

开发者在客户端，自行区分主播端与跟随端，也可以提供按钮功能，让用户选择切换。

### 主播端

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

### 观众端

观众端业务实现，是基于`主播`模式用户已存在的前提。

>在主播端设置主播时，房间中其他用户，都会切换为跟随者模式，新加入用户的视角模式，也会是跟随者模式。

在当前业务场景（无互动）中，不需要观众通过操作变成`自由`模式。这里通过调用白板的`禁止操作API`来达到目的。  
*如果主播与观众端固定不变，且观众端无操作需求，可以在加入房间时就调用`禁止操作API`*

* 禁止操作 API，可以分为`禁止教具操作`，`禁止视角变化`（移动缩放）两个 API，以下为各端 API 文档链接：

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
<br>
[白板操作-禁止操作:disableOperations](/docs/javascript/guides/js-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/javascript/guides/js-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/javascript/guides/js-view#disableCameraTransform)
<!--iOS/Objective-C-->
<br>
[白板操作-禁止操作:disableOperations](/docs/ios/guides/ios-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/ios/guides/ios-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/ios/guides/ios-view#disableCameraTransform)
<!--Android/Java-->
<br>
[白板操作-禁止操作:disableOperations](/docs/ios/guides/js-operation#disableOperations)：该 API 同时调用了以下两个 API。  
[教具使用-禁止教具操作:disableDeviceInputs](/docs/ios/guides/js-tools#disableDeviceInputs)  
[视角操作-禁止视角变化:disableCameraTransform](/docs/ios/guides/js-view#disableCameraTransform)
<!--END_DOCUSAURUS_CODE_TABS-->

#### 调用 `禁止操作`API 时机：

1. 在观众端用户进入时主动设置（主播已存在）。
1. 当有用户成为主播，其他用户自动切换为`跟随`模式。

>后者请阅读各端`状态管理`文档，在房间状态发生改变的回调中，调用`禁止操作`API。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web-->
```js
room.disableOperations = true;

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
//typescript
room.setViewMode(ViewMode.Follower);
//javascript
room.setViewMode("follower");
```
<!--iOS/Objective-C-->
```Objective-C
[room disableOperations:YES];

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
[room setViewMode:WhiteViewModeFollower];
```
<!--Android/Java-->
```Java
room.disableOperations(true);

//可以再次主动设置为跟随模式，防止用户中间进行过操作，切换成了自由模式
room.setViewMode(ViewMode.Follower);
```
<!--END_DOCUSAURUS_CODE_TABS-->
