---
id: android-document
title: 文档转换，动态PPT
---

阅读本文前，请先阅读 server 端文档: [文档转图片](/docs/server/overview/server-static-conversion)、[文档转网页](/docs/server/overview/server-dynamic-conversion)，确保已经在 [console](https://console.netless.link) 开通对应服务。

SDK 将于 SDK 服务器的交互封装成了 `Converter` 类，开发者无需在客户端关心与 SDK 服务器端的交互。

## 展示转换后文档

对于 pptx 文档而言，每一页都将与白板的一个场景对应。

一个有 24 页的 pptx 文件，将在白板上创建 24 个场景。关于场景概念，详情请见 [场景管理](/docs/android/guides/android-scenes)。

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

## 动态 PPT 动画/翻页

你可以通过调用如下方法来播放动态 PPT，当当前页面 PPT 的动画全部执行完成后，再次调用该方法时，会自动进入下一页场景。

```javascript
room.pptNextStep(); // 下一页（下一步）
room.pptPreviousStep(); // 上一页（上一步）
```

## 动态 PPT 音视频通知

>2.9.13 新增 API

`WhiteSdk`新增`commonCallbacks`属性，在设置`commonCallbacks`后，动态 ppt 中的音视频播放，都会回调对应的方法。

```Java
/**
 * 部分通用回调，不管是回放房间，还是实时房间，都有该部分通知
 * @since 2.9.13
 */
public interface CommonCallbacks {

    /**
     *  当sdk出现未捕获的全局错误时，会在此处抛出
     * @param args
     */
    void throwError(Object args);

    /**
     * 动态 ppt 中的音视频媒体，播放通知
     */
    void onPPTMediaPlay();

    /**
     * 动态 ppt 中的音视频媒体，暂停通知
     */
    void onPPTMediaPause();
}
```

## 自定义字体

如果你的 pptx 中包含了不属于我们默认字体列表中的字体，你可以通过配置自定义字体列表来支持。首先，你需要将字体文件上传到你自己的服务器或对象存储平台。然后，将字体文件的 URL 在 sdk 初始化时以如下代码配置。

```Java
WhiteSdkConfiguration config = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
HashMap<String, String> map = new HashMap();
map.put("Calibri", "https://your-cdn.com/Calibri.ttf");
map.put("宋体","https://your-cdn.com/Songti.ttf");
map.put("楷体",  "https://your-cdn.com/Kaiti.ttf");
//初始化 SDK 时，带入 config
sdkConfiguration.setFont(map);
```
