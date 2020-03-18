---
id: js-sdk
title: SDK parameters
---

## Initialize the API

### TypeScript

```TypeScript
// WhiteWebSdk.d.ts
constructor(params: WhiteWebSdkConfiguration = {})
```

### Sample code

```javascript
// Initialize the SDK
var whiteWebSdk = new WhiteWebSdk({
    preloadDynamicPPT: false, // Optional, whether to pre-load pictures in dynamic PPT will significantly improve user experience and reduce page loading time
    deviceType: "touch", // Optional, touch or desktop, inferred based on the operating environment by default
    // ... More optional parameter configuration
});
```

## Parameter

### TypeScript signature

```Typescript
// WhiteWebSdk.d.ts
export type WhiteWebSdkConfiguration = {
    readonly deviceType?: DeviceType;
    readonly screenType?: ScreenType;
    readonly renderEngine?: RenderEngine;
    readonly fonts?: UserFonts;
    readonly handToolKey?: string;
    readonly preloadDynamicPPT?: boolean;
    readonly loggerOptions?: LoggerOptions;
    readonly reconnectionOptions?: Partial<ReconnectionOptions> | false;
    readonly onlyCallbackRemoteStateModify?: boolean;
    readonly plugins?: Plugins;
    readonly urlInterrupter?: (url: string) => string;
};
```

> All parameters are optional and some have default values. Bold for common configuration items

### **urlInterrupter**: Picture replacement

* TypeScript signature

```typescript
urlInterrupter?: (url: string) => string;
```

```js
Pass in the original address when inserting a picture / ppt, and return an arbitrarily modified address
```

> When inserting an image and creating a new scene background image, SDK will call this API, and at this time, you can modify the final displayed URL.
> If not required, do not pass in this parameter. This API is frequently called when drawing.

### **deviceType**: Equipment type

* TypeScript signature

```typescript
export enum DeviceType {
    Desktop = "desktop",
    Touch = "touch",
    Surface = "surface",
}
```

```js
value: `desktop`|`touch`|`surface`。

By default, it will infer whether it is `desktop` or` touch` according to the operating environment.
According to the incoming value, the `mouse` event and the` touch` event are received in turn. When the `surface` is passed in, the` touch` and `mouse` events are received at the same time.
```

### **renderEngine**: rendering mode

The default value is `RenderEngine.SVG`.

TypeScript signature:

```typescript
export enum RenderEngine {
    / ** Render as svg * /
    SVG = "svg",
    / ** Render as canvas * /
    Canvas = "canvas",
}
```

### fonts: ppt Map font

```js
Type structure: `{key: url}`

Custom font mapping required for dynamic ppt, `key` is the font name used by dynamic ppt, and` url` is the network address where the dictionary is located.
```

### **handToolKey**: Hand tool shortcuts

```js
Type: `string`
After setting, the user can move the entire whiteboard by pressing the shortcut key and the mouse at the same time.
You can enter the `key` property that can be triggered by the` KeyboardEvent` keyboard event. It is recommended to pass in the space bar (`" "`)
```

### preloadDynamicPPT: Dynamic ppt preloading

```js
Default `false`, type:` boolean`
Whether to load the pictures in the dynamic PPT in advance. Selecting true will load all pictures on the first page, so that the pictures can be displayed immediately when the page is turned.
```

> Preload progress callback, which can be configured when the room player is initialized. You can view the onPPTLoadProgress configuration in the [room parameters](./room.md) and [playback parameters](./player.md).

### loggerOptions: Log report configuration

Defaults:

```js
{
    // Whether to disable upload, default upload
    disableReportLog: false,
    // Upload log level, default info
    reportLevelMask: "info",
    // Print log level, default info
    printLevelMask: "info";
}
```

Allowed values:

```Typescript
{
    disableReportLog?: boolean,
    reportLevelMask?: "debug" | "info" | "warn" | "error",
    printLevelMask?: "debug" | "info" | "warn" | "error";
}
```

### onlyCallbackRemoteStateModify

```js
Default `true`, type:` boolean`, only valid for `room`.
Whether the locally modified content in `room` is called back in` onRoomStateChange`.
The state that is actively modified by default will not appear in the `onRoomStateChange` callback.
```

### zoomMaxScale: Zoom limit

The maximum ratio that the user can put, the default is not limited.  
Developers can still zoom in using code.

> 2.3.0 supports more advanced APIs, which are configured when `room` and `player` are initialized.

### zoomMinScale: reduce the lower limit

The minimum ratio that the user can reduce, the default is not limited.
Developers can still use code to scale down.

> 2.3.0 supports more advanced APIs, which are configured when `room` and `player` are initialized.

## Recommended reading

1. [Room parameters](./room.md)
1. [Playback parameters](./player.md)
