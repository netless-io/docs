---
id: js-sdk
title: SDK参数
---

## 初始化API

### TypeScript 方法签名

```TypeScript
//WhiteWebSdk.d.ts
constructor(params: WhiteWebSdkConfiguration = {})
```

### 示例代码

```javascript
//初始化 SDK
var whiteWebSdk = new WhiteWebSdk({
    preloadDynamicPPT: false, // 可选,是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长
    deviceType: "touch", // 可选, touch or desktop , 默认会根据运行环境进行推断
});
```

## 参数：

```Typescript
export type WhiteWebSdkConfiguration = {
    readonly deviceType?: DeviceType;
    readonly screenType?: ScreenType;
    readonly fonts?: UserFonts;
    readonly handToolKey?: string;
    readonly preloadDynamicPPT?: boolean;
    readonly loggerOptions?: LoggerOptions;
    readonly onlyCallbackRemoteStateModify?: boolean;
    readonly urlInterrupter?: (url: string) => string;
    readonly zoomMaxScale?: number;
    readonly zoomMinScale?: number;
};
```

>所有参数均为可选，部分已有默认值。

### **urlInterrupter**: 图片替换

```js
类型：url => url；
传入一个 string，返回一个 string。  
```

>在插入图片和创建新场景背景图时，sdk 会调用该 API，此时可以修改最终显示的url。  
>如果没有需要，请不要传入该参数。目前在绘制时，会频繁调用该 API。

### **deviceType**: 设备类型

```js
值：`desktop`|`touch`|`surface`。

默认会根据运行环境进行推断是`desktop`还是`touch`。  
根据传入值，依次接受`mouse`事件，`touch`事件；传入`surface`时，则会同时接收`touch`,`mouse`事件。
```

### fonts: ppt 映射字体

```js
类型结构：`{key: url}`

动态 ppt 需要的自定义字体映射，`key`为动态 ppt 所用的字体名称，`url`为字典所在网络地址。
```

### **handToolKey**: 抓手工具快捷键

```js
类型：`string`
设置后，用户同时按住该快捷键与鼠标，即可移动整个白板。  
可以输入`KeyboardEvent`键盘事件可以出发的`key`属性。推荐传入空格键(`" "`)
```

### preloadDynamicPPT: 动态 ppt 预加载

```js
默认`false`，类型：`boolean`
是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长。
```

### loggerOptions: 日志上报配置

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

允许修改的值:
```js
{
    disableReportLog?: boolean,
    reportLevelMask?: "debug" | "info" | "warn" | "error",
    printLevelMask?: "debug" | "info" | "warn" | "error";
}
```

### onlyCallbackRemoteStateModify

```js
默认`true`,类型：`boolean`，只对`room`有效。
`room`本地修改的内容，是否在`onRoomStateChange`中回调。
默认本地主动修改的状态，不会在`onRoomStateChange`回调中出现。
```

### zoomMaxScale:放大上限

用户可以放到的最大比例，默认不限制。  
开发者仍然可以使用代码进行放大。

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置。

### zoomMinScale:缩小下限

用户可以缩小的最小比例，默认不限制。  
开发者仍然可以使用代码进行缩小。

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置。