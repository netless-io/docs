---
id: android-init-sdk
title: 初始化SDK
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
WhiteSdkConfiguration sdkConfiguration = new WhiteSdkConfiguration("AppIdentifier", true);
WhiteSdk whiteSdk = new WhiteSdk(whiteboardView, this, sdkConfiguration,
                new CommonCallbacks() {
                    @Override
                    public String urlInterrupter(String sourceUrl) {
                        return sourceUrl;
                    }

                    @Override
                    public void sdkSetupFail(SDKError error) {
                        Log.e("ROOM_ERROR", error.toString());
                    }

                    @Override
                    public void throwError(Object args) {

                    }

                    @Override
                    public void onPPTMediaPlay() {
                        logAction();
                    }

                    @Override
                    public void onPPTMediaPause() {
                        logAction();
                    }
                });
```

>[AppIdentifier](/docs/faq/app-identifier)需要在[console](https://console.netless.link)中进行查看。具体请看链接中内容。

> 注意： whiteBroadView 对象需要在当前 activity 销毁时一起销毁，否则多次进入可能会造成内存溢出崩溃，代码如下
```Java
protected void onDestroy() {
    super.onDestroy();
    whiteboardView.removeAllViews();
    whiteboardView.destroy();
}
```