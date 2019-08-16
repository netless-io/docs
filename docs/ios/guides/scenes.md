---
id: ios-scenes
title: 场景管理
---

## 截图功能

> 2.3.0 新增 API，回放房间与实时房间，均支持该功能

截图大小为当前回放/实时房间展示时的大小。

```Objective-C
// 该类为 WhiteRoom 与 WhitePlayer 的父类
@interface WhiteDisplayer : NSObject
/**
 截取用户切换时，看到的场景内容，不是场景内全部内容。
 FIXME：图片支持：只有当图片服务器支持跨域，才可以显示在截图中

 @param scenePath 想要截取场景的场景路径，例如 /init；输入不存在场景路径，会返回空白图片
 @param completionHandler 回调函数，image 可能为空
 */
- (void)getScenePreviewImage:(NSString *)scenePath completion:(void (^)(UIImage * _Nullable image))completionHandler;

/**
 场景封面截图，会包含场景内全部内容
 FIXME：图片支持：只有当图片服务器支持跨域，才可以显示在截图中

 @param scenePath 想要截取场景的场景路径，例如 /init；输入不存在场景路径，会返回空白图片
 @param completionHandler  回调函数，image 可能为空
 */
- (void)getSceneSnapshotImage:(NSString *)scenePath completion:(void (^)(UIImage * _Nullable image))completionHandler;

@end
```

## 相关类

首先，我们需要知道场景类： `WhiteScene` 和 `WhitePptPage` 类。

>请注意：SDK中的类，都是配置数据，用于向白板传递数据用，并不持有任何白板实例

### WhitePptPage 类

WhitePptPage 类，是 ppt 相关的配置信息。在创建 WhiteScene 类时传入，再通过插入场景 API时，生成带背景图片的白板页面。

```
@interface WhitePptPage : WhiteObject

//图片地址
@property (nonatomic, copy) NSString *src;
@property (nonatomic, assign) CGFloat width;
@property (nonatomic, assign) CGFloat height;

@end
```

图片中心为白板页面的中心点。

### WhiteScene 类

```Objective-C
@interface WhiteScene : WhiteObject

- (instancetype)init;
- (instancetype)initWithName:(nullable NSString *)name ppt:(nullable WhitePptPage *)ppt;

@property (nonatomic, copy, readonly) NSString *name;
//可以通过该属性是否为0，来判断该页面是否有内容。（该数字不计算 ppt，只有 ppt 时，也是0）。
@property (nonatomic, assign, readonly) NSInteger componentsCount;
@property (nonatomic, strong, readonly, nullable) WhitePptPage *ppt;
@end
```

WhiteScene 管理了一个白板页面，其中包含了 name，并且接管了原来的 ppt 内容。
白板页面只有在创建时，才接受 ppt 参数。

### WhiteSceneState 类

```Objective-C
@interface WhiteSceneState : WhiteObject
//当前场景组的所有场景
@property (nonatomic, nonnull, strong, readonly) WhiteScene *scenes;
//当前场景组目录
@property (nonatomic, nonnull, strong, readonly) NSString *scenePath;
//当前场景，在 scenes 数组中的索引位置。
@property (nonatomic, assign, readonly) NSInteger index;
@end
```

该类描述了当前场景目录的状态。

## API 介绍

请查看 [进阶文档-场景管理](/docs/blog/advance-scenes?platform=ios)
