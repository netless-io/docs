---
id: android-init-sdk
title: Initialization
---

Before initializing the SDK, please make sure that you have completed registering the account to obtain tokens and integrate the installation package. For details, see [Integration Client](./prepare.md).

## Adding UI code

* We use Android XML to describe the UI view. Modify `activity_main.xml` to the following content. You can see that the entire view is filled by a whiteboard page. This page implementation (com.herewhite.sdk.WhiteBroadView) is provided by the White Android SDK.

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