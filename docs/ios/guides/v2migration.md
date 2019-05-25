---
id: ios-v2migration
title: 2.0迁移指南
---

## 新增功能：

1. 云端录制：创建房间时，选择可回放房间，SDK 服务器会在云端自动录制
1. 回放功能：提供回放API
1. 白板页面管理功能


>v1.0与v2.0房间不互通；但是 SDK 所使用的 Token 不需要更新。  
v2.0移除了部分 API，您需要通过下面的文档，使用新 API 实现。

*我们不会关闭 v1.0 的服务，但我们依然推荐你迁移到 v2.0。*

## 新增概念:场景

首先，为了增强白板的页面管理功能，我们引入一些新概念：场景以及场景目录。
如果您不能理解场景这个概念，我们建议您参考资源管理器以及文件的概念，进行参考。

场景目前主要包括：场景名，PPT（背景图），PPT宽，PPT高 这几个内容。
还有一个与场景有关，不是由场景本身持有的内容：场景路径。场景路径由场景目录+场景名，后者由场景本身持有。

场景目录，则是文件的所在目录。（SDK 中的场景目录，格式参考的是 Unix 系统下的文件格式。`\dir1\dir`）

>推荐阅读 [场景管理](./scenes.md) 

## 修改的 API

2.0的 API 修改主要在场景这一块。为了支持更复杂的页面管理需求，我们抛弃了过去，白板是一串页面数组的形式。转而使用资源管理器的方式进行管理。

### PPT API

#### 获取 ppt API

我们仍然提供获取 ppt API，但是我们不再推荐使用此 API。因为即使您获取到了 ppt 地址，也无法通过ppt地址所在的index 索引进行页面管理。所以，我们更推荐使用以下的方法获取当前页面的内容：

```Objective-C
//返回当前场景目录下，所有的场景，ppt属性可能为空。
[whiteRoom getScenesWithResult:^(NSArray<WhiteScene *> * _Nonnull scenes) {
    for (WhiteScene *s in scenes) {
        NSLog(@"ppt:%@", s.ppt.src);
    }
}];

//获取的 WhiteSceneState 中，有当前场景目录，该场景目录下所有的场景列表，当前场景在场景列表中的索引。
[whiteRoom getSceneStateWithResult:^(WhiteSceneState * _Nonnull state) {
    NSLog(@"sceneState:%@", state);
}];
```

目前，您需要自行管理场景目录。如果您没有多个场景列表（多维数组）的需求。我建议您使用固定的场景目录（例如"\"）。

#### 插入 PPT API

旧方法：

```Objective-C
- (void)pushPptPages:(NSArray<WhitePptPage *>*)pptPages;
```

新方法：

```Objective-C
/**
 插入，或许新建多个页面

 @param dir scence 页面组名称，相当于目录。
 @param scenes WhiteScence 实例；在生成 WhiteScence 时，可以同时配置 ppt
 @param index 选择在页面组，插入的位置。index 即为新 scence 的 index 位置。如果想要放在最末尾，可以传入 NSUIntegerMax。
 */
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
```

### 页面管理 API

#### 删除页面 API

旧方法:

```Objective-C
- (void)removePage:(NSInteger)page;
```

新方法：

```Objective-C
/**
 当有
 /ppt/page0
 /ppt/page1
 传入 "/ppt/page0" 时，则只删除对应页面。
 传入 "/ppt" 时，会将两个页面一起移除。

 @param dirOrPath 页面具体路径，或者为页面组路径
 */
- (void)removeScenes:(NSString *)dirOrPath;
```

现在删除，不再接受index 索引，对应的，接受的是场景的路径，或者是目录。

#### 插入页面 API

```Objective-C
/**
 插入，或许新建多个页面

 @param dir scence 页面组名称，相当于目录。
 @param scenes WhiteScence 实例；在生成 WhiteScence 时，可以同时配置 ppt
 @param index 选择在页面组，插入的位置。index 即为新 scence 的 index 位置。如果想要放在最末尾，可以传入 NSUIntegerMax。
 */
- (void)putScenes:(NSString *)dir scenes:(NSArray<WhiteScene *> *)scenes index:(NSUInteger)index;
```

现在插入页面 API，增加了插入时，自定义内容（ppt）的接口。所以插入页面 API 和插入 PPT API，现在已经合并成了同一个 API。

*我们现在提供新API支持移动，重命名白板页面*

### 图片替换 API

由于图片替换 API，同时对互动房间与回放生效，所以我们不再将其放在 `WhiteRoomCallbackDelegate` 中，而是转而放在 `WhiteCommonCallbackDelgate` 中。

如需启用，请在初始化 SDK 时，将 `WhiteSdkConfiguration` 的 `enableInterrupterAPI` 属性，设置为 YES。
并在初始化时，使用一下方法传入实现了该 protocol 的实例 

```Objective-C
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback
```

或者在想要使用时，调用 `whiteSDK` 的 `setCommonCallbackDelegate:` 方法，设置。