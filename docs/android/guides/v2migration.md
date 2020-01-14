---
id: android-v2migration
title: 2.0 v2migration
---

## new features:

1. Cloud recording: When creating a room, select the replayable room, and the SDK server will automatically record in the cloud
1. Playback function: Provide playback API
1. Whiteboard page management function

v2.0 Attention:

> v1.0 and v2.0 rooms are not interoperable; however, the token used by the SDK does not need to be updated.
v2.0 has removed some APIs. You need to implement the new APIs through the following documents.

* We will not shut down v1.0 services, but we still recommend that you migrate to v2.0. *

### New Concept-Scene

First of all, in order to enhance the page management function of the whiteboard, we introduce some new concepts: scenes and scene directories.
If you don't understand the concept of scene, we suggest you refer to the concept of explorer and file for reference.

Scenes currently include: scene name, PPT (background image), PPT width, PPT height content.
There is also something related to the scene, not held by the scene itself: the scene path. The scene path is the scene directory scene name, which is held by the scene itself.

The scene directory is the directory where the files are located. (The scene directory in the SDK, the format reference is the file format under the Unix system. `\Dir1\dir`)

> Recommended reading [Scene Management](./scenes.md) 

## Modified API

The 2.0 API changes are mainly in the scene. In order to support more complex page management requirements, we abandoned the past. Whiteboards are in the form of a series of page arrays. Instead, use Explorer to manage it.

### PPT API

#### Get ppt API

We still provide the Get ppt API, but we no longer recommend this API. Because even if you get the ppt address, you cannot manage the page through the index of the ppt address. Therefore, we recommend using the following methods to get the content of the current page:

```Java
// Return all scenes in the current scene directory. The ppt attribute may be empty.
public Scene[] getScenes();

// In the obtained WhiteSceneState, there is a current scene directory, a list of all scenes under the scene directory, and an index of the current scene in the scene list.
public SceneState getSceneState();
```

Currently, you need to manage the scene catalog yourself. If you don't need multiple scene lists (multidimensional arrays). I recommend that you use a fixed scene directory (eg "\").

#### Insert PPT API

Old method:

```Java
public void pushPptPages(PptPage[] pages)
```

New func：

```Java

 /**
 Insert, maybe create multiple pages

 @param dir scence page group name, equivalent to a directory.
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can pass in NSUIntegerMax.
 */
public void putScenes(String dir, Scene[] scenes, int index)
```

### Page Management API

#### Delete Page API

Old method:

```Java
public void removePage(int index)
```

新方法：

```Java
 /**
 When there is
 /ppt/page0
 /ppt/page1
 When "/ppt/page0" is passed in, only the corresponding page is deleted.
 Passing "/ppt" removes both pages together.

 @param dirOrPath Page specific path, or page group path
 */
public void removeScenes(String dirOrPath)
```

Delete now, no longer accept the index index, correspondingly, the path or directory of the scene is accepted.

#### Insert Page API

```Java
/**
Insert, maybe create multiple pages

 @param dir scence page group name, equivalent to a directory.
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can pass in NSUIntegerMax.
 */
public void putScenes(String dir, Scene[] scenes, int index)
```

Now insert page API, add interface for custom content (ppt) when inserting. So the Insert Page API and Insert PPT API have now been merged into the same API.

* We now provide a new API to support mobile, rename whiteboard pages *

### Image Replacement API

Since the image replacement API takes effect on the interactive room and playback at the same time, we have migrated this setting to WhiteSdkConfig, which needs to be set when the WhiteSDK is initialized.

```Java
WhiteSdkConfiguration sdkConfig = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
// You must set the replacement when sdk is initialized
sdkConfig.setHasUrlInterrupterAPI(true);

// Initialize a class that implements the UrlInterrupter interface as the WhiteSDK initialization parameter.
UrlInterrupterObject interrupter = new UrlInterrupterObject()
WhiteSdk whiteSdk = new WhiteSdk(whiteBroadView PlayActivity.this, interrupter);
```