---
id: ios-v2migration
title: 2.0 v2migration
---

## new features:

1. Cloud recording: When creating a room, select the replayable room, and the SDK server will automatically record in the cloud
2. Playback function: Provide playback API
3. Whiteboard page management function


> v1.0 and v2.0 rooms are not interoperable; however, the token used by the SDK does not need to be updated.
v2.0 has removed some APIs. You need to implement the new APIs through the following documents.

* We will not shut down v1.0 services, but we still recommend that you migrate to v2.0. *

## New concept: scene

First of all, in order to enhance the page management function of the whiteboard, we introduce some new concepts: scenes and scene directories.
If you don't understand the concept of scene, we suggest you refer to the concept of explorer and file for reference.

Scenes currently include: scene name, PPT (background image), PPT width, PPT height content.
There is also something related to the scene, not held by the scene itself: the scene path. The scene path is the scene directory scene name, which is held by the scene itself.

The scene directory is the directory where the files are located. (The scene directory in the SDK, the format reference is the file format under the Unix system. `\Dir1\dir`)

> Recommended reading [Scene Management] (./scenes.md)

## Modified API

The 2.0 API changes are mainly in the scene. In order to support more complex page management requirements, we abandoned the past. Whiteboards are in the form of a series of page arrays. Instead, use Explorer to manage it.

### PPT API

#### Get ppt API

We still provide the Get ppt API, but we no longer recommend this API. Because even if you get the ppt address, you cannot manage the page through the index of the ppt address. Therefore, we recommend using the following methods to get the content of the current page:

```Objective-C
// Return all scenes in the current scene directory. The ppt attribute may be empty.
[whiteRoom getScenesWithResult:^(NSArray<WhiteScene *> * _Nonnull scenes) {
    for (WhiteScene *s in scenes) {
        NSLog(@"ppt:%@", s.ppt.src);
    }
}];

// In the obtained WhiteSceneState, there is a current scene directory, a list of all scenes under the scene directory, and an index of the current scene in the scene list.
[whiteRoom getSceneStateWithResult:^(WhiteSceneState * _Nonnull state) {
    NSLog(@"sceneState:%@", state);
}];
```

Currently, you need to manage the scene catalog yourself. If you don't need multiple scene lists (multidimensional arrays). I recommend that you use a fixed scene directory (eg "\").

#### Insert PPT API

Old function:

```Objective-C
- (void)pushPptPages:(NSArray<WhitePptPage *>*)pptPages;
```

New function:

```Objective-C
/**
 Insert, maybe create multiple pages

 @param dir scence page group name, equivalent to a directory.
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can pass in NSUIntegerMax.
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
```

### Page Management API

#### Delete Page API

Old function:

```Objective-C
- (void)removePage:(NSInteger)page;
```

New function:

```Objective-C
/**
When there is
 /ppt/page0
 /ppt/page1
 When "/ppt/page0" is passed in, only the corresponding page is deleted.
 Passing "/ppt" removes both pages together.

 @param dirOrPath Page specific path, or page group path
 */
- (void)removeScenes:(NSString *)dirOrPath;
```

Delete now, no longer accept the index index, correspondingly, the path or directory of the scene is accepted.

#### Insert Page API

```Objective-C
/**
 Insert, maybe create multiple pages

 @param dir scence page group name, equivalent to a directory.
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can    pass in NSUIntegerMax.
 */
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
```

Now insert page API, add interface for custom content (ppt) when inserting. So the Insert Page API and Insert PPT API have now been merged into the same API.

* We now provide a new API to support mobile, rename whiteboard pages *

### Image Replacement API

Because the picture replacement API is effective for interactive rooms and playback, we no longer put it in `WhiteRoomCallbackDelegate`, but instead put it in` WhiteCommonCallbackDelgate`.

To enable, please set the "EnableInterrupterAPI" property of "WhiteSdkConfiguration" to YES when initializing the SDK.
And during initialization, use the following method to pass in an instance that implements the protocol

```Objective-C
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback
```

Or when you want to use it, call the `setCommonCallbackDelegate:` method of `whiteSDK` to set it.