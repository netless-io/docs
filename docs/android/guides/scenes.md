---
id: android-scenes
title: 场景管理
---

# 新概念——场景

首先，为了增强白板的页面管理功能，我们引入一些新概念：场景以及场景目录。

*如果您不能理解场景这个概念，我们建议您参考资源管理器以及文件的概念。将场景理类比成文件。*

场景目前主要包括：场景名，PPT（背景图），PPT宽，PPT高 这几个内容。
还有一个与场景有关，不是由场景本身持有的内容：场景路径。场景路径由场景目录+场景名，后者由场景本身持有。

场景目录，则是文件的所在目录。（SDK 中的场景目录，格式参考的是 Unix 系统下的文件格式。`\dir1\dir`）

## 场景路径与名字

每一个场景都有自己的名字和路径。如下是一组合法的场景路径。

- /physics/newtonian-mechanics
- /physics/relativity-theory
- /physics/quantum-mechanics
- /english/good-morning
- /english/it-is-ranning
- /english/how-do-you-do

路径以 `/` 符分割层级，且一定以 `/` 开始。最右边的层级就是场景的名字。

## 场景组

多个场景可以归于同一个「场景组」。通过观察上一节中的场景路径例子，我们发现可以通过如下路径描述 2 个场景组。

- /physics
- /english

例如，`/pyhsics` 场景组下有如下场景（按照路径列出）。

- /physics/newtonian-mechanics
- /physics/relativity-theory
- /physics/quantum-mechanics

> 如果你熟悉 Unix / Linux 的文件系统，你会发现路径的形式和它们很像。场景就像文件，场景组就像文件夹。我们推荐你这么想象。


## 相关类

首先，我们需要知道场景类： `SceneState` 和 `PptPage` 类。

>请注意：SDK中的类，都是配置数据，用于向白板传递数据用，并不持有任何白板实例*

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

## 获取当前场景信息

```Java
//获取当前场景状态
public void getSceneState(final Promise<SceneState> promise)
/** 获取当前目录下，所有页面的信息 */
public void getScenes(final Promise<Scene[]> promise) 

@end
```

可以通过以上 API，获取当前场景信息内容。其中类都在相关类中有做介绍。


## 设置当前场景

当前场景用来代表该房间此时此刻大家所看到的房间。当你新建一个新房间时，当前场景会被默认设置成 ``/init`` 。这是一个默认创建的空白场景。

```Java
public void setScenePath(String path)
```

* 示例代码

```Java
room.setScenePath:"/physics/relativity-theory";
```

当切换 API 没有反应，并且在 `- (void)fireCatchErrorWhenAppendFrame:(NSUInteger)userId error:(NSString *)error;` 回调中报错，有可能是以下情况：

1. 路径不合法。请通过之前的章节确保场景路径符合规范。
2. 路径对应的场景不存在。
3. 路径对应的是场景组。注意场景组和场景是不一样的。

## 插入新场景

```Java
/**
 插入，或许新建多个页面

 @param dir scene 页面组名称，相当于目录
 @param scenes WhiteScence 实例；在生成 WhiteScence 时，可以同时配置 ppt
 @param index 选择在页面组，插入的位置。index 即为新 scence 的 index 位置。如果想要放在最末尾，可以传入 Integer.MAX_VALUE。
 */
public void putScenes(String dir, Scene[] scenes, int index)
```

插入场景 API，接受三个参数。

dir 为场景想要插入的目录；
scenes 为需要被插入到白板中的场景配置内容；
index 为scenes 中第一个场景所在的位置，如果想放在最末尾，可以传入 NSUIntegerMax。

## 重名、移动场景

```Java
/**
 移动/重命名页面

 @param source 想要移动的页面的绝对路径
 @param target 目标路径。如果是文件夹，则将 source 移入；否则，移动的同时重命名。
 */
public void moveScene(String source, String target)
@end
```

类似于 Linux，macOS 的 mv 命令。

## 删除场景

```Java

/**

 当有
 /ppt/page0
 /ppt/page1
 传入 "/ppt/page0" 时，则只删除对应页面。
 传入 "/ppt" 时，会将两个页面一起移除。

 @param dirOrPath 页面具体路径，或者为页面组路径
 */
public void removeScenes(String dirOrPath)
```
