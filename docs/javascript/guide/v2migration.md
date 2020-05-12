---
id: js-v2migration
title: 2.0.0 迁移指南
---

## 新增功能：

1. 云端录制：创建房间时，选择`可回放房间`（详情请查看[创建白板——房间类型](server/api/whiteboard-base.md#创建白板)），SDK 服务器会在云端自动录制。
1. 新增回放功能：提供回放API
1. 新增白板页面管理功能

>v1.0与v2.0房间不互通。SDK Token 不需要更新。
v2.0移除了部分 API，您需要通过下面的文档，使用新 API 实现。

*我们不会关闭 v1.0 的服务，但我们依然推荐你迁移到 v2.0。不建议任何新用户，使用 1.0 的版本 sdk*

## 新增概念:场景

首先，为了增强白板的页面管理功能，我们引入一些新概念：场景以及场景目录。
如果您不能理解场景这个概念，我们建议您参考资源管理器以及文件的概念，进行参考。

场景目前主要包括：场景名，PPT（背景图），PPT宽，PPT高 这几个内容。
还有一个与场景有关，不是由场景本身持有的内容：场景路径。场景路径由场景目录+场景名，后者由场景本身持有。

场景目录，则是文件的所在目录。（SDK 中的场景目录，格式参考的是 Unix 系统下的文件格式。`\dir1\dir`）

>推荐阅读 [场景管理](../features/scenes.md)

---

## pptImages 不见了

你可能发现你的如下代码导致运行时报错。

```javascript
var pptImages = room.state.pptImages; // pptImages is undefined
```

那是因为我们的新版 API 中直接暴露场景，而非用一个字符串数组表示 PPT 内容。将你的代码替换成如下形式即可。

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

## scenes 不见了

你可能发现你的如下代码导致运行时报错。

```javascript
var scenes = room.state.scenes; // scenes is undefined
```

``scenes`` 被挪到了另一个位置。你可以改成如下形式。

```javascript
var scenes = room.state.sceneState.scenes;
```

## Scene 的结构变了

你在之前可能会读取 Scene 的 ``key`` 字段，以满足自己的业务需求。但发现 ``key`` 永远是 ``undefined``。

```javascript
var scene = room.state.scenes[0];
var key = scene.key; // key is undefined
```

这是因为 v2.0 中，场景不再通过 ``key`` 字段来区分彼此。如上代码，你可以替换成如下形式。

```javascript
var scenes = room.state.sceneState.scenes;
var name = scene.name;
```

如果你之前将 ``key`` 视为场景的全局唯一标识符。那么现在我强烈建议你将场景的路径作为 ``key`` 的替代品。

你在之前可能会读取 Scene 的 ``isEmpty`` 字段，以满足自己的业务需求。但发现 ``isEmpty`` 永远是 ``undefined``。

```javascript
var scene = room.state.scenes[0];
var isEmpty = scene.isEmpty; // key is isEmpty
```

这是因为 v2.0 中，我们使用 ``componentsCount`` 直接告诉当前场景有多少元素。如上代码，你可以替换成如下形式。

```javascript
var scene = room.state.scenes[0];
var isEmpty = scene.componentsCount === 0;
```

## 读取和修改当前场景

你可能发现无法读取当前场景的索引。

```javascript
var index = room.state.globalState.currentSceneIndex; // index is undefined
```

这个索引被移到了另外一个地方。

```javascript
var index = room.state.sceneState.index;
```

然后，你会发现你不能通过如下方式修改索引。

```javascript
room.state.sceneState.index = index; // 错误
```

这是因为，在 v2.0 中，我们只能通过场景路径的方式修改当前场景。

## 上传 PPT

你可能发现无法上传 PPT 了。

```javascript
var pptPages = [...];
room.pushPptPages(pptPages); // 运行时错误
```

你可以将代码替换成如下形式。

```javascript
var pptPages = [...];
room.putScenes("/", pptPages.map(page => ({ppt: page})));
```

## 插入与删除场景

你可能发现，如下代码无法正确执行了。

```javascript
var index = 0;
room.insertNewPage(index); // 运行时错误
room.removePage(index); // 运行时错误
```

你可以将代码替换成如下形式。

```javascript
var index = 0;
// ppt 为可选参数，一旦添加 ppt 参数，内部字段必须填写完整
// name 为可选参数，如果不选，则会自动生成随机字符串
// inde 为可选参数
// 具体可以参看[场景管理]文档
room.putScenes('/', [{ppt : {src: 'https://example.com/1.png', width: 1024, height: 768}, name: '1'}], index);

// 移除刚刚添加的场景
var toRemoveScene = room.state.sceneState.scenes[index];
room.removeScene('/' + toRemoveScene.name);
```