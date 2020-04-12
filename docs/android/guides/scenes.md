---
id: android-scenes
title: 页面（场景）管理
---
## 新增概念

### 场景 (scene)

为了增强白板的页面管理功能，我们引入一个新概念：**场景**。
`场景`，就是我们一直在使用的白板的一个页面。

一个`场景`，主要包含 `场景名`，`PPT（背景图）` 两部分。

### 场景路径 (scenePath) = 场景目录 + 场景名 

当管理多个场景时，我们想要获取到特定的场景，此时就需要 **`场景路径`** 。每一个`场景路径` 指向一个特定的场景。

>类比 PC 文件和文件夹的概念。  
场景->文件  
场景目录->文件夹路径
场景路径->文件绝对地址  


>类比课件管理概念。  
场景-> PPT 文档的某一页名称 
场景目录-> 某个 PPT 文档的位置
场景路径-> PPT 文档的某一页的绝对位置

如下是一组合法的`场景路径`。

```shell
/init
/Eng/ppt1
/Eng/ppt2
/Eng/ppt3
/Phy/ppt1
/Phy/ppt2
/Phy/ppt3
```

**`场景路径`以 `/` 符分割层级，且一定以 `/` 开始。最右边的层级就是场景的名字。**


也可以用以下表示文件结构的形式，来表示这一组场景。

```shell
|____init（场景）
|____Eng（场景目录）
| |____ppt1（场景）
| |____ppt3（场景）
| |____ppt2（场景）
|____Phy（场景目录）
| |____ppt1（场景）
| |____ppt3（场景）
| |____ppt2（场景）
```

### 场景目录

在同一一个`场景目录`下可以有多个多个`场景`；

- /Phy
- /Eng

则 `/Phy` 这个 `场景目录` 下有以下三个`场景`。

- /Phy/ppt1
- /Phy/ppt2
- /Phy/ppt3

> 场景路径指的向唯一性:
类似文件的概念每一个场景路径，指向一个唯一的一个场景。
使用移动，复制，插入场景 API 时，如果传入的路径已经存在一个特定的场景，该场景会被新的场景所覆盖。

>场景目录与场景路径不能相同:
当白板房间存在一个场景路径为`/Eng/ppt1`的场景时，则不可能存在/接受一个名为`/Eng`的场景。因为`场景路径`由`场景目录`与`场景名`组成。
如果发生该情况，则会插入失败。

---

## API

本文档涉及的 API，都是白板 `Room` (iOS：`WhiteRoom`) 的方法。也可以在sdk 对应文件中进行查看。

### 获取当前场景信息


```Java
//Room.Java
/** 获取当前场景状态 */
public void getSceneState(final Promise<SceneState> promise)
/** 获取当前场景目录，所有场景信息 */
public void getScenes(final Promise<Scene[]> promise) 
```


通过以上 API，获取当前场景信息内容，具体内容结构，可以在各 SDK 中查看结构。

### 获取当前房间，所有场景

>2.7.3 新增 API

获取房间，当前所有场景信息，返回为字典格式，key 为场景目录地址，value 为该目录下，所有的页面（场景）列表。

```Java
//Displayer.java
/**
    * 获取当前房间内所有的白板页面信息
    * @param promise 返回 一个 map，key 为场景目录地址，value 为该目录下，所有 Scene 数组。
    */
public void getEntireScene(final Promise<Map<String, Scene[]>> promise)
```

### 查询特定路径对应的内容

> 2.6.4 新增 API

```java
//Displayer.java
/**
    * 查询路径对应的内容，还是页面（场景），或者是页面（场景）目录，或者不存在任何内容。
    * @param path 进行查询的路径
    * @param promise 回调结果，具体内容，可以查看 {@link WhiteScenePathType}
    */
public void getScenePathType(String path, final Promise<WhiteScenePathType> promise)
```

### 设置当前场景

当前场景代表白板房间内，所有人看到的页面。

创建一个白板房间时，会有一个名为 `init` 的默认`场景`。他的`场景目录`则是 `/`，他的`场景路径` 则是 `/init`。

如果要修改当前场景，移动到另外一个场景，则只需要调用以下 API，传入`场景路径`即可。


```Java
//Room.Java
public void setScenePath(String path)

//example code
room.setScenePath:"/Phy/ppt1";
```



>当切换 API 没有反应，或者回调中报错，有可能是以下情况：
>1. 路径不合法。请阅读之前的章节，确保输入了`场景路径`符合规范（以 `/`开头）。
>2. 路径对应的`场景`不存在。
>3. 路径对应的是`场景目录`。注意`场景目录`和场景是不一样的。

### 插入新场景


```Java
//Room.java
/**
 插入，或许新建多个页面

 @param dir scene 页面组名称，相当于目录
 @param scenes WhiteScence 实例；在生成 WhiteScence 时，可以同时配置 ppt
 @param index 选择在页面组，插入的位置。index 即为新 scence 的 index 位置。如果想要放在最末尾，可以传入 Integer.MAX_VALUE。
 */
public void putScenes(String dir, Scene[] scenes, int index)
```



插入场景 API，接受三个参数:

* dir: `场景目录`，场景想要插入的对应目录位置。
* scenes: 为需要新建的场景列表。
* index: 可选且从 0 开始,表示 scenes 中第一个场景加入的位置；场景举例：当前`场景目录`中已经有 20 页 PPT 文档，想在第 3 页后加入一个空白页则 index 设置为 3。

>传入的`场景目录` (dir) 不能是已存在场景的 `场景路径`。（你不能向文件中插入文件）

>当新插入的场景，`场景路径`（dir + 场景名）与旧场景的`场景路径`相同时，新`场景`会覆盖旧`场景`。（新文件会覆盖旧文件）

### 重名、移动场景

类似于 Linux，macOS 的 mv 命令。


```Java
//Room.Java
/**
 移动/重命名页面

 @param source 想要移动的页面的场景路径
 @param target 目标路径。如果是场景目录，则将 source 移入；否则，移动的同时重命名。
 */
public void moveScene(String source, String target)
```




### 删除场景



```Java
// Room.java
/**
 @param dirOrPath 场景路径，或者是场景目录。如果传入的是场景路径，则移除场景路径。如果传入的是场景目录，则移除场景目录下的所有场景。
 */
public void removeScenes(String dirOrPath)
```




可以给该参数传入 `"/"`，来清空白板房间内所有场景。

>白板房间会至少存在一个场景。
因此，当你删光白板房间里的最后一个场景时，会立即自动生成一个名为 init，场景路径为"/init"的空白场景。

## 截图功能

```Java
/**
 截取用户切换时，看到的场景内容，不是场景内全部内容。
 FIXME：图片支持：只有当图片服务器支持跨域，才可以显示在截图中

 @param scenePath 想要截取场景的场景路径，例如 /init；输入不存在场景路径，会返回空白图片
 @param completionHandler 回调函数，image 可能为空
 */
public void getScenePreviewImage(String scenePath, final Promise<Bitmap>promise) {}
public void getSceneSnapshotImage(String scenePath, final Promise<Bitmap>promise) {}
```

## 相关类

首先，我们需要知道场景类： `SceneState` 和 `PptPage` 类。

>请注意：SDK中的类，都是配置数据，用于向白板传递数据用，并不持有任何白板实例

### PptPage 类

PptPage 类，是 ppt 相关的配置信息。在创建 WhiteScene 类时传入，再通过插入场景 API时，生成带背景图片的白板页面。

```Java
public PptPage(String src, Double width, Double height)
```

图片中心为白板页面的中心点。

### Scene 类

```Java
public Scene(String name, PptPage ppt)
```

WhiteScene 管理了一个白板页面，其中包含了 name，并且接管了原来的 ppt 内容。
白板页面只有在创建时，才接受 ppt 参数。

### SceneState 类

```Java
public class SceneState {

    //当前场景目录下，所有的页面
    public Scene[] getScenes() {
        return scenes;
    }

    //当前场景路径
    public String getScenePath() {
        return scenePath;
    }

    //当前场景在 Path 中的索引
    public int getIndex() {
        return index;
    }
}
```

该类描述了当前场景目录的状态。

