---
id: js-parameter
title: 初始化
---

## 初始化代码

获取到房间到 uuid 和 roomToken 后就可以加入指定房间了，加入房间的 API 如下

```javascript
//初始化 SDK
var whiteWebSdk = new WhiteWebSdk({
        // 图片替换 API，可以在插入图片和创建新场景背景图时，替换传入的 url。
        // 如果没有需要，请不要传入，可以减少前端资源开销
        // 使用该 API 后，服务器截屏时，会使用原始图片地址
        urlInterrupter: url => url, // 可选
        preloadDynamicPPT: false, // 可选,是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长
        deviceType: "touch", // 可选, touch or desktop , 默认会根据运行环境进行推断
    });
    // 加入房间
    return whiteWebSdk.joinRoom({
        uuid: json.msg.room.uuid,
        roomToken: json.msg.roomToken,
        disableBezier: false, // 可选，禁止铅笔笔迹以贝塞尔曲线的形式展示，默认为 false
        disableEraseImage: false, // 可选，禁止橡皮擦出图片，默认为 false
    });
```

## 初始化参数

>

### 初始化 SDK 参数

|参数|类型|说明|
|--|--|--|
|deviceType|字符串枚举:<br>`desktop`,`touch`,`surface`|根据传入类型不同，接收 `touch` 事件，`mouse` 事件。传入`surface`时，则会同时接收`touch`,`mouse`事件|
|fonts|object|动态 ppt 需要的自定义字体|
|handToolKey|string|设置后，用户按住对应按键的同时，按住鼠标，即可移动整个白板。key 为 KeyboardEvent 中的 key 属性。推荐传入空格键(" ")|
|preloadDynamicPPT|boolean|是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长|
|loggerOptions|object|日志等级|
|onlyCallbackRemoteStateModify|boolean|本地调用是否回调|
|zoomMaxScale|number|最大缩放比例（仅限用户操作，代码缩放仍然支持）|
|zoomMinScale|number|最小缩放比例（仅限用户操作，代码缩放仍然支持）|

### 加入房间参数：

| 参数 | 类型 | 作用 |
| --- | --- | --- |
|uuid|string|房间 uuid|
|roomToken|string|房间鉴权token|
|userPayload|任意类型|用户透传信息，会在 room.memeberState 中体现|
|disableDeviceInputs|boolean|禁止教具响应|
|disableBezier|boolean|禁止贝塞尔曲线优化|
|cursorAdapter|object|负责处理用户信息与头像的显示关系|
|cameraBound|function|限制视野范围|
|disableEraseImage|boolean|是否让橡皮擦除图片|
|disableOperations|boolean|是否禁止所有操作|