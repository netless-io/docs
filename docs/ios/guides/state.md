---
id: ios-state
title: 状态管理
---

## 状态获取 API

> 2.4.0 版本新增 API：同步获取(实时房间/回放房间)状态 API

### 1. 实时房间状态（WhiteRoom）

```Objective-C

/** 状态获取，同步 API，使用 .property 进行读取 */
@interface WhiteRoom : WhiteDisplayer

#pragma mark - 同步 API
/** 全局状态 */
@property (nonatomic, strong, readonly) WhiteGlobalState *globalState;
/** 教具信息 */
@property (nonatomic, strong, readonly) WhiteReadonlyMemberState *memberState;
/** 白板在线成员信息 */
@property (nonatomic, strong, readonly) NSArray<WhiteRoomMember *> *roomMembers;
/** 视角状态信息，用户当前场景状态，主播信息 */
@property (nonatomic, strong, readonly) WhiteBroadcastState *broadcastState;
/** 缩放比例 */
@property (nonatomic, assign, readonly) CGFloat scale;
@property (nonatomic, strong, readonly) WhiteRoomState *state;
/** 场景状态 */
@property (nonatomic, strong, readonly) WhiteSceneState *sceneState;
/** 连接状态 */
@property (nonatomic, assign, readonly) WhiteRoomPhase phase;

@end

#pragma mark - 异步 API
/** 该部分 API，均为异步获取。可以使用同步 property 直接获取新数据 */
@interface WhiteRoom (Asynchronous)

/** 获取当前房间 GlobalState */
- (void)getGlobalStateWithResult:(void (^) (WhiteGlobalState *state))result;
/** 获取当前房间 WhiteMemberState:教具 */
- (void)getMemberStateWithResult:(void (^) (WhiteMemberState *state))result;
/** 获取当前房间 WhiteRoomMember：房间成员信息 */
- (void)getRoomMembersWithResult:(void (^) (NSArray<WhiteRoomMember *> *roomMembers))result;
/** 获取当前视角状态 */
- (void)getBroadcastStateWithResult:(void (^) (WhiteBroadcastState *state))result;
/** 获取当前房间连接状态 */
- (void)getRoomPhaseWithResult:(void (^) (WhiteRoomPhase phase))result;
/** 获取当前缩放比例 */
- (void)getZoomScaleWithResult:(void (^) (CGFloat scale))result;
/** 获取当前房间状态，包含 globalState，教具，房间成员信息，缩放，SceneState，用户视角状态 */
- (void)getRoomStateWithResult:(void (^) (WhiteRoomState *state))result;

@end

```

### 2. 回放房间状态（WhitePlayer）

```Objective-C
@interface WhitePlayer : WhiteDisplayer

@property (nonatomic, assign, readonly) WhitePlayerPhase phase;
/** 当 phase 处于 WhitePlayerPhaseWaitingFirstFrame 时，房间处于为开始状态，state 为空 */
@property (nonatomic, strong, readonly) WhitePlayerState *state;
@property (nonatomic, strong, readonly) WhitePlayerTimeInfo *timeInfo;

@end

/** 异步 API */
@interface WhitePlayer (Asynchronous)

/**
 目前：初始状态为 WhitePlayerPhaseWaitingFirstFrame
 当 WhitePlayerPhaseWaitingFirstFrame 时，调用 getPlayerStateWithResult 返回值可能为空。
 */
- (void)getPhaseWithResult:(void (^)(WhitePlayerPhase phase))result;

/**
 当 phase 状态为 WhitePlayerPhaseWaitingFirstFrame
 回调得到的数据是空的
 */
- (void)getPlayerStateWithResult:(void (^)(WhitePlayerState * _Nullable state))result;

/** 获取播放器信息（当前时长，总市场，开始 UTC 时间戳） */
- (void)getPlayerTimeInfoWithResult:(void (^)(WhitePlayerTimeInfo *info))result;

@end
```

## 状态变化回调 API

当房间发生状态变化，`sdk`会回调在创建时传入的`delegate`实例。

v2版本将事件回调拆分成了以下三种。其中v1版本中的图片替换功能，由于在实时房间与回放房间中，都需要调用，所以移动至通用回调中。

>同步 API 实际上就是通过监听状态变化回调，更新状态并进行缓存。在回调时，再通过状态获取的同步 API 查看状态时，状态值，已经发生改变。

### 1. 通用回调（图片，错误）

在创建`WhiteSDK`时，直接传入实现`WhiteCommonCallbackDelegate`协议的实例即可。

```Objective-C
@interface WhiteSDK : NSObject
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback;
@end
```

```Objective-C
@protocol WhiteCommonCallbackDelegate <NSObject>

@optional
/**
 当sdk出现未捕获的全局错误时，会在此处对抛出 NSError 对象
 */
- (void)throwError:(NSError *)error;

/*
 启用该功能，需要在初始化 SDK 时，在 WhiteSDKConfig 设置 enableInterrupterAPI 为 YES; 初始化后，无法更改。
 在插入图片API/插入scene（包含 ppt 参数）时，会回调该 API，允许修改最终图片地址。
 */
- (NSString *)urlInterrupter:(NSString *)url;

@end
```

#### 修改通用回调

```Objective-C
@interface WhiteSDK : NSObject
/** 为空，则移除原来的 CommonCallbacks */
- (void)setCommonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callbackDelegate;
@end
```

### 2. 实时房间回调（WhiteRoom）

在加入房间时，使用以下 API，传入实现`WhiteRoomCallbackDelegate`协议的实例。当实时房间状态发生变化时，`sdk`会自动回调该实例中的对应方法。

```Objective-C
- (void)joinRoomWithRoomUuid:(NSString *)roomUuid roomToken:(NSString *)roomToken callbacks:(nullable id<WhiteRoomCallbackDelegate>)callbacks completionHandler:(void (^) (BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error))completionHandler;
```

> `callbacks`参数传入 nil 时，不会修改`roomCallback`回调，也不会移除之前设置的回调。手动重连时，因此可以不传入`callbacks`。

```Objective-C
//WhiteRoomCallbacks.h 文件
@protocol WhiteRoomCallbackDelegate <NSObject>

@optional

/** 白板网络连接状态回调事件 */
- (void)firePhaseChanged:(WhiteRoomPhase)phase;

/**
 白板中RoomState属性，发生变化时，会触发该回调。
 注意：主动设置的 RoomState，不会触发该回调。
 目前有个别 state 内容，主动调用时，也会触发。后续版本会修复这个问题。
 @param modifyState 发生变化的 RoomState 内容
 */
- (void)fireRoomStateChanged:(WhiteRoomState *)modifyState;

- (void)fireBeingAbleToCommitChange:(BOOL)isAbleToCommit;

/** 白板失去连接回调，附带错误信息 */
- (void)fireDisconnectWithError:(NSString *)error;

/** 用户被远程服务器踢出房间，附带踢出原因 */
- (void)fireKickedWithReason:(NSString *)reason;

/** 用户错误事件捕获，附带用户 id，以及错误原因 */
- (void)fireCatchErrorWhenAppendFrame:(NSUInteger)userId error:(NSString *)error;

/**
 白板自定义事件回调，
 自定义事件参考文档，或者 RoomTests 代码
 */
- (void)fireMagixEvent:(WhiteEvent *)event;

@end
```

### 3. 回放房间回调（WhitePlayer）

与实时房间相似，回放房间在创建时，传入实现`WhitePlayerEventDelegate`协议的实例。当回放房间发生状态时，`sdk`会自动回调该实例的对应方法。

```Objective-C
@interface WhiteSDK : NSObject
- (void)createReplayerWithConfig:(WhitePlayerConfig *)config callbacks:(nullable id<WhitePlayerEventDelegate>)eventCallbacks completionHandler:(void (^) (BOOL success, WhitePlayer * _Nullable player, NSError * _Nullable error))completionHandler;
@end
```

```Objective-C

//WhitePlayerEvent.h 文件
@protocol WhitePlayerEventDelegate <NSObject>

@optional

/** 播放状态切换回调 */
- (void)phaseChanged:(WhitePlayerPhase)phase;
/** 首帧加载回调 */
- (void)loadFirstFrame;
/** 分片切换回调，需要了解分片机制。目前无实际用途 */
- (void)sliceChanged:(NSString *)slice;
/** 播放中，状态出现变化的回调 */
- (void)playerStateChanged:(WhitePlayerState *)modifyState;
/** 出错暂停 */
- (void)stoppedWithError:(NSError *)error;
/** 进度时间变化 */
- (void)scheduleTimeChanged:(NSTimeInterval)time;
/** 添加帧出错 */
- (void)errorWhenAppendFrame:(NSError *)error;
/** 渲染时，出错 */
- (void)errorWhenRender:(NSError *)error;

@end

```

## 自定义 GlobalState<span class="anchor" id="globalstate">

> 2.4.6 新增 API

实时房间状态中的`globalState`属性，为所有客户公共可读写状态；回放房间状态 `globalState` 为只读属性，修改不会生效。
如果说，自定义事件是同步自定义行为，那么`globalState`就是用来同步自定义状态的。

>2.0 版本一直设置自定义`globalState`状态。`setGlobalState:`API，传入自定义`globalState`子类即可将自定义内容传递给房间中其他用户。

开发者可以调用`WhiteDisplayerState`中的`+(BOOL)setCustomGlobalStateClass:`类方法，全局设置自定义`globalState`子类。

>swift 用户，继承`GlobalState`后，需要将想被转换的属性标记为`@objc`。

```Objective-C
@interface WhiteDisplayerState : WhiteObject<YYModel>

/**
 配置自定义全局状态类

 @param clazz 自定义全局状态类，必须是 WhiteGlobalState 子类，否则会清空该配置。
 @return 全局自定义类配置成功与否；返回 YES 则成功配置子类；返回 NO 则恢复为 WhiteGlobalState 类。
 */
+ (BOOL)setCustomGlobalStateClass:(Class)clazz;
@end
```

传入开发者自定义的`WhiteGlobalState`子类后，`WhiteRoomState`，`WhitePlayerState`在反序列化`globalState`时，都会将该内容自动反序列化为该子类。

>设置好自定义`globalState`后，不需要额外操作。只需要在使用原有 API 时，进行对应类型强制转换即可。