---
id: server-dynamic-conversion
title: Document to Web
---

Dynamic document conversion is a service that converts files in pptx format into web pages.

## List of Features Not Supported by Document to Web

The pptx features currently known to be unsupported are as follows:

1. wps files are not supported, and files converted from wps to pptx are not guaranteed to parse successfully
2. Does not support gradient rendering
3. The punctuation at the end of the text line is not supported beyond the text box (will cause word wrap)
4. Does not support word art
5. Charts such as histograms are not supported
6. Graphics created through the SmartArt feature are not supported
7. Does not support transition effects when page switching
8. Text animation and action drawing are not supported (that is, one animation per line in the text box)
9. Does not support images in emf or wmf format
10. Does not support most animation effects such as dissolve, checkerboard, etc. Currently only fade-in and fade-out effects are available.
11. If the conversion result font is missing, you can use the custom font function in SDK or contact us

Document to web page is undergoing research and development iterations, and the above list will be continuously updated

> Compared to static document conversion, dynamic document conversion retains the sequence animation in the ppt file and provides switching control functions.
> The dynamic `ppt` is based on the` Microsoft Office` specification and cannot guarantee that WPS files can be parsed correctly.

## Ready to work

### 1. According to the [Configure Cloud Storage](/docs/blog/blog-add-driver) article, configure Cloud Storage in [console](https://console.herewhite.com)

### 2. Enable dynamic document service on the management console

1. Enter [console](https://console.herewhite.com), click <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> in the list on the left to enter the application management page.

2. Find "File to Picture" to activate, update QPS, and end the operation.

<details>
<summary>**Click to expand: operation diagram in console**</summary>

* Dynamic Document Conversion Initial State
![Dynamic Document Conversion Initial State](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic0.png)

* Dynamic document conversion management page
![Dynamic document conversion management page](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic1.png)

* Turn off dynamic document conversion services
![Turn off dynamic document conversion services](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/dynamic2.png)

</details>


## Server API

The dynamic document conversion function consists of two APIs, "Initiate Conversion Task" and "Query Conversion Task"

### Initiate a conversion task

`POST /services/conversion/tasks`

> You can use "sdk token" on the server. The client-side encapsulation class requires the use of "roomToken" to avoid "sdk token" leakage.

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken or token | string | {{roomtoken}} or {{token}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
sourceUrl | stirng | Address of the file to be converted |
serviceType | string | Service type, dynamic document conversion fixed to "dynamic_conversion" |

* body

```json
{
    // Make sure the file is downloadable
    "sourceUrl": "https://xxxx.xxx.xxx.com/xxxx.pptx",
    "serviceType": "dynamic_conversion"
}
```

* response

> Before starting the conversion task, please make sure that you have enabled the "Document to Web Page" service on [console](https://console.herewhite.com)  and configured the QPS upper limit to be greater than 0, otherwise the interface will report "Service not enable", and "Task waiting line is full".

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
The task UUID is 32 bits in length and is the unique identifier for the conversion task. This task needs to be used as a query in subsequent requests.

### Query conversion task progress

`GET /services/conversion/tasks/{{taskUUID}}/progress?serviceType=dynamic_conversion`

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken or token | string | {{roomtoken}} or {{token}}|

* response

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
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide1.xml"
                },
                {
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide2.xml"
                },
                {
                    "width": 960,
                    "height": 720,
                    "conversionFileUrl": "dynamicConvert/{{taskUUID}}/slide/slide3.xml"
                }
            ],
            "prefix": "pptx://xxxx.xxx.xxx.com/" // Document conversion result prefix
        }
    }
}
```

> 1. The dynamic conversion task will return the width and height of each page. The width and height unit is px.
> 2. The user uses "prefix" in the returned result only if the conversion result is "Finished"
> 3. The conversion task requires users to poll the results, and the interval is recommended to be more than 3 seconds

`convertStatus` The following situations exist:
- Waiting: The task is waiting due to QPS reaching the upper limit, etc.
- Converting: Task in progress
- NotFound: No corresponding task information was found according to taskUUID
- Finished: Task execution completed and normal
- Fail: The task execution fails. When it fails, there will be a prompt reason

### Available SDK data

After obtaining the conversion results, you need to perform splicing and conversion to the scene data available to the SDK.

This part can be spliced ​​by the client or assembled on the server and sent to the client in JSON format.

#### 1. Leave it to the client for splicing

The `json`,` taskId`, and `prefix` of the conversion result are transferred to the client for splicing. (Recommended, because the client still needs to be converted to the scene class supported by SDK for passing in)

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```javascript
// info The response returned for the conversion result
const count = info.totalPageSize;
const scenes: {name: string, ppt: PptDescription}[] = [];
const ppts = info.convertedFileList;
for (let i = 0; i < ppts; ++ i) {
    const url = `${prefix}${ppts[i].conversionFileUrl}`;
    slideURLs[i] = url;
    scenes[i] = {
        // Please use strings
        name: `${i + 1}`,
        ppt: {src: url, width: info.width, height: info.height},
    };
}
// "scenes" is the data format supported by the whiteboard
```
<!--iOS/Objective-C-->
```Objective-C
// response return value for the conversion result
NSInteger count = [response[@"totalPageSize"] integerValue];
NSArray *ppts = response[@"convertedFileList"];
NSMutableArray<WhiteScene *> *scenes = [NSMutableArray arrayWithCapacity:count];

for (int i = 0; i < ppts; i++) {
    NSDictionary *dict = ppts[i];
    WhitePptPage *pptPage = [[WhitePptPage alloc] init];
    pptPage.src = [NSString stringWithFormat:@"%@%@", prefixUrl ? : @"", dict[@"conversionFileUrl"]];
    pptPage.width = [response[@"width"] doubleValue];
    pptPage.height = [response[@"height"] doubleValue];
    WhiteScene *scene = [[WhiteScene alloc] initWithName:[NSString stringWithFormat:@"%d", i+1] ppt:pptPage];
    [scenes addObject:scene];
}
// scenes 数组，即为白板支持的数据格式。iOS 端接收到 JSON 后，可以主动转换为 WhiteScenes
// "scenes" array, which is the data format supported by the whiteboard. After receiving the JSON on the iOS side, it can be actively converted to "WhiteScenes"
```
<!--Android/Java-->
```Java
// json is the json returned by the query results API
Integer count = json.get("totalPageSize").getAsInt();
JsonArray ppts = json.get("convertedFileList").getAsJsonArray();
Scene[] scenes = new Scene[count];

for (int i = 0; i < ppts.size(); i++) {
    PptPage pptPage = new PptPage(String.valueOf(i+1), json.get("width").getAsDouble(), json.get("height").getAsDouble());
    JsonObject object = array.get(i).getAsJsonObject();
    pptPage.setSrc(prefix + object.getAsJsonObject("conversionFileUrl").getAsString());
    sliderURLs[i] = pptPage.getSrc();
    scenes[i] = new Scene(String.valueOf(i+1), pptPage);
}
// "scenes" array, which is the data format supported by the whiteboard. After receiving JSON on Android, you need to actively convert
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### 2. Convert to JSON and send to client

```JSON
scenes: [
    {
        // name can be a string
        "name" : "1",
        // height, width is the width and height returned in info
        "height" : {info.heigh},
        "width" : {info.width},
        // The numerical index value is 1, the first page is slide1.xml, and the second page is slide2.xml
        "src" : {prefix}/{taskId}/slide/slide1.xml
    },
    {
        // name can be a string
        "name" : "2",
        // height, width is the width and height returned in info
        "height" : ${info.heigh},
        "width" : ${info.width},
        // The numerical index value is 1, the first page is slide1.xml, and the second page is slide2.xml
        "src" : {prefix}/{taskId}/slide/slide2.xml
    }
]
```

## SDK package class use

### Using the conversion API

>iOS Android 2.2.0 new API

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
import {WhiteWebSdk} from "white-web-sdk";
const whiteWebSdk = new WhiteWebSdk();
// server authentication
const pptConverter = whiteWebSdk.pptConverter("input roomToken");


// 1. Call the member method convert of pptConverter to start transcoding
// 2. Convert parameter type reference PptConvertParams
type PptConvertParams = {
    readonly url: string; // Network address of the static file, please make sure it can be downloaded
    readonly kind: PptKind; // Document conversion type, static is PptKind.static (typescript) or "static" (javascript)
    readonly onProgressUpdated?: (progress: number) => void;
    readonly checkProgressInterval?: number;  // polling interval
    readonly checkProgressTimeout?: number; // overtime time
};

// Request transcoding to get data for each page
res = await pptConverter.convert({
    // ppt address in cloud storage, note that it needs to be configured in the console
    url: pptURL,
    kind: "dynamic", 
    // conversion progress monitoring
    onProgressUpdated: progress => {
        if (onProgress) {
            onProgress(PPTProgressPhase.Converting, progress);
        }
    },
});

// data structure returned by convert
export type Ppt = {
    // server side, uuid of conversion task
    readonly uuid: string;
    readonly kind: PptKind;
    readonly width: number;
    readonly height: number;
    // Preview page address
    readonly slideURLs: ReadonlyArray<string>;
    // ppt scene data format, using this property, you can directly insert a new scene page
    readonly scenes: ReadonlyArray<SceneDefinition>;
};

blog
room.putScenes(`/${filename}`, res.scenes);
room.setScenePath(`/${filename}/${res.scenes[0].name}`);
```
<!--iOS/Objective-C-->

```Objective-C
#import <WhiteSDK.h>
// See details sdk WhiteConverter.h WhiteConversionInfo.h
@implementation RoomCommandListController
- (void)convertStatic {
  WhiteConverter *converter = [[WhiteConverter alloc] initWithRoomToken:self.roomToken];
  [converter startConvertTask:@"Document url" type:ConvertTypeDynamic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
      NSLog(@"progress:%f", progress);
  } completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
      NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
      if (ppt) {
          // Scene-related content, please refer to [Scene Management](/docs/advance/scenes.md) document for details
          [self.room putScenes:@"/dynamic" scenes:ppt.scenes index:0];
          // First page
          [self.room setScenePath:@"/dynamic/1"];
      }
  }];
}
@end
```

<!--Android/Java-->
```Java
Converter c = new Converter(this.roomToken);
c.startConvertTask("Document url", Converter.ConvertType.Dynamic, new ConverterCallbacks(){
    @Override
    public void onFailure(ConvertException e) {
        logAction("ppt fail");
    }

    @Override
    public void onFinish(ConvertedFiles ppt, ConversionInfo convertInfo) {
        if (ppt.getScenes() != null) {
            // Scene-related content, please refer to [Scene Management](/docs/advance/scenes.md) document for details
            room.putScenes("dynamic", ppt.getScenes(), 0); 
            // First page
            room.setScenePath("dynamic/1");
        }
    }

    @Override
    public void onProgress(Double progress, ConversionInfo convertInfo) {
        logAction(String.valueOf(progress));
    }
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### 进度顺序切换

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```javascript
room.pptNextStep(); // Next page(Next step)
room.pptPreviousStep() // Previous step (previous step)
```
<!--iOS/Objective-C-->
```Objective-C
[room pptNextStep]; // Next page(Next step)
[room pptPreviousStep]; // Previous step (previous step)
```
<!--Android/Java-->
```Java
room.pptNextStep(); // Next page(Next step)
room.pptPreviousStep(); // Previous step (previous step)
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Show results

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/netless_pptx.mp4">
</video>
