---
id: js-sdk
title: SDK参数
---

## 初始化 API

### TypeScript 方法签名

```TypeScript
//WhiteWebSdk.d.ts
constructor(params: WhiteWebSdkConfiguration = {})
```

### 示例代码

```javascript
//初始化 SDK
var whiteWebSdk = new WhiteWebSdk({
    appIdentifier: "{{appIdentifier}}"
    preloadDynamicPPT: false, // 可选,是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长
    deviceType: "touch", // 可选, touch or desktop , 默认会根据运行环境进行推断
    // ...更多可选参数配置
});
```

## 参数：

### TypeScript 签名

```Typescript
// WhiteWebSdk.d.ts
export declare type WhiteWebSdkConfiguration = {
    appIdentifier: string;
    useMobXState?: boolean;
    deviceType?: DeviceType;
    renderEngine?: RenderEngine;
    fonts?: UserFonts;
    handToolKey?: string;
    preloadDynamicPPT?: boolean;
    loggerOptions?: LoggerOptions;
    onlyCallbackRemoteStateModify?: boolean;
    plugins?: Plugins;
    pptParams?: PptParams;
    urlInterrupter?: (url: string)=>string;
    onWhiteSetupFailed?: (error: Error)=>void;
};
```

>所有参数均为可选，部分已有默认值。加粗为常用配置项目

### **urlInterrupter**: 图片替换

* TypeScript 签名

```typescript
urlInterrupter?: (url: string) => string;
```

```js
传入一个插入图片/ppt 时的原始地址，返回一个任意修改后的地址
```

>在插入图片和创建新场景背景图时，sdk 会调用该 API，此时可以修改最终显示的url。
>如果没有需要，请不要传入该参数。目前在绘制时，会频繁调用该 API。

### **deviceType**: 设备类型

* TypeScript 签名

```typescript
export enum DeviceType {
    Desktop = "desktop",//默认值
    Touch = "touch",    //移动端
    Surface = "surface",//同时监听所有移动事件
}
```

```js
值：`desktop`|`touch`|`surface`。

根据传入值，依次接受`mouse`事件，`touch`事件；传入`surface`时，则会同时接收`touch`,`mouse`事件。
```

`react` 用户可以使用 `react-device-detect` 手动判断平台，根据不同平台传入不同参数。

### **renderEngine**：渲染模式

默认值是 ``RenderEngine.SVG``。

TypeScript 签名：

```typescript
export enum RenderEngine {
    /** 以 svg 的形式渲染 */
    SVG = "svg",
    /** 以 canvas 的形式渲染 */
    Canvas = "canvas",
}
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
是否预先加载动态 PPT 中的图片，选择 true，会在第一页时，就加载所有图片，从而保证翻页时，能够立即显示图片。
```

>预加载进度回调，可以在初始化 room player 时，进行配置。可以查看[房间参数](./room.md)与[回放参数](./player.md)中 onPPTLoadProgress 配置。

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
```Typescript
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

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置`cameraBound`。
>2.9.0 该 API 不再支持该 API

### zoomMinScale:缩小下限

用户可以缩小的最小比例，默认不限制。
开发者仍然可以使用代码进行缩小。

>2.3.0 支持更高级 API，在初始化`room`，以及`player`时配置`cameraBound`。
>2.9.0 该 API 不再支持该 API

### **onWhiteSetupFailed**

白板在初始化时，会向服务器请求，由服务器返回连接配置，如果此时网络异常，会导致 SDK 配置失败，此时调用 SDK 加入房间、回放房间，会一直处于连接等待状态，而无任何响应。  
`onWhiteSetupFailed`会在白板向服务器请求连接配置失败时，主动回调。  
开发者在此时需要重新初始化 SDK（一般此时网络不稳定），然后再重新调用房间。

## 推荐阅读

1. [房间参数](./room.md)
1. [回放参数](./player.md)