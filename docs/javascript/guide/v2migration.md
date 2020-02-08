---
id: js-v2migration
title: SDK v2 migration
---

## New features:

1. Cloud recording: When creating a room, select `Replayable Room`（See details[Create Whiteboard -> Room Type](server/api/whiteboard-base.md#create-whiteboard-room)）,the SDK server will automatically record in the cloud.
2. New playback function: Provide playback API
3. Added whiteboard page management function

>v1.0 and v2.0 rooms are not interoperable. SDK Token does not need to be updated. 
v2.0 has removed some APIs. You need to implement the new APIs through the following documents.

*We will not shut down v1.0 services, but we still recommend that you migrate to v2.0. Not recommended for any new users, use version 1.0 SDK*

## New concept: scene

First of all, in order to enhance the page management function of the whiteboard, we introduce some new concepts: scenes and scene directories.
If you don't understand the concept of scene, we suggest you refer to the concept of explorer and file for reference.

Scenes currently include: scene name, PPT (background image), PPT width, PPT height content.
There is also something related to the scene, not held by the scene itself: the scene path. The scene path is the scene directory scene name, which is held by the scene itself.

The scene directory is the directory where the files are located.（The scene directory in the SDK refers to the file format under the Unix system.`\dir1\dir`）

>Recommended reading [Scene management](../features/scenes.md) 

---

## pptImages disappear

You may find that your following code causes an error at runtime.

```javascript
var pptImages = room.state.pptImages; // pptImages is undefined
```

That's because our new version of the API exposes scenes directly, rather than using a string array to represent PPT content. Replace your code with the following.

```javascript
var pptImages = room.state.sceneState.scenes.map(function(scene) {
    if (scene.ppt) {
        return scene.ppt.src;
    } else {
        return "";
    }
});
```

当然，我们更推荐你直接抛弃 pptImages 这个概念，重构代码，通过直接管理场景来处理与 PPT 相关的业务。

```javascript
var scenes = room.state.sceneState.scenes;
```

## scenes disappear

Of course, we recommend that you directly abandon the concept of pptImages, refactor the code, and handle the business related to PPT by directly managing the scene.

```javascript
var scenes = room.state.scenes; // scenes is undefined
```

`scenes` Moved to another location. You can change it to the following form.

```javascript
var scenes = room.state.sceneState.scenes;
```

## Scene 的结构变了

You might have read the `key` field of Scene before to meet your business needs. But found that ` key` is always `undefined`.

```javascript
var scene = room.state.scenes[0];
var key = scene.key; // key is undefined
```

This is because in v2.0, scenes no longer distinguish each other by the `` key`` field. The above code, you can replace it with the following form.

```javascript
var scenes = room.state.sceneState.scenes;
var name = scene.name;
```

If you previously considered `key` as the globally unique identifier for the scene. So now I strongly suggest that you use the path of the scene as a substitute for `key`.

你在之前可能会读取 Scene 的 `isEmpty` 字段，以满足自己的业务需求。但发现 `isEmpty` 永远是 `undefined`。

```javascript
var scene = room.state.scenes[0];
var isEmpty = scene.isEmpty; // key is isEmpty
```

This is because in v2.0, we use `componentsCount` to directly tell how many elements the current scene has. The above code, you can replace it with the following form.

```javascript
var scene = room.state.scenes[0];
var isEmpty = scene.componentsCount === 0;
```

## Read and modify the current scene

You may find that you cannot read the index of the current scene.

```javascript
var index = room.state.globalState.currentSceneIndex; // index is undefined
```

This index was moved to another place.

```javascript
var index = room.state.sceneState.index;
```

Then, you will find that you cannot modify the index as follows.

```javascript
room.state.sceneState.index = index; // error
```

This is because in v2.0, we can only modify the current scene through the scene path.

## Upload PPT

You may find that you cannot upload your PPT.

```javascript
var pptPages = [...];
room.pushPptPages(pptPages); // Runtime error
```

你可以将代码替换成如下形式。

```javascript
var pptPages = [...];
room.putScenes("/", pptPages.map(page => ({ppt: page})));
```

## You can replace the code with the following form.

You may find that the following code does not execute correctly.

```javascript
var index = 0;
room.insertNewPage(index); // Runtime error
room.removePage(index); // Runtime error
```

You can replace the code with the following form.

```javascript
var index = 0;
// "ppt" is an optional parameter. Once the ppt parameter is added, the internal fields must be completed.
// "name" is an optional parameter, if not selected, a random string will be automatically generated
// "index" is an optional parameter
// For details, please refer to the [Scenario Management] document
room.putScenes('/', [{ppt : {src: 'https://example.com/1.png', width: 1024, height: 768}, name: '1'}], index);

// Remove the scene you just added
var toRemoveScene = room.state.sceneState.scenes[index];
room.removeScene('/' + toRemoveScene.name);
```