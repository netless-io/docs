---
id: server-dynamic-conversion-zip
title: 动态转换资源包
---

从 2020.5.25 之后，动态转换完成后，会提供该转换任务的资源包。其中包含，所有动态 ppt 所需要的网络资源内容。
用户预先下载这些资源包并解压到指定本地目录后，渲染文档时可以直接读取本地资源文件，省去资源的网络下载时间。

> 注意：2020-05-25 之前已经转换完成的文档没有资源包供下载。

## 资源包下载地址

### 通用资源

动态转换资源包中，有一部分资源，属于所有转换任务都需要的资源，该部分内容，建议下载后，直接保存，不需要频繁更新下载。

```ts
https://convertcdn.netless.link/publicFiles.zip
```

### 转换任务资源包

```ts
// taskUUID 为转换任务发起后，返回的 taskUUID
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}.zip
```

> 当动态转换支持用户自定义存储后，动态 ppt 进行网络请求时，非通用资源的网络请求，域名部分会由`https://convertcdn.netless.link`会变更为用户自定义域名，其他结构保持不变。

## 资源包文件结构

下载 `https://convertcdn.netless.link/publicFiles.zip` 解压后，文件夹名称为 publicFiles。文件结构如下所示：

```ts
/publicFiles
    /icon
        xxx.png
        ...
    /xml
        xxx.xml
        ...
    /pic
        xxx.png
        ...
    /info.json
```

下载 `https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}.zip` 解压后，文件夹名称为对应 taskUUID。文件结构如下所示：

```ts
/{{taskUUID}}
    /layout
        xxx.xml
        ...
    /resource
        xxx.xml
        ...
    /slide
        xxx.xml
        ...
    ...
    /info.json
```

## 资源包与网络请求对应关系

```ts
// 动态转换中，当前转换任务的网络请求
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/layout/layout1.xml
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/master/master1.xml
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/pptxml/ppt.xml
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/resource1.json
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/ppt/media/audio1.mp4
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slide/slide1.xml
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slideRef/slideRef1.xml
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/theme/theme1.xml

// 转换任务资源包文件，以 taskUUID 为文件夹名称
/{{taskUUID}}
    /layout
        xxx.xml
        ...
    /resource
        xxx.xml
        ...
    /slide
        xxx.xml
        ...
    ...
    /info.json


// 动态转换任务，通用资源网络请求
https://convertcdn.netless.link/publicFiles/icon/audio.png
https://convertcdn.netless.link/publicFiles/icon/pause.png
https://convertcdn.netless.link/publicFiles/icon/play.png
https://convertcdn.netless.link/publicFiles/pic/notSupport.png
https://convertcdn.netless.link/publicFiles/xml/PresetShapeDefinitions.xml

// 动态转换，通用资源包
/publicFiles
    /icon
        xxx.png
        ...
    /xml
        xxx.xml
        ...
    /pic
        xxx.png
        ...
    /info.json
```

开发者在进行拦截替换时，可以自己，可以自己实现该部分的替换逻辑。

## iOS

>iOS SDK 从 2.8.1 开放 ppt 自定 Scheme 接口。  
>具体见`WhiteSdkConfiguration`属性`pptParams`的`scheme`字段。  

[Whiteboard-iOS](https://github.com/netless-io/Whiteboard-iOS#%E5%8A%A8%E6%80%81ppt%E6%9C%AC%E5%9C%B0%E8%B5%84%E6%BA%90%E5%8C%85)example 中，已有实现，具体可见该项目文档。

### NETURLSchemeHandler

开发者可以使用我们开源的[NETURLSchemeHandler](https://github.com/netless-io/NETURLSchemeHandler)，来进行拦截替换。
>为了兼容最低支持版本低于iOS 11 的用户，该开源库声明的最低支持版本为 iOS 9；实际使用时，仍然要求 iOS 11

`NETURLSchemeHandler`会先将拦截的网络请求，转换为本地路径进行查询。当本地路径存在内容时，直接返回内容；如果不存在，则会将该网络请求转换为标准的 https 网络请求，进行请求。

例如：

```ts
# 拦截请求1，customScheme 为`NETURLSchemeHandler`实例的`scheme`属性
scheme://convertcdn.netless.link/publicFiles/icon/audio.png
# 本地查询路径，directory 为`NETURLSchemeHandler`实例的`directory`属性
/directory/convertcdn.netless.link/publicFiles/icon/audio.png

# 拦截请求2，customScheme 为`NETURLSchemeHandler`实例的`scheme`属性
scheme://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json
# 本地查询路径，directory 为`NETURLSchemeHandler`实例的`directory`属性
/directory/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json
```

进行资源包替换时，开发者仍然需要做以下准备

### 提前准备

1. 确定特定房间内的动态 ppt taskUUID（推荐后端业务服务器，使用数据库记录该关联关系）
2. 提前下载资源包（需要考虑下载进度，下载失败等问题）

### SDK 相关调用
3. 初始化`NETURLSchemeHandler`，配置`directory`与自定义`scheme`。
4. 在初始化`WhiteboardView`时，配置`WKWebViewConfiguration`类，声明使用`NETURLSchemeHandler`拦截配置好的自定义`scheme`。
4. 在初始化`WhiteSdkConfiguration` sdk 配置参数时，配置`pptParams`配置项中的`scheme`属性。

> 该部分调用代码，可以在 iOS SDK 的 example 项目中进行查看。

### 路径映射

基于`NETURLSchemeHandler`对网络请求的替换逻辑，和资源包下载的文件名。

推荐开发者将通用资源，解压至`directory/convertcdn.netless.link`中；将转换任务资源包，解压至`directory/convertcdn.netless.link/dynamicConvert`中。

这样，`NETURLSchemeHandler`就能够将下载的文件与网络请求一一映射起来。

## Android

Android 本身即支持对 webview 的网络请求进行拦截，不需要额外修改`ppt`请求的`scheme`。只需要按照标准的`WebView`拦截，进行操作即可。

具体代码实现，可以参考[white-demo-android](https://github.com/duty-os/white-demo-android#%E5%8A%A8%E6%80%81%E8%B5%84%E6%BA%90%E5%8C%85%E9%A2%84%E5%8A%A0%E8%BD%BD)项目。

## Web

目前，web 端，可以通过`service-worker`对`img`，`video`，`audio`以及`fetch`发起的网络请求进行拦截替换。

可以参考[cache-from-zip](https://github.com/mozilla/serviceworker-cookbook/tree/master/cache-from-zip)项目。