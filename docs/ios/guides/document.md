---
id: ios-document
title: Docs-conversion & replay
---

Before reading this article, please read the server-side documentation: [Document to Image](/docs/server/api/server-static-conversion), [Document to Web](/docs/server/api/server-dynamic-conversion) Make sure that the corresponding service has been activated at [console](https://console.herewhite.com).

The SDK encapsulates the interaction of the SDK server into a `WhiteConverter` class, and developers do not need to care about the interaction with the SDK server on the client.

## Show converted documents

For a pptx document, each page will correspond to a scene on the whiteboard.

A 24 page pptx file will create 24 scenes on a whiteboard. For scene concepts, see [Scene Management](/docs/ios/guides/ios-scenes).

```Objective-C
WhiteConverter *converter = [[WhiteConverter alloc] initWithRoomToken:self.roomToken];
[converter startConvertTask:@"url" type:ConvertTypeDynamic progress:^(CGFloat progress, WhiteConversionInfo * _Nullable info) {
    NSLog(@"progress:%f", progress);
} completionHandler:^(BOOL success, ConvertedFiles * _Nullable ppt, WhiteConversionInfo * _Nullable info, NSError * _Nullable error) {
    NSLog(@"success:%d ppt: %@ error:%@", success, [ppt yy_modelDescription], error);
    if (ppt) {
        [self.room putScenes:@"/dynamic" scenes:ppt.scenes index:0];
        [self.room setScenePath:@"/dynamic/1"];
    }
}];
```

## Dynamic PPT playback

You can play the dynamic PPT by calling the following method. After all the animations of the PPT on the current page are completed, when you call this method again, you will automatically enter the next page scene.

```javascript
[room pptNextStep]; // Next page（Next step）
[room pptPreviousStep]; // Previous page（Previous step）
```

## Custom font

If your pptx contains fonts that are not in our default font list, you can support it by configuring a custom font list. First, you need to upload the font file to your own server or object storage platform. Then, the URL of the font file is configured with the following code when the SDK is initialized.

```javascript
WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
config = @{@"Calibri": @"https://your-cdn.com/Calibri.ttf", 
            @"Songti": @"https://your-cdn.com/Songti.ttf",
            @"Kaiti": @"https://your-cdn.com/Kaiti.ttf"};
//When initializing the SDK, bring in config
```