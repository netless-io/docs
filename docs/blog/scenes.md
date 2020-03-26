---
id: scenes
title: Scene management
---

## New concepts

### scene

In order to enhance the page management function of the whiteboard, we introduce a new concept: **scene**.
`Scene` is a page of the whiteboard we have been using.

A `scene` consists of`scene name` and `PPT (background image)`.

### scene path (scenePath) = scene directory scene name

When managing multiple scenes, we want to get a specific scene, at this time we need ** `Scene Path` **. Each `scene path` points to a specific scene.

The `scene path` consists of:`scene directory` and `scene name`. The former has nothing to do with `scene` itself, and is related to the location where`scene` is stored.

> The knowledge of the resource manager can be transferred for understanding.
Scene-> File
Scene path-> File absolute address
Scene directory-> folder path where files are located


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

> If you are familiar with the Unix / Linux file system, you will find the paths are similar in form. Scenes are like files, and scene groups are like folders. We recommend that you imagine so.

It can be seen that the `scene path` is similar to the absolute path of the file.

**`Scene Path` is separated by`/`, and must start with`/`. The rightmost hierarchy is the name of the scene.**

This set of scenarios can also be represented in the form of the following file structure.

```shell
| ____ init (scene)
| ____ Eng (Scene Directory)
| | ____ ppt1 (scene)
| | ____ ppt3 (scene)
| | ____ ppt2 (scene)
| ____ Phy (Scene Directory)
| | ____ ppt1 (scene)
| | ____ ppt3 (scene)
| | ____ ppt2 (scene)
```

### Scene group

Multiple `scenes` in the same `scene directory` belong to the same `scene group`. In the above scenario, there are the following two `Scene Groups`;

- /Phy
- /Eng

We can say that there are three scenes under the scene directory `/Phy`, or there are three scenes under the scene group `/Phy`.

- /Phy/ppt1
- /Phy/ppt2
- /Phy/ppt3

> We recommend that you use the concept of `scene directory` when moving `scene`, and other times, use the concept of `scene group`.

### Uniqueness of scene path

#### The scene path points to the only whiteboard

Each scene path points to a unique scene.

When using the Move, Copy, and Insert Scene APIs, if a specific scene already exists in the incoming path, the scene will be overwritten by the new scene.

#### Scene directory and scene path cannot be the same

When a scene with a scene path of `/Eng/ppt1` exists in the whiteboard room, it is impossible to exist / accept a scene named`/Eng`. Because `scene path` is composed of`scene directory` and `scene name`.
If this happens, the insertion fails.

---

## API

The APIs involved in this document are methods of the whiteboard `Room` (iOS:`WhiteRoom`). It can also be viewed in the corresponding SDK file.

### Get current scene information

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```Typescript
let scenceState = room.state.sceneState;

/* scenceState Data structure
{
    // Scene path of current scene
    scenePath: "/Phy/ppt1",
    // Scene group, (all scenes in the same scene directory)
    scenes: [{
        name: "ppt1",
        // (ppt is optional, there is no ppt attribute here)
    }, {
        name: "ppt2",
    }, {
        name: "ppt3",
    }],
    // The current scene, the index position in the scene group list
    index: 0,
}
*/
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject
/** Get the current scene state */
- (void)getSceneStateWithResult:(void (^) (WhiteSceneState *state))result;

/** Get current scene directory, all scene information */
- (void)getScenesWithResult:(void (^) (NSArray<WhiteScene *> *scenes))result;
@end
```
<!--Android/Java-->
```Java
//Room.Java
/** Get the current scene state */
public void getSceneState(final Promise<SceneState> promise)
/** Get current scene directory, all scene information */
public void getScenes(final Promise<Scene[]> promise)
```
<!--END_DOCUSAURUS_CODE_TABS-->

Through the above API, get the current scene information content, and the specific content structure, you can view the structure in each SDK.

### Set the current scene

The current scene represents the page everyone sees in the whiteboard room.

When creating a whiteboard room, there will be a default `scene` named `init`. His `Scene Directory` is `/`, and his `Scene Path` is `/init`.

If you want to modify the current scene and move to another scene, you only need to call the following API and pass in the scene path of the scene you want.

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
// where room is the room object you got through whiteWebSdk.joinRoom (...)
// The parameter of this method is the scene path you want to switch to
room.setScenePath("/phy/ppt1");

```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject
- (void)setScenePath:(NSString *)path;
@end

//example code
[room setScenePath:@"/Phy/ppt1"]
```

<!--Android/Java-->
```Java
//Room.Java
public void setScenePath(String path)

//example code
room.setScenePath:"/Phy/ppt1";
```

<!--END_DOCUSAURUS_CODE_TABS-->

> When the switching API does not respond, or an error is reported in the callback, the following situations may occur:
>
> 1. The path is illegal. Please read the previous section and make sure that the `scene path` input conforms to the specification (begins with `/`).
> 2. The `scene` corresponding to the path does not exist.
> 3. The path corresponds to the `scene directory`. Note that `Scene Directory` is not the same as a scene.

### Insert new scene

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
room.putScenes("/Phy", [{name: "ppt4"}]);
```
<!--iOS/Objective-C-->
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

<!--Android/Java-->
```Java
//Room.java
/**
 Insert, maybe create multiple pages

 @param dir scene page group name, equivalent to directory
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can pass Integer.MAX_VALUE.
 */
public void putScenes(String dir, Scene[] scenes, int index)
```

<!--END_DOCUSAURUS_CODE_TABS-->

Insert scene API, accepts three parameters:

    - dir: `Scene Directory`, the corresponding directory location where the scene is to be inserted.
    - scenes: list of scenes to be created.
    - index: The location of the first scene in scenes.

> Incoming `scene directory` (dir) cannot be a 'scene path' of an existing scene. (You cannot insert files into the file)
> When the newly inserted scene, `scene path` (dir scene name) is the same as the`scene path` of the old scene, the new `scene` will overwrite the old`scene`. (New files overwrite old files)

### Duplicate name, mobile scene

Similar to Linux, the mv command for macOS.

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
/**
 Move / rename page

 @param source Scene path of the page you want to move
 @param target The target path. If it is a scene directory, move the source in; otherwise, rename it while moving.
 */
room.moveScene("/math/geometry", "/graphics/geometry");
```
<!--iOS/Objective-C-->
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

<!--Android/Java-->
```Java
//Room.Java
/**
 Move / rename page

 @param source Scene path of the page you want to move
 @param target The target path. If it is a scene directory, move the source in; otherwise, rename it while moving.
 */
public void moveScene(String source, String target)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### Delete scene

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
/**
@param dirOrPath Scene path, or scene directory. If a scene path is passed in, the scene path is removed. If the scene directory is passed in, all scenes under the scene directory are removed.
 */
room.removeScenes("/Phy/ppt4")
room.removeScenes("/Eng");
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject

/**
@param dirOrPath Scene path, or scene directory. If a scene path is passed in, the scene path is removed. If the scene directory is passed in, all scenes under the scene directory are removed.
 */
- (void)removeScenes:(NSString *)dirOrPath;
```

<!--Android/Java-->
```Java
// Room.java
/**
@param dirOrPath Scene path, or scene directory. If a scene path is passed in, the scene path is removed. If the scene directory is passed in, all scenes under the scene directory are removed.
 */
public void removeScenes(String dirOrPath)
```

<!--END_DOCUSAURUS_CODE_TABS-->

You can pass `/` to this parameter to clear all scenes in the blank board room.

> There will be at least one scene in the whiteboard room.
Therefore, when you delete the last scene in the whiteboard room, a blank scene named init with a scene path of "/ init" will be automatically generated immediately.
