---
id: server-static-conversion
title: Document to Picture
---

Static document conversion refers to the service of converting PPT, PPTX, Word, PDF and other format files into pictures. It is mainly to help customers insert presentation materials in whiteboards to assist online lectures or remote conferences. This function is provided by the SDK server and requires interaction with the server.

In the latest version, we have encapsulated this part of the interaction in the SDK. Developers only need to start the service in the background and configure the storage address. In the project, the `Converter` class (different platforms, slightly different names) For conversion.

1. The ideal number of pages is less than 50 pages, and documents with more than 100 pages may have a certain conversion timeout.
2. PDF, PPT, PPTX, Word, PDF conversion results are the most accurate.
3. The higher the resolution of the pictures referenced in the document, the slower the conversion speed.
4. The most popular picture formats are png and jpg.
5. If you find that the style expression is too inaccurate during the transcoding process, please export the pdf and re-convert.
6. The implementation of this function is based on [libreoffice](https://www.libreoffice.org/) Because libreoffice has a long history and complex code, it is difficult for us to deal with conversion bugs by ourselves. Therefore, the customer should do a full test before using it. If it does not meet the expectations, please use the three-party conversion service.

## Ready to work

### 1. According to [Configure Cloud Storage](/docs/blog/blog-add-driver) article, configure cloud storage in [console](https://console.herewhite.com)

### 2. Start the static document service on the management console

1. Enter [console], click <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> in the list on the left to enter the application management page.

2. Find "File to Picture" to activate, update QPS, and end the operation.

<details>
<summary>**Click to expand: operation diagram in console**</summary>

* Static document conversion initial state
![Static document initial state](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static0.png)

* Static document conversion management page
![Static document management page](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static1.png)

* Turn off static document conversion services
![Static document stop service](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/static2.png)

</details>

## API instructions for use

The static document conversion function consists of two APIs, "Initiate Conversion Task" and "Query Conversion Task"

### Initiate a conversion task

`POST /services/conversion/tasks`

> You can use sdk token on the server. The client-side encapsulation class requires the use of roomToken to avoid sdk token leakage.

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken or token | string | {{roomtoken}} or {{token}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
sourceUrl | stirng | Address of the file to be converted |
serviceType | string | Service type, static document conversion fixed to "static_conversion" |

> Before initiating the conversion task, please make sure that you have enabled the "Document to Picture" service on the console and configured the QPS upper limit to be greater than 0, otherwise the interface will report exceptions such as "Service not enable" and "Task waiting line is full"

* body example

```json
{
    "sourceUrl": "https://xxxx.xxx.xxx.com/xxxx.pptx",
    "serviceType": "static_conversion"
}
```

* response example

```JSON
{
    "code": 200,
    "msg": {
        "succeed": true,
        "reason": "",
        "taskUUID": "xxx6a660a6274c898b1689902734cxxx"
    }
}
```

task UUID is 32 bits in length and is the unique identifier of the conversion task

### Query Conversion Task

`GET /services/conversion/tasks/{{taskUUID}}/progress?serviceType=static_conversion`

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken or token | string | {{roomtoken}} or {{token}}|

* response example

```JSON
{
    "code": 200,
    "msg": {
        "task": {
            "convertStatus": "Finished",
            "reason": "",
            "totalPageSize": 3, // Total number of pages in the document
            "convertedPageSize": 3, // Document Completed Pages
            "convertedPercentage": 100, // Document conversion progress percentage
            "convertedFileList": [  // Document conversion result list
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/1.png"
                },
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/2.png"
                },
                {
                    "width": 1652,
                    "height": 2338,
                    "conversionFileUrl": "staticConvert/{{taskUUID}}/3.png"
                }
            ],
            "prefix": "https://xxxx.xxx.xxx.com/" // Document conversion result prefix
        }
    }
}
```

> 1. The static conversion task will return the width and height of each page, the unit of width and height is px, but because the number may be too large and the rendering is beyond the field of view when rendering in the whiteboard, the user can only use the proportion and customize the appropriate width or height
> 2. The use of "prefix" in the returned result is only valid when the conversion result is "Finished"
> 3. The conversion task requires users to poll the results, and the interval is recommended to be more than 3 seconds

`convertStatus` the following situations exist:

- Waiting: The task is waiting due to QPS reaching the upper limit, etc.
- Converting: Task in progress
- NotFound: No corresponding task information was found according to taskUUID
- Finished: Task execution completed and normal
- Fail: The task execution fails. When it fails, there will be a prompt reason

## SDK wrapper class use

> iOS Android 2.2.0 New API

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
import {WhiteWebSdk} from "white-web-sdk";
const whiteWebSdk = new WhiteWebSdk();
// Server authentication
const pptConverter = whiteWebSdk.pptConverter("input roomToken");


// 1. Call the member method convert of pptConverter to start transcoding
// 2、Convert parameter type reference PptConvertParams
type PptConvertParams = {
    readonly url: string; // Network address of the static document, please make sure it can be downloaded
    readonly kind: PptKind; // Document conversion type, static is PptKind.static (typescript) or "static" (javascript)
    readonly onProgressUpdated?: (progress: number) => void;
    readonly checkProgressInterval?: number;  // Polling interval
    readonly checkProgressTimeout?: number; // overtime time
};

// Request transcoding, get data for each page
res = await pptConverter.convert({
    // ppt address in cloud storage, note that you need to configure in the console
    url: pptURL,
    kind: "static",
    // Conversion progress monitoring
    onProgressUpdated: progress => {
        if (onProgress) {
            onProgress(PPTProgressPhase.Converting, progress);
        }
    },
});

// Data structure returned by convert
export type Ppt = {
    // Server-side, uuid of conversion task
    readonly uuid: string;
    readonly kind: PptKind;
    readonly width: number;
    readonly height: number;
    // Preview page address
    readonly slideURLs: ReadonlyArray<string>;
    // Ppt scene data format, using this property, you can directly insert a new scene page
    readonly scenes: ReadonlyArray<SceneDefinition>;
};

blog
room.putScenes(`/${filename}`, res.scenes);
room.setScenePath(`/${filename}/${res.scenes[0].name}`);
```
<!--iOS/Objective-C-->

```Objective-C
#import <WhiteSDK.h>
// See sdk  sdk WhiteConverter.h WhiteConversionInfo.h for detail
@implementation RoomCommandListController
- (void)convertStatic {
  WhiteConverter *converter = [[WhiteConverter alloc] initWithRoomToken:self.roomToken];
  [converter startConvertTask:@"Document url" type:ConvertTypeStatic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
      NSLog(@"progress:%f", progress);
  } completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
      NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
      if (ppt) {
          // Scene-related content, please refer to [Scene Management](/docs/advance/scenes.md) document for details
          [self.room putScenes:@"/static" scenes:ppt.scenes index:0];
          // First page
          [self.room setScenePath:@"/static/1"];
      }
  }];
}
@end
```

<!--Android/Java-->
```Java
Converter c = new Converter(this.roomToken);
c.startConvertTask("document url", Converter.ConvertType.Static, new ConverterCallbacks(){
    @Override
    public void onFailure(ConvertException e) {
        logAction("ppt fail");
    }

    @Override
    public void onFinish(ConvertedFiles ppt, ConversionInfo convertInfo) {
        if (ppt.getScenes() != null) {
            // Scene-related content, please refer to [Scene Management](/docs/advance/scenes.md) document for details
            room.putScenes("static", ppt.getScenes(), 0); 
            // First page
            room.setScenePath("static/1");
        }
    }

    @Override
    public void onProgress(Double progress, ConversionInfo convertInfo) {
        logAction(String.valueOf(progress));
    }
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Call diagram

![static_conversion_frame@2x](/img/static_conversion_frame@2x.png)
