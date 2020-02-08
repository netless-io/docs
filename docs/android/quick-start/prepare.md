---
id: android-prepare
title: Client integration
---

This article describes the development environment that needs to be prepared before using the whiteboard SDK formally.

## Prerequisite

1. Android Studio
1. API 18+

## Get sdkToken

Read [Access Preparation](/docs/blog/blog-begin-netless/), register an account, and get the sdk token.

## Add SDK to the project

### Configuration build.gradle

Open build.gradle in the root directory and perform the following standard configuration:

```plain
allprojects {
    repositories {
        jcenter()
        maven { url 'https://jitpack.io' }
    }
}
```

Then open build.gradle in the app directory and configure it as follows:

```plain
dependencies {
    implementation 'com.github.duty-os:white-sdk-android:2.4.0'
}
```

* At this point you will see a line prompt in Android Studio at the top of the editor

`gradle files have changed since last project sync. a project sync may be necessary for the IDE to work properly` 

* After clicking the `Sync Now` button, the prompt changes to` Gradle project sync in process ... `. After a while (depending on your network environment), the prompt disappears, and the integration is complete.

### Proguard configuration

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
