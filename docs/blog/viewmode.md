---
id: broadcast
title: Anchor and audience
---

## Brief

This article describes how to achieve: one-to-one, one-to-many (non-interactive) form, the business scenario of anchor to audience

> Before reading this article, please read the "Quick Start" section of each end document to complete the basic access.

## Concept: Perspective Mode <span class = "anchor" id = "viewmode">

First introduce the concept needed to realize the business-** perspective mode **.

There are three perspective modes:

* `Anchor Mode`: Only one user can be in this mode. The users in this mode are hereinafter referred to as`anchor` **.
* `Following mode`: When`anchor` exists in the room, the default state when entering the room; someone in the room switches to `anchor`, others enter this state by default. Users in this mode can be called `Audience` or`Followers`. ** Hereinafter referred to as `followers` **.
* `Free mode`: When there is no`anchor` in the room, the default state when entering the room.

### Anchor Mode

There can be only one anchor in a room; when a new user calls the anchor, the old anchor will also become a follower at the same time.
sdk will ensure that all the screen content of the anchor is completely synchronized to the user (viewer) in the `follow` mode.

> When a user becomes the anchor, the other users' perspective mode in the room will automatically change to the `follow` mode. At this time, new users are added, and the perspective mode is `follow` mode.

### Follow mode

Users in `Follow` mode (hereafter, users in Follow mode will be referred to as viewers) will see all screen contents of users in`Anchor` mode simultaneously.

> When actively setting the `follow` mode, there needs to be a host in the room, otherwise it will automatically switch back to free mode.
> Users in `Follow` mode will automatically switch from`Follow` mode to `Free` mode if they perform any operation (moving the whiteboard, zooming the field of view, teaching tools such as strokes).
If you want to keep the "following" mode, you can call the SDK's "Prohibition Operation API" (for details, see the audience-side business implementation code below) to prevent the whiteboard from responding to user operations.

* Screen

Since the screen (whiteboard) width and height ratios of different users can be inconsistent, in order to ensure that all content on the host can be displayed, SDK will actively zoom in on the viewer (the field of view is synchronized, not the zoom ratio-zoomScale) to ensure the screen Everything in can be seen by viewers.

* The following is an example diagram:

![viewmode-01](/img/viewmode.001.png)
![viewmode-02](/img/viewmode.002.png)

### Free Mode

When the room does not exist, the anchor, everyone has a free perspective. This state does not synchronize the view position, and only synchronizes the content to all users.

> When the user is in the follow mode, any operation (zoom, move, stroke operation) will automatically switch to free view.

## BUSINESS IMPLEMENTATION <span class = "anchor" id = "implement">

On the client side, the developer can distinguish between the anchor and the follower, and can also provide a button function to let users choose to switch.

### Anchor

* Actively set when the anchor user enters the room.
* Recall when the user actively chooses to become the anchor.

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

### Audience

The realization of the viewer service is based on the premise that the user of the anchor mode already exists.

> When the anchor is set on the anchor, other users in the room will switch to follower mode, and the perspective mode of newly added users will also be follower mode.

In the current business scenario (no interaction), viewers are not required to become `free` mode through operation. This is achieved by calling the `Forbidden Operation API` of the whiteboard.

* If the anchor and the viewer are fixed and there is no operation requirement on the viewer, you can call the `Prohibited Operation API` when joining the room *

* Forbidden operation API can be divided into `Prohibited tool operation`,`Forbidden perspective change` (mobile zoom) two APIs, the following is the API documentation link at each end:

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
<br>
[Whiteboard operation -> Disable operation: disableOperations](/docs/javascript/guides/js-operation#disableOperations): This API calls the following two APIs at the same time.
[Tool use -> Disable tool operation: disableDeviceInputs](/docs/javascript/guides/js-tools#disableDeviceInputs) 
[View operation -> Disable view change: disableCameraTransform](/docs/javascript/guides/js-view#disableCameraTransform)
<!--iOS/Objective-C-->
<br>
[Whiteboard operation -> Disable operation: disableOperations](/docs/ios/guides/ios-operation#disableOperations): This API calls the following two APIs at the same time.
[Tool use -> Disable tool operation: disableDeviceInputs](/docs/ios/guides/ios-tools#disableDeviceInputs)
[View operation -> Disable view change: disableCameraTransform](/docs/ios/guides/ios-view#disableCameraTransform)
<!--Android/Java-->
<br>
[Whiteboard operation -> Disable operation: disableOperations](/docs/ios/guides/js-operation#disableOperations): This API calls the following two APIs at the same time.
[Use of teaching aids -> Disable teaching aids operation: disableDeviceInputs](/docs/ios/guides/js-tools#disableDeviceInputs) 
[View operation -> Disable view change: disableCameraTransform](/docs/ios/guides/js-view#disableCameraTransform)
<!--END_DOCUSAURUS_CODE_TABS-->

#### When to call the `Forbidden Operation` API:

1. Actively set when the audience user enters (anchor already exists).
1. When a user becomes the anchor, other users automatically switch to `follow` mode.

> For the latter, please read the `State Management` document on each side. In the callback where the room status changes, call the`Forbidden Operation` API.

<!--DOCUSAURUS_CODE_TABS-->
<!--Web-->
```js
room.disableCameraTransform = true;

// Can be actively set to follow mode again to prevent users from performing operations in the middle and switch to free mode
//typescript
room.setViewMode(ViewMode.Follower);
//javascript
room.setViewMode("follower");
```
<!--iOS/Objective-C-->
```Objective-C
[room disableCameraTransform:YES];

// Can be actively set to follow mode again to prevent users from performing operations in the middle and switch to free mode
[room setViewMode:WhiteViewModeFollower];
```
<!--Android/Java-->
```Java
room.disableCameraTransform(true);

// Can be actively set to follow mode again to prevent users from performing operations in the middle and switch to free mode
room.setViewMode(ViewMode.Follower);
```
<!--END_DOCUSAURUS_CODE_TABS-->
