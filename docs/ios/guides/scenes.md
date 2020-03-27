---
id: ios-scenes
title: Scene management
---

## New concepts

### scene

In order to enhance the page management function of the whiteboard, we introduce a new concept: ** scene **.
`Scene` is a page of the whiteboard we have been using.

A `scene` consists of` scene name` and `PPT (background image)`.

### scene path (scenePath) = scene directory scene name

When managing multiple scenes, we want to get a specific scene, at this time we need ** `Scene Path` **. Each `scene path` points to a specific scene.

> Analog the concept of PC files and folders.
Scene-> File
Scene directory-> folder path
Scene path-> File absolute address


> Analog courseware management concepts.
Scenario-> Name of a page in a PPT document
Scene directory-> location of a PPT file
Scene path-> absolute position of a page of the PPT document

The following is a set of legal `scene paths`.

```shell
/init
/Eng/ppt1
/Eng/ppt2
/Eng/ppt3
/Phy/ppt1
/Phy/ppt2
/Phy/ppt3
```

** `Scene Path` is separated by `/`, and must start with `/`. The rightmost hierarchy is the name of the scene. **


This set of scenarios can also be represented in the form of the following file structure.

`` `shell
| ____ init (scene)
| ____ Eng (Scene Directory)
| | ____ ppt1 (scene)
| | ____ ppt3 (scene)
| | ____ ppt2 (scene)
| ____ Phy (Scene Directory)
| | ____ ppt1 (scene)
| | ____ ppt3 (scene)
| | ____ ppt2 (scene)
`` `

### Scene directory

There can be multiple `scenes` under the same` scene directory`;

- /Phy
- /Eng

Then there are three scenes under the scene directory `/Phy`.

- /Phy/ppt1
- /Phy/ppt2
- /Phy/ppt3

> Directional uniqueness of the scene path:
The file-like concept of each scene path points to a unique scene.
When using the Move, Copy, and Insert Scene APIs, if a specific scene already exists in the incoming path, the scene will be overwritten by the new scene.

Scene directory and scene path cannot be the same:
When a scene with a scene path of `/Eng/ppt1` exists in the whiteboard room, it is impossible to exist / accept a scene named`/Eng`. Because `scene path` is composed of` scene directory` and `scene name`.
If this happens, the insertion fails.
---

## API

The APIs involved in this document are methods of the whiteboard `Room` (iOS:` WhiteRoom`). It can also be viewed in the corresponding SDK file.

### Get current scene information


```Objective-C
@interface WhiteRoom : NSObject
/ ** Get current scene status * /
- (void)getSceneStateWithResult:(void (^) (WhiteSceneState *state))result;

/ ** Get current scene directory, all scene information * /
- (void)getScenesWithResult:(void (^) (NSArray<WhiteScene *> *scenes))result;
@end
```


Through the above API, get the current scene information content, and the specific content structure, you can view the structure in each SDK.

### Set the current scene

The current scene represents the page everyone sees in the whiteboard room.

When creating a whiteboard room, there will be a default `scene` named `init`. His `Scene Directory` is `/`, and his `Scene Path` is `/init`.

If you want to modify the current scene and move to another scene, you only need to call the following API and pass in the `scene path`.


```Objective-C
@interface WhiteRoom : NSObject
- (void)setScenePath:(NSString *)path;
@end

//example code
[room setScenePath:@"/Phy/ppt1"]
```


> When the switching API does not respond, or an error is reported in the callback, the following situations may occur:
> 1. The path is illegal. Please read the previous section and make sure that the `scene path` input conforms to the specification (begins with `/ `).
> 2. The `scene` corresponding to the path does not exist.
> 3. The path corresponds to the `scene directory`. Note that `Scene Directory` is not the same as a scene.

### Insert new scene


```Objective-C
@interface WhiteRoom : NSObject

/**
 Insert, maybe create multiple pages

 @param dir scene page group name, equivalent to directory
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can pass in NSUIntegerMax.
 */
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
@end
```



Insert scene API, accepts three parameters:

* dir: `Scene Directory`, the corresponding directory location where the scene is to be inserted.
* scenes: list of scenes to be created.
* index: Optional and starting from 0, it indicates the position where the first scene is added in the scenes. Scenario example: There are already 20 pages of PPT documents in the `Scene Directory`. If you want to add a blank page after page 3, set the index. Is 3.

> Incoming `scene directory` (dir) cannot be a 'scene path' of an existing scene. (You cannot insert files into the file)

> When the newly inserted scene, `scene path` (dir scene name) is the same as the` scene path` of the old scene, the new `scene` will overwrite the old` scene`. (New files overwrite old files)

### Duplicate name, mobile scene

Similar to Linux, the mv command for macOS.


```Objective-C
@interface WhiteRoom : NSObject
/**
 Move / rename page

 @param source absolute path of the page you want to move
 @param target The target path. If it is a folder, move the source in; otherwise, rename it while moving.
 */
- (void)moveScene:(NSString *)source target:(NSString *)target;
@end
```




### Delete scene



```Objective-C
@interface WhiteRoom : NSObject

/**
@param dirOrPath Scene path, or scene directory. If a scene path is passed in, the scene path is removed. If the scene directory is passed in, all scenes under the scene directory are removed.
 */
- (void)removeScenes:(NSString *)dirOrPath;
```




You can pass `" / "` to this parameter to clear all scenes in the blank board room.

> There will be at least one scene in the whiteboard room.
Therefore, when you delete the last scene in the whiteboard room, a blank scene named init with a scene path of "/ init" will be automatically generated immediately.

## Screenshot function

> 2.3.0 Added API, playback room and real-time room, both support this function

The screenshot size is the size of the current playback / real-time room display.

```Objective-C
// This class is the parent of WhiteRoom and WhitePlayer
@interface WhiteDisplayer : NSObject
/**
 Capture the content of the scene when the user switches, not all the content in the scene.
 FIXME: Picture support: Only when the picture server supports cross-domain, can it be displayed in the screenshot

 @param scenePath The scene path of the scene you want to intercept, such as / init; enter a scene path without a blank image
 @param completionHandler callback function, image may be empty
 */
- (void)getScenePreviewImage:(NSString *)scenePath completion:(void (^)(UIImage * _Nullable image))completionHandler;

/**
 Screenshot of the scene cover, which will contain the entire contents of the scene
 FIXME: Picture support: Only when the picture server supports cross-domain, can it be displayed in the screenshot

 @param scenePath The scene path of the scene you want to intercept, such as / init; enter a scene path without a blank image
 @param completionHandler callback function, image may be empty
 */
- (void)getSceneSnapshotImage:(NSString *)scenePath completion:(void (^)(UIImage * _Nullable image))completionHandler;

@end
```

## Related classes

First, we need to know the scene classes: the `WhiteScene` and` WhitePptPage` classes.

> Please note: The classes in the SDK are all configuration data. They are used to pass data to the whiteboard and do not hold any whiteboard instances.

### WhitePptPage Class

The WhitePptPage class is ppt-related configuration information. Pass in when creating the WhiteScene class, and then insert the scene API to generate a whiteboard page with a background image.

```
@interface WhitePptPage : WhiteObject

// image url
@property (nonatomic, copy) NSString *src;
@property (nonatomic, assign) CGFloat width;
@property (nonatomic, assign) CGFloat height;

@end
```

The center of the picture is the center point of the whiteboard page.

### WhiteScene Class

```Objective-C
@interface WhiteScene : WhiteObject

- (instancetype)init;
- (instancetype)initWithName:(nullable NSString *)name ppt:(nullable WhitePptPage *)ppt;

@property (nonatomic, copy, readonly) NSString *name;
// You can determine whether the page has content by checking whether this property is 0. (The number does not count ppt, and it is also 0 if there is only ppt.)
@property (nonatomic, assign, readonly) NSInteger componentsCount;
@property (nonatomic, strong, readonly, nullable) WhitePptPage *ppt;
@end
```

WhiteScene manages a whiteboard page that contains the name and takes over the original ppt content.
Whiteboard pages only accept ppt parameters when they are created.

### WhiteSceneState Class

```Objective-C
@interface WhiteSceneState: WhiteObject
// All scenes of the current scene group
@property (nonatomic, nonnull, strong, readonly) WhiteScene * scenes;
// Current scene group directory
@property (nonatomic, nonnull, strong, readonly) NSString * scenePath;
// The current scene, the index position in the scenes array.
@property (nonatomic, assign, readonly) NSInteger index;
@end
```

This class describes the status of the current scene directory.
