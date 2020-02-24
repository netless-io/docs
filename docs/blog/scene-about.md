---
id: scene-about
title: 如何插入 ppt, 切换 ppt
---

## 1. 场景是什么（scene）

![scene](/img/scene.png)

场景对终端客户来说就是上图 “白板” 以及 “白板分页”, 对开发者来说就是以下这种数据结构。

``` ts
    type WhiteScene = {
        name: string; // 场景名称
        componentsCount: number; // 白板上的元素个数，新建的空场景就是 0
        ppt?: PptDescription; // ppt 的资源
    };

    type PptDescription = {
        src: string; // 动态 json , 静态 url
        width: number; // 文档宽
        height: number; // 文档高
    };
```

## 2. 怎么在场景中插入 ppt

### 2.1 场景操作的核心方法

1. 相当于日常电脑操作的 “另存成”, 就是将场景存入对应的地址中

    ``` ts
        room.putScenes(`/init`, scenes); // 插入 ppt 内容
    ```

2. 相当于日常电脑操作的 “打开文件夹”, 就是到指定的地址访问对应的场景

    ``` ts
        room.setScenePath(`/init/page2`); // 显示相应的内容为：init 下的第二页
    ```

### 2.2 临时提交文档转换服务的处理方法

``` ts
    import {Room, PptConverter} from "white-web-sdk";
    const pptConverter = whiteWebSdk.pptConverter(roomToken);
    res = await pptConverter.convert({
            url: pptURL, // 源文件地址
            kind: kind, // 转码类型
            onProgressUpdated: progress => {
                console.log(progress) // 转码进度
            },
        });

    // convert 方法是输入一个文档地址，返回一个场景数组 [Scene, Scene, Scene]
    room.putScenes(`/init`, res.scenes);
    room.setScenePath(`/init/page2`);
```

### 2.3 从服务器获取的数据的处理方法

``` ts
    // [url, url] 或者 [json, json] 经过 map 处理后互动
    const scenes: []Scene = [url, url].map()

    // convert 方法是输入一个文档地址，返回一个场景数组 [Scene, Scene, Scene]
    room.putScenes(`/`, scenes);
    room.setScenePath(`/init/page2`);
```

## 3. 怎么切换 ppt

``` ts
 // 上一步
 room.pptPreviousStep();
 // 下一步
 room.pptNextStep();
 // 切换到指定的 path
 room.setScenePath(`/init/page2`);
 // 此方法如果在动态 ppt 中，那么就是下一个动画。如果在静态 ppt 中，那么就是下一页
```
