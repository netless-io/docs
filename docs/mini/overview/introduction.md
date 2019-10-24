---
id: mini-introduction
title: 简要说明
sidebar_label: 简要说明
---

## 介绍

小程序使用微信开发的 mina 框架，采用双进程的方式开发，业务逻辑在 JS 引擎，渲染部分采用 Webview 部分采用原生组件。白板小程序 SDK 以标准小程序自定义组件的形式提供，目前处在公测阶段，获取 SDK 请联系技术支持：13651940170 （微信同号）

## 运行环境

- 请使用基础库 2.8.3 

## 白板开发

1. 使用小程序 IDE 创建一个新的项目，填入正式的小程序 AppId ，如果还没有请去 [微信开发平台](https://mp.weixin.qq.com/) 注册。


2. 修改 project.config.json 添加如下内容

```diff
{
	"description": "项目配置文件",
	"packOptions": {
		"ignore": []
	},
	"setting": {
		"urlCheck": true,
		"es6": true,
		"postcss": true,
		"minified": true,
		"newFeature": true,
		"autoAudits": false,
		"coverView": true,
+		"babelSetting": {
+			"ignore": [
+				"white-mini-sdk/common/*"
+			],
+			"disablePlugins": [],
+			"outputPath": ""
+		}
	},
+	"scripts": {
+		"beforeCompile": "node white-mini-sdk/scripts/route.js",
+		"beforePreview": "",
+		"beforeUpload": ""
+	}
}
```

3. 下载小程序 SDK ,解压后放入小程序根目录

```diff
  ├── app.js
  ├── app.json
  ├── app.wxss
  ├── pages
  ├── project.config.json
  ├── sitemap.json
  ├── utils
+ └── white-mini-sdk
```

4. 添加如下域名到微信的应用 url 白名单 [开发设置](https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=622315407&lang=zh_CN)

```
https://cloudcapiv4.herewhite.com
https://sdkreport.herewhite.com
https://scdncloudharestoragev3.herewhite.com
wss://scdncloudharev3.herewhite.com
```
5. 编辑 pages/index/index.json

```diff
{
  "usingComponents": {
+    "white-mini-sdk": "../../white-mini-sdk"
  }
}
```

6. 编辑 pages/index/index.wxml

```diff
-<view class="container">
-  <view class="userinfo">
-    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
-    <block wx:else>
-      <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
-      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
-    </block>
-  </view>
-  <view class="usermotto">
-    <text class="user-motto">{{motto}}</text>
-  </view>
-</view>
+<white-mini-sdk 
+    uuid="715e70d0c357451e99f50e881ae76833" 
+    roomToken="WHITEcGFydG5lcl9pZD0zZHlaZ1BwWUtwWVN2VDVmNGQ4UGI2M2djVGhncENIOXBBeTcmc2lnPWZjZWE2NzhjZDc3YTEwZjU1ZmM2MWRhNjZjZWQ2YmUwMWIwZDU0OTI6YWRtaW5JZD0xNTgmcm9vbUlkPTcxNWU3MGQwYzM1NzQ1MWU5OWY1MGU4ODFhZTc2ODMzJnRlYW1JZD0yODMmcm9sZT1yb29tJmV4cGlyZV90aW1lPTE2MDMyOTcyNDImYWs9M2R5WmdQcFlLcFlTdlQ1ZjRkOFBiNjNnY1RoZ3BDSDlwQXk3JmNyZWF0ZV90aW1lPTE1NzE3NDAyOTAmbm9uY2U9MTU3MTc0MDI4OTcxMzAw"
+    bind:roomReady="onRoomReady"
+    bind:roomStateChanged="onRoomStateChanged"
+    bind:phaseChanged="onPhaseChanged"
+    >
+</white-mini-sdk>
```

- uuid 是房间号，后面部分会详细说明来源
- roomToken 是房间令牌，用于身份验证
- bind:roomReady 是绑定房间初始化完成后的事件，用于获取 room 对象，room 对象可以对白板进行 API 级别的灵活操作
- bind:roomStateChanged 是房间状态改变的事件回调（包含教具状态、人员信息变化等）
- bind:phaseChanged 是房间当前阶段的回调，（包含 connecting connected reconnecting disconnecting disconnected）


7. 编辑 pages/index/index.wxss

```diff
+@import "../../white-mini-sdk/index.wxss";
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 200px;
}
```

8. 编辑 pages/index/index.js 文件

```diff
//index.js
//获取应用实例
const app = getApp()

Page({
-  data: {
-    motto: 'Hello World',
-    userInfo: {},
-    hasUserInfo: false,
-    canIUse: wx.canIUse('button.open-type.getUserInfo')
-  },
-  //事件处理函数
-  bindViewTap: function() {
-    wx.navigateTo({
-      url: '../logs/logs'
-    })
-  },
-  onLoad: function () {
-    if (app.globalData.userInfo) {
-      this.setData({
-        userInfo: app.globalData.userInfo,
-        hasUserInfo: true
-      })
-    } else if (this.data.canIUse){
-      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
-      // 所以此处加入 callback 以防止这种情况
-      app.userInfoReadyCallback = res => {
-        this.setData({
-          userInfo: res.userInfo,
-          hasUserInfo: true
-        })
-      }
-    } else {
-      // 在没有 open-type=getUserInfo 版本的兼容处理
-      wx.getUserInfo({
-        success: res => {
-          app.globalData.userInfo = res.userInfo
-          this.setData({
-            userInfo: res.userInfo,
-            hasUserInfo: true
-          })
-        }
-      })
-    }
-  },
-  getUserInfo: function(e) {
-    console.log(e)
-    app.globalData.userInfo = e.detail.userInfo
-    this.setData({
-      userInfo: e.detail.userInfo,
-      hasUserInfo: true
-    })
-  }
+    onRoomReady: function(e){
+        console.log("Page room ready", e.detail);
+    },
+    onRoomStateChanged: function (e) {
+        console.log("Page room state changed", e.detail);
+    },
+    onPhaseChanged: function (e) {
+        console.log("Page room phase changed",+ e.detail);
+    },
})
```

- onRoomReady 会在房间完全初始化后并渲染完成后触发,具体参考
  - [教具使用](https://developer.netless.link/docs/en/javascript/guides/js-tools/)
  - [白板操作](https://developer.netless.link/docs/en/javascript/guides/js-operation/)
- onRoomStateChanged 会在房间任何状态发生改变时触发，具体参考 
  - [状态管理](https://developer.netless.link/docs/en/javascript/guides/js-state/)
- onPhaseChanged 会在房间连接状态发生改变时触发，包含 
  - connecting
  - connected
  - reconnecting
  - disconnecting
  - disconnected

9. 删除 `app.wxss` 中的样式防止冲突

## 加入房间

第一章中的房间 uuid 和 roomToken 是用于测试的房间信息，如何获取自己的 uuid 和 roomToken 呢？

参考：[在服务端创建房间](https://developer.netless.link/docs/en/server/overview/server-introduction/)

## 自定义组件

1. 在根目录创建文件夹 `custom_component`

```diff
  ├── app.js
  ├── app.json
  ├── app.wxss
  ├── config.js
+ ├── custom_component
  ├── pages
  ├── project.config.json
  ├── sitemap.json
  ├── utils
  └── white-mini-sdk
```

2. 在 `custom_component` 中创建文件 `route.json`,内容类似如下：

```json
{
    "https://taobao.com": {
        "path": "a/index",
        "name": "a"
    },
    "https://baidu.com": {
        "path": "b/index",
        "name": "b"
    },
    "https://qq.com": {
        "path": "c/index",
        "name": "qq"
    }
}
```
- 其中 key 为当前显示的自定义组件的唯一标示，未来可以和 Web 的自定义组件进行联动(在 web 上用 iframe 实现)
- path 是自定义组件的相对路径，最终该自定义组件会以标准小程序自定义组件的形式被白板框架所引用
- name 是这个自定义组件的名字，唯一即可，会被用于小程序自定义组件的模板名字

3. 开启【小程序】 -> 【详情】 -> 【本地设置】 -> 【启动自定义处理命令】

![](./docs/settings.png)

4. 运行小程序【编译】，会根据上述配置生成自定义组件的引用，自动生成的代码可以提交到 Git。每次添加新的自定义组件后，请务必执行编译。

5. 插入自定义组件

```js
const iframeId = room.insertPlugin({ protocal: "iframe", centerX: 0, centerY: 0, width: 300, height: 300 ,props: {src: "https://baidu.com"}});
```

`iframeId` 请保存，删除组件的时候会使用到

6. 更新自定义组件


```js
待补充
```

## Troubleshooting

Q. 新添加的自定义组件没有显示

A. 运行小程序编译

Q. 白板笔画偏移

A1. 删除 `app.wxss` 中的样式防止冲突

A2. 请不要使用小程序基础库 2.9.0 ，该版本有严重 bug




## Changelog

### 2.0.0 - 2019-10-24

> - 发布公测版本
