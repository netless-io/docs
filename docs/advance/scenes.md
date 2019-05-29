---
id: advance-scenes
title: 场景管理
---

## 新增概念

### 场景

为了增强白板的页面管理功能，我们引入一个新概念：**场景**。
`场景`，就是我们一直在使用的白板的一个页面。

一个`场景`，主要包含 `场景名`，`PPT（背景图）` 两部分。

### 场景路径=场景目录+场景名

当管理多个场景时，我们想要获取到特定的场景，此时就需要 **`场景路径`** 。每一个`场景路径` 指向一个特定的场景。

`场景路径`由：`场景目录` 和 `场景名` 组成。前者与`场景`本身无关，与`场景`存放的位置有关。

>可以迁移资源管理器的知识进行理解。  
场景->文件  
场景路径->文件绝对地址  
场景目录->文件所在的文件夹路径


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

> 如果你熟悉 Unix / Linux 的文件系统，你会发现路径的形式和它们很像。场景就像文件，场景组就像文件夹。我们推荐你这么想象。


可以看出来，`场景路径`与文件绝对路径相似。

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

### 场景组

在同一一个`场景目录`下的多个`场景`属于同一个`场景组`。上面的场景，就有如下两个`场景组`；

- /Phy
- /Eng

我们可以说 `/Phy` 这个 `场景目录` 下有以下三个`场景`，也可以说 `/Phy` 这个`场景组`，有以下三个`场景`。

- /Phy/ppt1
- /Phy/ppt2
- /Phy/ppt3

>我们推荐，在移动`场景`时，使用`场景目录`的概念，其他时候，都用`场景组`的概念。

### 场景路径的唯一性

#### 场景路径指向唯一一个白板

每一个场景路径，指向一个唯一的一个场景。

使用移动，复制，插入场景 API 时，如果传入的路径已经存在一个特定的场景，该场景会被新的场景所覆盖。

#### 场景目录与场景路径不能相同

当白板房间存在一个场景路径为`/Eng/ppt1`的场景时，则不可能存在/接受一个名为`/Eng`的场景。因为`场景路径`由`场景目录`与`场景名`组成。
如果发生该情况，则会插入失败。

---

## API

本文档涉及的 API，都是白板 `Room` (iOS：`WhiteRoom`) 的方法。也可以在sdk 对应文件中进行查看。

### 获取当前场景信息

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```Typescript
let scenceState = room.state.sceneState;

/* scenceState 的数据结构
{
    //当前场景的场景路径
    scenePath: "/Phy/ppt1",
    //场景组，（同一场景目录下的所有场景）
    scenes: [{
        name: "ppt1",
        //（ppt 为可选值，此处都没有 ppt 属性）
    }, {
        name: "ppt2",
    }, {
        name: "ppt3",
    }],
    //当前场景，在场景组列表里面的索引位置
    index: 0,
}
*/
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject
/** 获取当前场景状态 */
- (void)getSceneStateWithResult:(void (^) (WhiteSceneState *state))result;

/** 获取当前场景目录，所有场景信息 */
- (void)getScenesWithResult:(void (^) (NSArray<WhiteScene *> *scenes))result;
@end
```
<!--Android/Java-->
```Java
//Room.Java
/** 获取当前场景状态 */
public void getSceneState(final Promise<SceneState> promise)
/** 获取当前场景目录，所有场景信息 */
public void getScenes(final Promise<Scene[]> promise) 
```
<!--END_DOCUSAURUS_CODE_TABS-->

通过以上 API，获取当前场景信息内容，具体内容结构，可以在各 SDK 中查看结构。

### 设置当前场景

当前场景代表白板房间内，所有人看到的页面。

创建一个白板房间时，会有一个名为 `init` 的默认`场景`。他的`场景目录`则是 `/`，他的`场景路径` 则是 `/init`。

如果要修改当前场景，移动到另外一个场景，则只需要调用以下 API，传入想要`场景`的`场景路径`即可。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
// 其中，room 是你通过 whiteWebSdk.joinRoom(...) 获取的房间对象
// 该方法的参数为你想切换到的场景路径
room.setScenePath("/phy/ppt1");

```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject
- (void)setScenePath:(NSString *)path;
@end

//example code
[room setScenePath:@"/Phy/ppt1"]
```

<!--Android/Java-->
```Java
//Room.Java
public void setScenePath(String path)

//example code
room.setScenePath:"/Phy/ppt1";
```

<!--END_DOCUSAURUS_CODE_TABS-->

>当切换 API 没有反应，或者回调中报错，有可能是以下情况：
>1. 路径不合法。请阅读之前的章节，确保输入了`场景路径`符合规范（以 `/`开头）。
>2. 路径对应的`场景`不存在。
>3. 路径对应的是`场景目录`。注意`场景目录`和场景是不一样的。

### 插入新场景

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
room.putScenes("/Phy", [{name: "ppt4"}]);
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject

/**
 插入，或许新建多个页面

 @param dir scene 页面组名称，相当于目录
 @param scenes WhiteScence 实例；在生成 WhiteScence 时，可以同时配置 ppt
 @param index 选择在页面组，插入的位置。index 即为新 scence 的 index 位置。如果想要放在最末尾，可以传入 NSUIntegerMax。
 */
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
@end
```

<!--Android/Java-->
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

<!--END_DOCUSAURUS_CODE_TABS-->

插入场景 API，接受三个参数:

* dir: `场景目录`，场景想要插入的对应目录位置。
* scenes: 为需要新建的场景列表。
* index: scenes 中第一个场景所在的位置。

>传入的`场景目录` (dir) 不能是已存在场景的 `场景路径`。（你不能向文件中插入文件）

>当新插入的场景，`场景路径`（dir + 场景名）与旧场景的`场景路径`相同时，新`场景`会覆盖旧`场景`。（新文件会覆盖旧文件）

### 重名、移动场景

类似于 Linux，macOS 的 mv 命令。

<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
/**
 移动/重命名页面

 @param source 想要移动的页面的场景路径
 @param target 目标路径。如果是场景目录，则将 source 移入；否则，移动的同时重命名。
 */
room.moveScene("/math/geometry", "/graphics/geometry");
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject
/**
 移动/重命名页面

 @param source 想要移动的页面的绝对路径
 @param target 目标路径。如果是文件夹，则将 source 移入；否则，移动的同时重命名。
 */
- (void)moveScene:(NSString *)source target:(NSString *)target;
@end
```

<!--Android/Java-->
```Java
//Room.Java
/**
 移动/重命名页面

 @param source 想要移动的页面的场景路径
 @param target 目标路径。如果是场景目录，则将 source 移入；否则，移动的同时重命名。
 */
public void moveScene(String source, String target)
```

<!--END_DOCUSAURUS_CODE_TABS-->


### 删除场景


<!--DOCUSAURUS_CODE_TABS-->
<!--Web/Typescript-->
```js
/**
 @param dirOrPath 场景路径，或者是场景目录。如果传入的是场景路径，则移除场景路径。如果传入的是场景目录，则移除场景目录下的所有场景。
 */
room.removeScenes("/Phy/ppt4")
room.removeScenes("/Eng");
```
<!--iOS/Objective-C-->
```Objective-C
@interface WhiteRoom : NSObject

/**
 @param dirOrPath 场景路径，或者是场景目录。如果传入的是场景路径，则移除场景路径。如果传入的是场景目录，则移除场景目录下的所有场景。
 */
- (void)removeScenes:(NSString *)dirOrPath;
```

<!--Android/Java-->
```Java
// Room.java
/**
 @param dirOrPath 场景路径，或者是场景目录。如果传入的是场景路径，则移除场景路径。如果传入的是场景目录，则移除场景目录下的所有场景。
 */
public void removeScenes(String dirOrPath)
```

<!--END_DOCUSAURUS_CODE_TABS-->


可以给该参数传入 `"/"`，来清空白板房间内所有场景。

>白板房间会至少存在一个场景。
因此，当你删光白板房间里的最后一个场景时，会立即自动生成一个名为 init，场景路径为"/init"的空白场景。

