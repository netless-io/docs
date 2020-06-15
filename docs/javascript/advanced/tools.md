---
id: tools
title: 教具
---

阅读本章，你将学会如何使用教具，切换教具，管理教具。到此章为止，我们假设你已经成功将 Netless 互动白板 SDK 安装并引入了项目，并且已经了解如何获取实时房间实例 `room` 对象。如果没有，你可能跳过了之前的章节，强烈建议你先阅读[《安装》](https://developer.netless.link/javascript/advanced-tutorial/installation)[《实时房间》](https://developer.netless.link/javascript/advanced-tutorial/realtime-room)。

## 教具列表

Netless 互动白板提供了丰富的教具，我们希望这些教具能满足你的业务场景需求。我们将来还会推出更多的教具。每一个教具都有自己的名字，这是一个 `string` 类型的值。如下是目前互动白板支持的教具列表。

| 教具名 | 教具描述 |
| :--- | :--- |
| selector | 选择工具 |
| pencil | 铅笔 |
| rectangle | 矩形绘制工具 |
| ellipse | 圆、椭圆绘制工具 |
| eraser | 橡皮，用于擦除其他教具绘制的笔迹 |
| text | 文字工具 |
| straight | 直线绘制工具 |
| arrow | 箭头绘制工具 |

## 切换教具

只要知道了教具的名字，就可以通过如下方法切换教具。

```javascript
// 把教具切换为「铅笔」
room.setMemberState({currentApplianceName: "pencil"});
```

也可以通过如下方式获取当前的教具名称。

```javascript
var applianceName = room.state.memberState.currentApplianceName;
```

你可能已经注意到了，这里的代码两次出现了 `memberState` 这个名字。这是一个字典 object，用来描述当前用户（即进入房间的你）的状态。其中 `currentApplianceName` 这个属性用于标示「当前我选择的教具名」。

根据业务需要，我们可以通过 `setMemberState` 方法来修改 `memberState` 中的一项或多项。例如，我们可以通过如下代码修改「铅笔」工具绘制的线条的颜色和粗细。

```javascript
var strokeColor = [0, 0, 255]; // 用 RGB 标示的颜色，这里标示蓝色
var strokeWidth = 10; // 线条粗细，10 是一个很粗的值

room.setMemberState({
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
});
```

如果想了解更多`memberState` 的事，可以阅读[《房间业务状态管理》](https://developer.netless.link/documents/client/room-business-state-management)。

## 插入图片

一般意义上的插入图片，包含上传、展示两个步骤。Netless 互动白板并不提供上传的功能。这意味着如果你有上传需求，你得自己实现。白板 SDK 展示图片时需要 URL（你得自己保证这个 URL 最终用户能访问到），可以用如下代码把图片插入到白板上。

```javascript
var imageInformation = {
    uuid: uuid,
    centerX: centerX,
    centerY: centerY,
    width: width,
    height: height,
    locked: false,
};
room.insertImage(imageInformation);
room.completeImageUpload(uuid, src);
```

这里写了一堆参数，我们将一起捋一捋，每一个参数是什么意思。

首先，`locaked` 是一个预留值，我们永久保持 `false` 即可。

### 创建图片的 uuid

`uuid` 是该图片在白板中的唯一标识符，是一个字符串。在业务上，需要保证这个字符串在整个实时房间中是唯一的、不重复的。

我们的建议是，可以用 UUID 生成库来生成它。UUID 是一种不依赖中央机构的全时空的通用唯一识别码，你可以阅读[《通用唯一识别码》](https://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8%E5%94%AF%E4%B8%80%E8%AF%86%E5%88%AB%E7%A0%81)来了解更多。但在此之前，你需要安装 `uuid` 库。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```bash
npm install uuid
```

<!--yarn-->

```bash
yarn add uuid
```

<!--END_DOCUSAURUS_CODE_TABS-->

之后，就可以通过如下代码生成 UUID 了。

```javascript
import { v1 } from "uuid";

var uuid = v1();
```

我们非常**不建议**你使用本地自增长 ID 的方式来生成 UUID。如下代码是**错误的示范**。

```javascript
// 警告：这是错误示范，实际使用中不要这么写
class Business {

    static nextId = 0;

    static generateUUID() {
        return String(this.nextId ++);
    }
}
```

这种写法的问题在于，自增长 ID 只能保证在这一个浏览器的运行环境中唯一，但做不到全球唯一。值得注意的是，Netless 是实时互动白板，全国各地甚至世界各地的人们都可以加入同一个房间。这种方式无法避免不同地区的人们碰巧生成了相同的 ID。

### 确定图片的坐标和尺寸

`centerX` 与 `centerY` 标示图片中心点的坐标。`width` 与 `height` 标示图片的宽高。以上四个值，描述的是图片的**世界坐标**，标示在白板场景坐标系中的一个矩形。由于 Netless 互动白板支持视角移动与放缩，我们需要一个不随视角变化而变化的坐标系来描述图片的空间位置，这就是世界坐标系。如果你对此想了解更多，可以阅读[《视角与坐标》](https://developer.netless.link/documents/client/view-and-coordinates)。

通过如下代码，可以把图片插入到 Web 页面的中央。这段代码做了一些坐标转换的操作，以确保不管视角如何移动，都能找到当前视角下屏幕中央对准的世界坐标。

```javascript
// 获取白板占位符，请根据自己的业务逻辑调整这一行
var boardSpaceholder = document.getElementById("whiteboard");

// 取屏幕上白板占位符的中点坐标
var screenCenterX = boardSpaceholder.clientWidth / 2;
var screenCenterY = boardSpaceholder.clientHeight / 2;

// 将屏幕坐标转化成世界坐标
var pointInWorld = room.convertToPointInWorld({
    x: screenCenterX,
    y: screenCenterY,
});

// 取出作为世界坐标的图片中心点
var centerX = pointInWorld.x;
var centerY = pointInWorld.y;
```

### 获取图片的 URL

图片的 URL 将作为 `src` 参数。Netless 互动白板不提供图片上传服务，你需要自己想办法解决这个问题。为了保证你提供的 URL 能被最终用户访问到，我们推荐使用第三方云计算公司的对象存储服务和 CDN 服务。

对象存储服务相当于一个拥有企业级可用性的图床。用户上传图片到对象存储服务中，服务厂商会长期保存图片。

CDN 是一种内容分发服务，它能保证图片（对应的 URL）对于全国乃至全世界的用户都是可访问的。CDN 服务厂商会利用他们遍布全国（全球）的边缘节点，把图片分发出去。

为了保障产品的高可用性，你可能需要认真挑选对象存储、CDN 供应商。如果不想依靠第三方供应商来解决这个问题，也可以自己使用诸如 Nginx、Tomcat 搭建静态资源服务器。只需要为服务器绑定域名（国内需备案），拿到合适的 URL，也可以作为 Netless 互动白板 SDK 的图片参数传入。

> 图片资源的存储和分发是极富挑战性的工作。除非能力足够强，否则建议将这些工作交给专业的供应商来做。
