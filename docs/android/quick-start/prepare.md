---
id: android-prepare
title: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

## 前提条件

1. Android Studio
1. API 18+

## 创建 sdk 账号，并获取 sdkToken

1. 进入 [console](https://console.herewhite.com) ，注册账号。
1. 点击左侧导航栏 <svg viewBox="64 64 896 896" class="" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg> 
1. 进入用户中心后，找到 密钥管理 ，点击 Token右侧的 <svg viewBox="64 64 896 896" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg> 按钮，获取完整的 token。

## 添加 SDK 到项目中

### 配置 build.gradle

打开根目录下的 build.gradle 进行如下标准配置：

```plain
allprojects {
    repositories {
        jcenter()
        maven { url 'https://jitpack.io' }
    }
}
```

然后打开 app 目录下的 build.gradle 进行如下配置：

```plain
dependencies {
    compile 'com.github.duty-os:white-sdk-android:2.0.0-beta10'
    # 使用动态 ppt 功能的用户，请暂时使用 2.0.0-ppt 功能
}
```

* 这时你会看到 Android Studio 在编辑器的顶部有一行提示 

`gradle files have changed since last project sync. a project sync may be necessary for the IDE to work properly` 

* 点击 `Sync Now` 按钮后提示变为 `Gradle project sync in process...` ，稍等一段时间（依你的网络环境而定）后提示消失，则集成完毕。

### Proguard 配置

```shell
# SDK model
-keep class com.herewhite.** { *; }
-keepattributes  *JavascriptInterface*
-keepattributes Signature 
# Gson specific classes 
-keep class sun.misc.Unsafe { *; } 
-keep class com.google.gson.stream.** { *; } 
# Application classes that will be serialized/deserialized over Gson 
-keep class com.google.gson.examples.android.model.** { *; }
-keep class com.google.gson.** { *;}
```
