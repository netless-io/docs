---
id: ios-rtc-audio-mixing
title: RTC 混音
---

当用户在 RTC 与白板的动态 PPT 同时使用时，可能会遇到以下问题：
1. native 上主播在打开 RTC 后发现 PPT 内的音视频变得小声
2. natvie 上主播在播放 PPT 上的音视频时发现有回声出现

为了解决这些问题，2.9.15 的白板内置了用于混音的 RTC 接口，用户在根据本章内容进行实现后可以避免这些问题。
> 如果用户使用的 RTC 提供商不支持混音本章内容将会无效

样例代码可以参考 [Whiteboard-iOS rtc 分支，RTC 文件夹内容](https://github.com/netless-io/Whiteboard-iOS/tree/rtc/Rtc)

> 本文中 RTC 使用 Agora SDK 作为实例，运行 demo 前请先在 `AppID.swift` 中配置好 AppId 

1. 实现`WhiteAudioMixerBridgeDelegate`协议。
1. 使用最新 whiteboard SDK，在初始化 `WhiteSDK` 时，传入实现`audioMixerBridgeDelegate`协议的对象。
1. 在 RTC `rtcEngine:localAudioMixingStateDidChanged:errorCode:`  回调中，主动调用 `WhiteSDK`的`audioMixer`属性中`setMediaState:errorCode:`方法，告知音视频状态更新完成。

## WhiteAudioMixerBridgeDelegate 协议实现内容

当白板动态 ppt 进行播放时，会在准备播放时，主动调用 `startAudioMixing:filePath:loopback:replace:cycle`API，开发者需要在此处主动调用 RTC sdk 的混音接口。
>在 iOS sdk 中存在一种情况：当该方法失败时，rtc SDK 不会主动调用 `rtcEngine:localAudioMixingStateDidChanged:errorCode:` 所以，无法当该值为非 0 数值时，开发者需要直接在此处代码直接调用 `audioMixer`的`setMediaState:errorCode:`方法进行传递，将非零返回值传入 errorCode，stateCode 随意填写即可。

```Swift
extension VideoChatViewController: WhiteAudioMixerBridgeDelegate {
    func startAudioMixing(_ filePath: String, loopback: Bool, replace: Bool, cycle: Int) {
        // 现阶段 iOS 端 rtc 不支持对线上 mp4 文件进行混音。该类文件混音，会出现跳转失败导致混音效果消失的问题。
        // 如果是 线上 mp4 地址，请提前使用 动态 ppt 资源包下载，或者将 mp4 尾缀，更换为 m4a 进行播放。
        // 该 filePath 路径会收到初始化 SDK 时，pptParams 中的 scheme 参数影响。请自行恢复。
        let result:Int32 = agoraKit.startAudioMixing(filePath, loopback: true, replace: false, cycle: 1)
        print("\(#function) \(filePath) \(loopback) \(replace) \(cycle) result:\(result)")
        if result != 0 {
            self.whiteSdk!.audioMixer?.setMediaState(714, errorCode: Int(result))
        }
    }

    func stopAudioMixing() {
        let result:Int32 = agoraKit.stopAudioMixing()
        print("\(#function) result:\(result)")
        if result != 0 {
            self.whiteSdk!.audioMixer?.setMediaState(0, errorCode: Int(result))
        }

    }

    func setAudioMixingPosition(_ position: Int) {
        print("position: \(position)")
        let result: Int32 = agoraKit.setAudioMixingPosition(position)
        print("\(#function) result:\(result) position: \(position)")
        if result != 0 {
            self.whiteSdk!.audioMixer?.setMediaState(0, errorCode: Int(result))
        }
    }
}

extension VideoChatViewController: AgoraRtcEngineDelegate {
    ...
    
    func rtcEngine(_ engine: AgoraRtcEngineKit, localAudioMixingStateDidChanged state: AgoraAudioMixingStateCode, errorCode: AgoraAudioMixingErrorCode) {
        print("localAudioMixingStateDidChanged: \(state.rawValue) errorCode: \(errorCode.rawValue)")
        if let sdk = self.whiteSdk {
            sdk.audioMixer?.setMediaState(state.rawValue, errorCode: errorCode.rawValue)
        } else {
            print("sdk not init !")
        }
    }
    
    ...    
}
```

以上内容，可在`VideoChatViewController.swift`项目中进行查看。

## 混音 API 限制

1. rtc 目前对于线上 mp4 混音效果不佳，当进行跳转时，会出现混音消失的情况。请提前下载对应 mp4，或者预先转换出同地址 mp3 用于混音使用。
2. 由于 RTC 混音限制，目前同一时间只可能有一个音视频进行混音，即当一个音频开始混音时其他音频会自动停止
3. 由于 RTC 混音限制，用户在点击音视频的开始播放按钮到真正开始播放音视频之间会有 3 秒以内的延时
4. 由于 RTC 混音限制，目前用户无法在 web 环境下使用混音功能，如果主播使用 web 客户端而听众使用 native 客户端进行混音，那么仍然可能会有回声问题出现，请确保主播及听众都使用 native 客户端