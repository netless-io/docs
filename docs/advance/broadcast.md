---
id: advance-broadcast
title: 主播与观众
---

## 目的

本文介绍如何实现： 一对一，一对多无互动，主播对观众的业务场景。

在开始阅读本文前，请先完成各个端，quick-start 部分，完成 sdk 集成接入部分。

## 前置内容：视角模式

视角模式一共有三种：主播，跟随，自由（默认）

### 主播视角

房间中只有一个主播，当一个用户调用 API，成为主播后。其他用户，会自动变成跟随模式（观众）。

### 跟随模式（观众）

sdk 会保证主播端的视角内容，会完整的同步给观众。  
主播模式中，主播所看到的内容，会全部同步到跟随模式用户。但是由于跟随模式的用户，屏幕比例可能与主播不一致。为了完全显示主播端的内容，sdk 会主动进行缩放调整，保证主播所看到的内容，能够充分显示。

* 效果图：

![perspective](/screenshot/perspective.jpeg)

### 自由视角

1. 默认即为自由视角。
1. 当用户处于跟随端，进行移动，缩放等操作时，该用户会自动切换成自由视角。

目前，如果想保持跟随模式，需要主动调用 sdk 的只读 API，禁止用户对白板的操作响应。

## 实现步骤

开发者在客户端，区分主播端与跟随端。

### 主播端实现

在主播用户进入时，执行设置主播 API

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
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

### 跟随端实现

在主播端设置主播时，所有用户会自动成为观众。  
但是这里，我们需要保证观众无法主动变成自由模式，我们需要手动设置禁止白板响应用户操作。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
//只读，再设置为跟随
room.disableOperations = true;
room.setViewMode(ViewMode.Follower);
```
<!--iOS/Objective-C-->
```Objective-C
//只读，再设置为跟随
[room disableOperations:YES];
[room setViewMode:WhiteViewModeFollower];
```

<!--Android/Java-->
```Java
//只读，再设置为跟随
room.disableOperations(true);
room.setViewMode(ViewMode.Follower);
```

<!--END_DOCUSAURUS_CODE_TABS-->