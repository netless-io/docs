---
id: js-document
title: Document conversion
---

## Prerequisite

The SDK server provides two ways to convert most documents into resources available on the whiteboard:

1. [Document to image: word, pdf, ppt, pptx -> static conversion](server/api/static-conversion.md)
1. [Document to Web: pptx -> dynamic conversion](server/api/dynamic-conversion.md)

Make sure to enable the corresponding conversion service in the [console](https://console.herewhite.com).

## Conversion task

> The conversion service is actually a splicing of several network requests, passing the network visible address to the sdk server, and polling the request.  
> Inside the SDK, the conversion task processing has been encapsulated into a `pptConverter` class. Developers do not need to care about interacting with the sdk side. For dynamic and static conversion, they only need to confirm that the incoming url file type and conversion type match.

### Typescript signature

```typescript
export type PptConvertParams = {
    // Translate resource address
    readonly url: string;
    // Conversion type
    readonly kind: PptKind;
    // Upload callback, optional parameter. Conversion progress, range: 0-1.
    readonly onProgressUpdated?: (progress: number) => void;
    // Frequency of progress check, milliseconds. Optional parameter, default is 1.5 seconds.
    readonly checkProgressInterval?: number;
    // Timeout, milliseconds. Optional parameter, default is 5 minutes.
    readonly checkProgressTimeout?: number;
};

// Conversion task type
export enum PptKind {
    // Static，word，ppt，pdf，pptx
    Static = "static",
    // Dynamic, pptx to webpage
    Dynamic = "dynamic",
}

// Whiteboard page structure
export type SceneDefinition = {
    readonly name?: string;
    readonly ppt?: PptDescription;
};

// Whiteboard background image (ppt) structure
export type PptDescription = {
    readonly src: string;
    readonly width: number;
    readonly height: number;
};

// Conversion result
export type Ppt = {
    readonly uuid: string;
    readonly kind: PptKind;
    readonly width: number;
    readonly height: number;
    readonly slideURLs: ReadonlyArray<string>;
    // Array of whiteboard pages (scenes), the format has been matched, you can directly call the putScenes API of room to insert the whiteboard page
    readonly scenes: ReadonlyArray<SceneDefinition>;
};

// Conversion interface
export interface PptConverter {
    convert(params: PptConvertParams): Promise<Ppt>;
}
```

### Sample code

```typescript
import {WhiteWebSdk} from "white-web-sdk";
const whiteWebSdk = new WhiteWebSdk();
// roomToken Authentication use
const pptConverter = whiteWebSdk.pptConverter("输入 roomToken");
// Request transcoding, get data for each page
res = await pptConverter.convert({
    // The network address of the resource that needs to be converted, please ensure that it can be accessed normally
    url: pptURL,
    // Conversion type
    kind: "static" | "dynamic", 
    // Conversion progress monitoring
    onProgressUpdated: progress => {
      console.log(progress);
    },
    checkProgressInterval: 1500,
    checkProgressTimeout: 5 * 60 * 1000,
});

// If you are not satisfied with the picture size in the newly added whiteboard page, you can rebuild a scenes array by yourself, modify the width and height

// For more information on putScenes, setScenePath, please read the [Page (Scene) Management] document
// Stuff the conversion results into the ppt directory. If you want to insert multiple conversion tasks in one room, please choose a different directory name
room.putScenes(`/ppt`, res.scenes);
// The put API just adds a whiteboard and does not actively switch. You need to actively set to the exact path through setAPI.
room.setScenePath(`/ppt/${res.scenes[0].name}`);
```

## Dynamic PPT API

### Animation forward and backward

Use the following API to control dynamic ppt page animation.

```javascript
room.pptNextStep(); // Next step (next page)
room.pptPreviousStep() // Previous Step(previous step)
```

When the ppt animation of the current page has been completely executed, when you call `room.pptNextStep` again, you will automatically enter the next dynamic ppt page. `room.pptPreviousStep ()` has a similar effect.

### Custom font

In `pptx`, if an unconventional font (paid font) is included, the developer can configure a custom font mapping to support it during initialization. 
The API requires a network address, and the developer needs to upload the font file to the developer's own business server or cloud storage. Then when initializing `sdk`, pass in` fonts` field.

```javascript
const whiteWebSDK = new WhiteWebSdk({
  // ... other configuration items
  fonts: {
    "Calibri": "https://your-cdn.com/Calibri.ttf",
    "Songti": "https://your-cdn.com/Songti.ttf",
    "Kaiti": "https://your-cdn.com/Kaiti.ttf",
	},
});
```