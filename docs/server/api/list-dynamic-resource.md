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

用户需要将 api 返回的所有资源下载到本地，且将返回的 url 根据 "/" 分隔为文件夹形式进行保存并压缩为 zip，域名省略，资源保存的根目录可以自行指定。
例如：
我调用了上述 api 且返回值为实例中的内容，我指定 /root/ppt 为资源保存的根目录，那么我的文件目录结构为：

* {{taskUUID}} 为用户传入的路径中的 param

```
    /root/ppt/dynamicConvert/{{taskUUID}}/info.json
    /root/ppt/dynamicConvert/{{taskUUID}}/layout/layout1.xml
    /root/ppt/dynamicConvert/{{taskUUID}}/master/master1.xml
    /root/ppt/dynamicConvert/{{taskUUID}}/pptxml/ppt.xml
    /root/ppt/dynamicConvert/{{taskUUID}}/resources/resource1.json
    /root/ppt/dynamicConvert/{{taskUUID}}/resources/ppt/media/audio1.mp4
    /root/ppt/dynamicConvert/{{taskUUID}}/slide/slide1.xml
    /root/ppt/dynamicConvert/{{taskUUID}}/slideRef/slideRef1.xml
    /root/ppt/dynamicConvert/{{taskUUID}}/theme/theme1.xml
    /root/ppt/publicFiles/icon/audio.png
    /root/ppt/publicFiles/icon/pause.png
    /root/ppt/publicFiles/icon/play.png
    /root/ppt/publicFiles/pic/notSupport.png
    /root/ppt/publicFiles/xml/PresetShapeDefinitions.xml
```

之后将 /root/ppt 压缩为 zip 格斯，这样我在 /root 目录下就有了一个 ppt.zip 格式的文件

```
    /root/ppt.zip
```
