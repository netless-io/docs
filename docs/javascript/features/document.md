---
id: js-document
title: 文档转换
---

阅读本文前，请先阅读 server 端文档: [文档转图片](/docs/server/api/server-static-conversion)、[文档转网页](/docs/server/api/server-dynamic-conversion)，确保已经在 [console](https://console.herewhite.com) 开通对应服务。

SDK 将于 SDK 服务器的交互封装成了 `pptConverter` 类，开发者无需在客户端关心与 SDK 服务器端的交互。

## 展示转换后文档

对于 pptx 文档而言，每一页都将与白板的一个场景对应。

一个有 24 页的 pptx 文件，将在白板上创建 24 个场景。关于场景概念，详情请见 [场景管理](/docs/javascript/guides/js-scenes)。

```javascript
//之前初始化的 sdk 实例，roomToken 创建房间时，具体房间的 roomToken，此处作为鉴权使用。
pptConverter = sdk.pptConverter("任一房间的 roomToken，此处作为鉴权使用");
pptConverter.convert({
  url: yourPPTDocumentURL,
  kind: "dynamic",
}).then(function(result) {
  // scenes 就是用来创建 pptx 对应的场景的描述信息
  var scenes = result.scenes;
});
```

此时你已经获取了 `scenes` 数组。你可以立即将它们插入场景。

```javascript
// 为这个 ppt 文件起一个独一无二的名字。
// 如果你的白板中可能出现多个 ppt，这样有助于管理它们。
var pptName = "dynamic";

// 将 ppt 对应的场景插入白板
room.putScenes("/" + pptName, scenes);

// 切换当前场景到 ppt 的第一页，这样才能显示出来
room.setScenePath("/" + pptName + "/" + scenes[0].name);
```

当然，你也可以将 `scenes` 通过 `JSON.stringify(scenes)` 转化成字符串，然后存储到数据库中。然后根据业务在适当的时机反序列化后再插入场景。

## 动态 PPT 播放

你可以通过调用如下方法来播放动态 PPT，当当前页面 PPT 的动画全部执行完成后，再次调用该方法时，会自动进入下一页场景。

```javascript
room.pptNextStep(); // 下一页（下一步）
room.pptPreviousStep() // 上一页（上一步）
```

## 自定义字体

如果你的 pptx 中包含了不属于我们默认字体列表中的字体，你可以通过配置自定义字体列表来支持。首先，你需要将字体文件上传到你自己的服务器或对象存储平台。然后，将字体文件的 URL 在 WhiteWebSdk 初始化时以如下代码配置。

```javascript
const whiteWebSDK = new WhiteWebSdk({
  // 其他配置项
  fonts: {
    "Calibri": "https://your-cdn.com/Calibri.ttf",
    "宋体": "https://your-cdn.com/Songti.ttf",
    "楷体": "https://your-cdn.com/Kaiti.ttf",
	},
});
```

