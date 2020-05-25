---
id: server-dynamic-conversion-zip
title: 动态文档转换资源包
---

为了提升用户体验，在动态文档转换完成后，我们提供了渲染文档的资源包。
用户预先下载这些资源包并解压到指定本地目录后，渲染文档时可以直接读取本地资源文件，省去资源的网络下载时间。

> 注意：2020-05-25 之前已经转换完成的文档没有资源包供下载，只有在该日期之后新发起的转换任务才有资源包，用户需要判断资源包是否存在

## 资源包下载地址

在转换任务完成后，通过链接
```
https://convertcdn.netless.link/publicFiles.zip  // 公共资源包
https://convertcdn.netless.link/dynamicConvert/{{taskUUID}}.zip   // 任务资源包
```
下载转换任务的资源包，其中，公共资源包是所有动态文档渲染所必须的一些文件，建议下载后保存到本地且不要删除。
任务资源包对应每一个动态转换任务。

> 目前动态文档转换功能没有支持用户自定义存储，因此下载域名固定为 https://convertcdn.netless.link，在支持自定义存储后，这个域名应该是用户自定义的存储域名

## 资源包解压后的目录结构

publicFiles.zip
```
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

{{taskUUID}}.zip
```
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

## 获取资源包后的操作

用户需要将资源包解压到本地，资源目录可以自行指定，公共资源包和任务资源包解压后的资源目录关系如下
例如：
用户指定 /root 为资源保存的根目录，那么用户的文件目录结构应该为：

> 其中 /root/convertcdn.netless.link 和 /root/convertcdn.netless.link/dynamicConvert 两个文件夹需要用户创建
> 在支持自定义存储后，convertcdn.netless.link 这个文件夹也应该修改为用户指定存储的域名

```shell
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/info.json
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/layout/layout1.xml
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/master/master1.xml
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/pptxml/ppt.xml
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/resource1.json
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/resources/ppt/media/audio1.mp4
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slide/slide1.xml
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/slideRef/slideRef1.xml
    /root/convertcdn.netless.link/dynamicConvert/{{taskUUID}}/theme/theme1.xml
    /root/convertcdn.netless.link/publicFiles/icon/audio.png
    /root/convertcdn.netless.link/publicFiles/icon/pause.png
    /root/convertcdn.netless.link/publicFiles/icon/play.png
    /root/convertcdn.netless.link/publicFiles/pic/notSupport.png
    /root/convertcdn.netless.link/publicFiles/xml/PresetShapeDefinitions.xml
```
该例中公共资源存放在 /root/convertcdn.netless.link 路径下，任务资源存放在 /root/convertcdn.netless.link/dynamicConvert 路径下

文件路径如图：

![resource_path.png](/img/resource_path.png)
