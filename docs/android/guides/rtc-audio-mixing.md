---
id: android-rtc-audio-mixing
title: RTC 混音
---

当用户在 RTC 与白板的动态 PPT 同时使用时，可能会遇到以下问题：
1. native 上主播在打开 RTC 后发现 PPT 内的音视频变得小声
2. natvie 上主播在播放 PPT 上的音视频时发现有回声出现

为了解决这些问题，2.9.15 的白板内置了用于混音的 RTC 接口，用户在根据本章内容进行实现后可以避免这些问题。
> 如果用户使用的 RTC 提供商不支持混音本章内容将会无效

样例代码可以参考 [Android-demo](https://github.com/duty-os/white-demo-android)

> 本文中 RTC 使用 Agora Android SDK 作为实例，运行 demo 前请先在 strings.xml 中配置好 rtc_app_id 参数

# 实现 AudioMixerBridge

用户需要实现 com.herewhite.sdk.AudioMixerBridge 类，该类用于桥接 native sdk 与用户引用的 RTC 客户端。

![AudioMixerBridge](/img/audio-mixer-bridge.png)

PPT 内部在触发播放事件前会调用 AudioMixerBridge 接口方法，通过用户的实现类调用到 RTC 的混音相关方法。

AudioMixerBridge 的实现例子如下（具体方法说明请参考 AudioMixerBridge 接口注释）：

```java
public class AudioMixerBridgeImpl implements AudioMixerBridge {
    private RtcEngine rtcEngine;
    public AudioMixerBridgeImpl(RtcEngine rtcEngine) {
        this.rtcEngine = rtcEngine;
    }
    @Override
    public void startAudioMixing(String filepath, boolean loopback, boolean replace, int cycle) {
        rtcEngine.startAudioMixing(filepath, loopback, replace, cycle);
    }

    @Override
    public void stopAudioMixing() {
        rtcEngine.stopAudioMixing();
    }

    @Override
    public void setAudioMixingPosition(int position) {
        rtcEngine.setAudioMixingPosition(position);
    }
}
```

# 初始化 sdk

在 2.9.15 后的 white sdk 初始化方法中多了一个可选参数 AudioMixerBridge audioMixerBridge。用户如果要使用 RTC 混音功能需要在初始化 sdk 前将 AudioMixerBridge接口实现传入到该方法中：

```java
new WhiteSdk(xxx, xxx, xxx, new CommonCallbacks() {
                    .... 
                }, 
                // 如果用户需要用到 rtc 混音功能来解决回声和声音抑制问题，那么必须要在 whiteSDK 之前初始化 rtcEngine
                // AudioMixerBridgeImpl 在传入 sdk 后，ppt 内的音视频就全部使用 rtc 混音的方式播放
                new AudioMixerBridgeImpl(rtcEngine));
```
其中 rtcEngine 是用户引入的 RTC 服务客户端对象，需要在该步骤前初始化完毕。

# 混音状态回调
RTC 客户端需要有混音状态回调提示，在该回调方法中调用 sdk 中的混音状态变化方法来通知 PPT 是否该进行视频播放。
如果 RTC 客户端没有相关回调会造成 PPT 的视频音画不同步问题。

```java
IRtcEngineEventHandler mRtcEventHandler = new IRtcEngineEventHandler() {
        ... 

        @Override
        // 混音状态变化时的回调
        public void onAudioMixingStateChanged(int state, int errorCode) {
            if (whiteSdk != null) {
                /**
                * 混音 API 完成后的状态回调
                * @param state 混音状态
                *  710: 成功调用 startAudioMixing 或 resumeAudioMixing
                *  711: 成功调用 pauseAudioMixing
                *  713: 成功调用 stopAudioMixing
                *  714: 播放失败，error code 会有具体原因,
                * @param errorCode 当播放失败时，该值有意义
                */
                whiteSdk.getAudioMixerImplement().setMediaState(state, errorCode);
            }
        }
    };
```

# 限制和注意事项

1. 在混音开始前请保证用户已经连进了 RTC 频道，否则 PPT 将没有声音
2. 混音后音频走的是通话音量控制而不是媒体音量控制，如果发现声音过小请确认通话音量是处于公放状态
3. 由于 RTC 混音限制，目前同一时间只可能有一个音视频进行混音，即当一个音频开始混音时其他音频会自动停止
4. 由于 RTC 混音限制，用户在点击音视频的开始播放按钮到真正开始播放音视频之间会有 3 秒以内的延时
5. 由于 RTC 混音限制，目前用户无法在 web 环境下使用混音功能，如果主播使用 web 客户端而听众使用 native 客户端进行混音，那么仍然可能会有回声问题出现，请确保主播及听众都使用 native 客户端
