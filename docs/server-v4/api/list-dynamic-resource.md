---
id: list-dynamic-resource
title: 列出动态转换的资源
---

该 api 用于下载所有 pptx 内的资源到本地，保证用户在运行文档转网页的结果时不会因为资源加载失败导致无法运行。
该 api 目前仅针对于 native 端用户使用，web 端用户不需要调用。
调用该 api 之前请先参考 [文档转网页](/docs/server/api/server-dynamic-conversion)

## 服务端 API

### 列出动态转换的资源

`GET /services/conversion/tasks/{{taskUUID}}/resources?serviceType=dynamic_conversion`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken 或 token | string | {{roomtoken}} 或 {{token}}|

* response

```JSON
{
    "code": 200,
    "msg": {
        "resources": [
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/layout/layout1.xml",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/master/master1.xml",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/pptxml/ppt.xml",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/resource1.json",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/ppt/media/audio1.mp4",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slide/slide1.xml",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slideRef/slideRef1.xml",
            "https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}/theme/theme1.xml",
            "https://convertcdn.netless.link/publicFiles/icon/audio.png",
            "https://convertcdn.netless.link/publicFiles/icon/pause.png",
            "https://convertcdn.netless.link/publicFiles/icon/play.png",
            "https://convertcdn.netless.link/publicFiles/pic/notSupport.png",
            "https://convertcdn.netless.link/publicFiles/xml/PresetShapeDefinitions.xml"
        ]
    }
}
```

> 该 api 目前只支持 serviceType = dynamic_conversion，传入其他类型会被拒绝

## 获取资源列表后的操作

用户需要将 api 返回的所有资源下载到本地，且将返回的 url 根据 "/" 分隔为文件夹形式进行保存并压缩为 zip，协议头省略，资源保存的根目录可以自行指定。
例如：
用户调用了上述 api 且返回值为实例中的内容，之后指定 /root/{{taskUUID}} 为资源保存的根目录，那么用户的文件目录结构为：

* {{taskUUID}} 为用户传入的路径中的 param，建议使用 {{taskUUID}} 作为资源保存的根目录可以避免不同的文档资源冲突

```shell
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/layout/layout1.xml
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/master/master1.xml
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/pptxml/ppt.xml
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/resource1.json
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/ppt/media/audio1.mp4
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slide/slide1.xml
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slideRef/slideRef1.xml
    /root/{{taskUUID}}/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/theme/theme1.xml
    /root/{{taskUUID}}/convertcdn.netless.link/publicFiles/icon/audio.png
    /root/{{taskUUID}}/convertcdn.netless.link/publicFiles/icon/pause.png
    /root/{{taskUUID}}/convertcdn.netless.link/publicFiles/icon/play.png
    /root/{{taskUUID}}/convertcdn.netless.link/publicFiles/pic/notSupport.png
    /root/{{taskUUID}}/convertcdn.netless.link/publicFiles/xml/PresetShapeDefinitions.xml
```

之后将 /root/{{taskUUID}}/convertcdn.netless.link 文件夹压缩为 zip 格式，这样用户在 /root/{{taskUUID}} 目录下就有了一个 convertcdn.netless.link.zip 文件，zip 包内解压后，内部应该是先有 convertcdn.netless.link 文件夹，然后依次根据网络地址依次有 dynamicConvert， publicFiles文件夹：

```shell
/convertcdn.netless.link/dynamicConvert
/convertcdn.netless.link/publicFiles
```
