---
id: android-document
title: Doc-conversion & replay
---

Before reading this article, please read the server-side documentation: [Document to Picture](/docs/server/api/server-static-conversion), [Document to Web Page](/docs/server/api/server-dynamic-conversion), and make sure that the corresponding service has been activated in [console](https://console.netless.link).

The SDK encapsulates the interaction of the SDK server into a `Converter` class. Developers do not need to care about the interaction with the SDK server on the client.

## Show converted documents

For a pptx document, each page will correspond to a scene on the whiteboard.

A 24 page pptx file will create 24 scenes on a whiteboard. For the concept of the scene, see [Scene Management](/docs/android/guides/android-scenes) for details.

```Java
Converter c = new Converter(this.roomToken);
c.startConvertTask("{pptx url}", Converter.ConvertType.Dynamic, new ConverterCallbacks(){
    @Override
    public void onFailure(ConvertException e) {

    }

    @Override
    public void onFinish(ConvertedFiles ppt, ConversionInfo convertInfo) {
        if (ppt.getScenes() != null) {
            room.putScenes("dynamic", ppt.getScenes(), 0);
            room.setScenePath("dynamic/1");
        }
    }

    @Override
    public void onProgress(Double progress, ConversionInfo convertInfo) {

    }
});
```

## Dynamic PPT playback

You can play the dynamic PPT by calling the following method. After all the animations of the PPT on the current page are completed, when you call this method again, you will automatically enter the next page scene.

```javascript
room.pptNextStep(); // Next page (Next step)
room.pptPreviousStep(); // Previous page (Previous step)
```

## Custom font

If your pptx contains fonts that are not in our default font list, you can support it by configuring a custom font list. First, you need to upload the font file to your own server or object storage platform. Then, the URL of the font file is configured with the following code when the SDK is initialized.

```Java
WhiteSdkConfiguration config = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
HashMap<String, String> map = new HashMap();
map.put("Calibri", "https://your-cdn.com/Calibri.ttf");
map.put("宋体","https://your-cdn.com/Songti.ttf");
map.put("楷体",  "https://your-cdn.com/Kaiti.ttf");
// When initializing the SDK, bring in config
sdkConfiguration.setFont(map);
```