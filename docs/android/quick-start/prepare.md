---
id: android-prepare
title: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

## 前提条件

1. Android Studio
1. API 18+

## 获取 sdkToken

阅读 [接入准备](/blog/2019/05/02/first-step)，注册账号，获取 sdk token。

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
    implementation 'com.github.duty-os:white-sdk-android:2.0.0'
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
