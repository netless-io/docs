---
id: js-parameter
title: 初始化参数
---

## 初始化sdk

### API：

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
```

### 初始化参数：

* **urlInterrupter**(可选): url => url;

>图片替换方法，接受一个 string，返回一个 string。  
>在插入图片和创建新场景背景图时，sdk 会调用该 API，此时可以修改最终显示的url。  
>如果没有需要，请不要传入。目前在绘制时，会频繁调用该 API。

* **deviceType**(可选): `desktop`|`touch`|`surface`。

>值：`desktop`,`touch`,`surface`。  
根据传入值，依次接受`mouse` 事件，`touch` 事件；传入`surface`时，则会同时接收`touch`,`mouse`事件。
默认会根据运行环境进行推断

* fonts(可选):`{key: url}`
>动态 ppt 需要的自定义字体object 映射，key 为动态 ppt 所用字典，值为字典所在网络地址。

* **handToolKey**(可选): `string`

>抓手工具快捷键。设置后，用户同时按住该快捷键与鼠标，即可移动整个白板。  
可以输入`KeyboardEvent`键盘事件可以出发的`key`属性。推荐传入空格键(`" "`)

* preloadDynamicPPT(默认`false`): `boolean`

>是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长

* loggerOptions(有默认):`自定义Object`

默认值：

```js
{
    //是否禁用上传，默认上传
    disableReportLog: false,
    //上传日志的等级，默认 info
    reportLevelMask: "info",
    //打印日志的等级，默认 info
    printLevelMask: "info";
}
```

想要修改参数，只需要将修改的值传入即可。
```js
{
    disableReportLog?: boolean,
    reportLevelMask?: "debug" | "info" | "warn" | "error",
    printLevelMask?: "debug" | "info" | "warn" | "error";
}
```
`disableReportLog`

* onlyCallbackRemoteStateModify(默认`true`):`boolean`

>`room`本地修改的内容，是否在`onRoomStateChange`中回调。默认不回调。

* zoomMaxScale(可选): `number`

>用户可以放到的最大比例，默认不限制。  
>开发者仍然可以使用代码进行放大。

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置。

* zoomMinScale(可选):`number`

>用户可以缩小的最小比例，默认不限制。  
>开发者仍然可以使用代码进行缩小。

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置。

## 初始化房间

### API:

```
whiteWebSdk.joinRoom({
    uuid: json.msg.room.uuid,
    roomToken: json.msg.roomToken,
});
```

### 初始化参数：

* **uuid**(必须): string

>房间表示，同一个房间的人，可以进行互动。

* **roomToken**(必须): string

>房间鉴权信息

* **userPayload**(可选): 用户自定义类型

>用户透传信息，会在 room.state.roomMembers 中体现。  

* cursorAdapter(可选): ReactComponent

>处理用户信息(`userPayload`)与用户头像div之间的映射关系。   
>该参数配合`userPayload`可以显示用户鼠标所在位置。

* cameraBound

>缩放范围限制

* disableBezier(默认`false`): boolean

>取消贝塞尔曲线优化

* **disableDeviceInputs**(默认`false`): boolean

>禁止教具响应用户操作，无法绘制内容。默认`false`，即允许响应。  
>可以通过`room.disableDeviceInputs`进行获取，修改。

* **disableOperations**(默认`false`): boolean

>是否禁止用户所有操作，包括教具操作，以及手势缩放，移动。默认`false`，即允许响应。  
>可以通过`room.disableOperations`进行获取，修改。

* **disableEraseImage**(默认`false`): boolean

>是否禁止橡皮擦删除图片。默认`false`，即允许橡皮擦删除图片。  
>可以通过`room.disableEraseImage`进行获取，修改。