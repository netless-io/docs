---
id: android-init-sdk
title: 初始化
---

在初始化 SDK 前，请确保已经完成注册账号获取 token，集成安装包等操作，详见 [集成客户端](./prepare.md)。

## 添加 UI 代码

* 我们使用 Android XML 来描述 UI 视图，修改 `activity_main.xml` 为如下内容，可以看到整个视图由一个白板页面填充，这个页面实现（com.herewhite.sdk.WhiteBroadView）由 White Android SDK 提供。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <com.herewhite.sdk.WhiteBroadView
        android:id="@+id/white"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:visibility="visible" />

</LinearLayout>
```

## 初始化 SDK

```Java

import com.herewhite.sdk.*;
import com.herewhite.sdk.domain.*;

...
WhiteBroadView whiteBroadView = findViewById(R.id.white);
WhiteSdk whiteSdk = new WhiteSdk(whiteBroadView this, new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1));
```