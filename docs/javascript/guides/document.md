---
id: js-document
title: 文档展示
---

# 文档展示

你可以将 pptx 格式的文档搬到白板上。在此之前，你需要使用我们的文档转化服务，将你的 pptx 文件转化成可以在白板上展示的格式。

我们提供如下两种文档转化服务。

- 文档转图片：将文档转化成静态文件，这会让 pptx 中的交互动画、音频、视频全部丢失。
- 文档转网页：保留 pptx 中交互动画、音频、视频的方案。

如果你尚未了解如何使用我们的文档转化服务，可以先阅读[《文档转图片》](/docs/javascript/guides/js-replay)、[《文档转网页》](/docs/server/api/server-dynamic-conversion)。

## 将转化后的文档在白板上展示

对于 pptx 文档而言，每一页都将与白板的一个场景对应。例如，一个有 24 页的 pptx 文件，将在白板上创建 24 个场景。如果你尚未了解场景是什么，以及如何管理，可以先阅读[《场景管理》](docs/advance/advance-scenes)。

假设你已经通过如下代码成功完成文档转化。

```javascript
pptConverter.convert({
  url: yourPPTDocumentURL,
  kind: "dynamic",
}).then(function(result) {
  var scenes = result.scenes;
  // scenes 就是用来创建 pptx 对应的场景的描述信息
});
```

此时你已经获取了 ``scenes`` 数组。你可以立即将它们插入场景。

```javascript
// 为这个 ppt 文件起一个独一无二的名字。
// 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
var pptName = "...";

// 将 ppt 对应的场景插入白板
room.putScene("/" + pptName, scenes);

// 切换当前场景到 ppt 的第一页，这样才能显示出来
room.setScenePath("/" + pptName + "/" + scenes[0].name);
```

当然，你也可以将 ``scenes`` 通过 ``JSON.stringify(scenes)`` 转化成字符串，然后存储到数据库中。然后根据业务在适当的时机反序列化后再插入场景。

## 切换文档

你可以通过调用如下方法来切换文档：

```javascript
room.pptNextStep(); // 下一页（下一步）
room.pptPreviousStep() // 上一页（上一步）
```

