---
id: android-scenes
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

### Scene directory

There can be multiple `scenes` under the same `scene directory`;

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
When a scene with a scene path of `/Eng/ppt1` exists in the whiteboard room, it is impossible to exist / accept a scene named `/Eng`. Because `scene path` is composed of `scene directory` and `scene name`.
If this happens, the insertion fails.

---

## API

The APIs involved in this document are methods of the whiteboard `Room` (iOS:` WhiteRoom`). It can also be viewed in the corresponding SDK file.

### Get current scene information


```Java
//Room.Java
/** Get current scene status */
public void getSceneState(final Promise<SceneState> promise)
/** Get current scene directory, all scene information */
public void getScenes(final Promise<Scene[]> promise) 
```


Through the above API, get the current scene information content, and the specific content structure, you can view the structure in each SDK.

### Set the current scene

The current scene represents the page everyone sees in the whiteboard room.

When creating a whiteboard room, there will be a default `scene` named` init`. His `Scene Directory` is` / `, and his` Scene Path` is `/ init`.

If you want to modify the current scene and move to another scene, you only need to call the following API and pass in the `scene path`.


```Java
//Room.Java
public void setScenePath(String path)

//example code
room.setScenePath:"/Phy/ppt1";
```



> When the switching API does not respond, or an error is reported in the callback, the following situations may occur:
> 1. The path is illegal. Please read the previous section and make sure that the `scene path` input conforms to the specification (begins with` / `).
> 2. The `scene` corresponding to the path does not exist.
> 3. The path corresponds to the `scene directory`. Note that `Scene Directory` is not the same as a scene.

### Insert new scene


```Java
//Room.java
/**
 Insert, maybe create multiple pages

 @param dir scene page group name, equivalent to directory
 @param scenes WhiteScence instance; ppt can be configured at the same time when generating WhiteScence
 @param index Select where to insert the page group. index is the index position of the new scence. If you want to put it at the end, you can    pass Integer.MAX_VALUE.
 */
public void putScenes(String dir, Scene[] scenes, int index)
```



Insert scene API, accepts three parameters:

* dir: `Scene Directory`, the corresponding directory location where the scene is to be inserted.
* scenes: list of scenes to be created.
* index: Optional and starting from 0, it indicates the position where the first scene is added in the scenes. Scenario example: There are already 20 pages of PPT documents in the `Scene Directory`. If you want to add a blank page after page 3, set the index. Is 3.

> Incoming `scene directory` (dir) cannot be a 'scene path' of an existing scene. (You cannot insert files into the file)

> When the newly inserted scene, `scene path` (dir scene name) is the same as the` scene path` of the old scene, the new `scene` will overwrite the old` scene`. (New files overwrite old files)

### Duplicate name, mobile scene

Similar to Linux, the mv command for macOS.


```Java
//Room.Java
/**
 Move/rename page

 @param source Scene path of the page you want to move
 @param target The target path. If it is a scene directory, move the source in; otherwise, rename it while moving.
 */
public void moveScene(String source, String target)
```




### Delete scene



```Java
// Room.java
/**
 @param dirOrPath Scene path, or scene directory. If a scene path is passed in, the scene path is removed. If the scene directory is passed in, all scenes under the scene directory are removed.
 */
public void removeScenes(String dirOrPath)
```



You can pass `" / "` to this parameter to clear all scenes in the blank board room.

> There will be at least one scene in the whiteboard room.
Therefore, when you delete the last scene in the whiteboard room, a blank scene named init with a scene path of "/ init" will be automatically generated immediately.

## Screenshot function

```Java
/**
Capture the content of the scene when the user switches, not all the content in the scene.
 FIXME: Picture support: Only when the picture server supports cross-domain, can it be displayed in the screenshot

 @param scenePath The scene path of the scene you want to intercept, such as / init; enter a scene path without a blank image
 @param completionHandler callback function, image may be empty
 */
public void getScenePreviewImage(String scenePath, final Promise<Bitmap>promise) {}
public void getSceneSnapshotImage(String scenePath, final Promise<Bitmap>promise) {}
```

## Related classes

First, we need to know the scene classes: the `SceneState` and the` PptPage` classes.

> Please note: The classes in the SDK are all configuration data. They are used to pass data to the whiteboard and do not hold any whiteboard instances.

### PptPage Class

The PptPage class is ppt-related configuration information. Pass in when creating the WhiteScene class, and then insert the scene API to generate a whiteboard page with a background image.

```Java
public PptPage(String src, Double width, Double height)
```

The center of the picture is the center point of the whiteboard page.

### Scene Class

```Java
public Scene(String name, PptPage ppt)
```

WhiteScene manages a whiteboard page that contains the name and takes over the original ppt content.
Whiteboard pages only accept ppt parameters when they are created.

### SceneState Class

```Java
public class SceneState {
    // All pages in the current scene directory
    public Scene [] getScenes () {
        return scenes;
    }

    // The current scene path
    public String getScenePath () {
        return scenePath;
    }

    // Index of the current scene in Path
    public int getIndex () {
        return index;
    }
}
```

This class describes the status of the current scene directory.

