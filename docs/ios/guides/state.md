---
id: ios-state
title: 状态管理
---

## 获取白板状态

### 1. 房间状态

```Objective-C
@interface WhiteRoom : NSObject

/** 获取当前房间 GlobalState */
- (void)getGlobalStateWithResult:(void (^) (WhiteGlobalState *state))result;
/** 获取当前房间 WhiteMemberState:教具 */
- (void)getMemberStateWithResult:(void (^) (WhiteMemberState *state))result;
/** 获取当前房间 WhiteRoomMember：房间成员信息 */
- (void)getRoomMembersWithResult:(void (^) (NSArray<WhiteRoomMember *> *roomMembers))result;
/** 获取当前缩放比例 */
- (void)getZoomScaleWithResult:(void (^) (CGFloat scale))result;
/** 获取当前视角状态 */
- (void)getBroadcastStateWithResult:(void (^) (WhiteBroadcastState *state))result;
/** 获取当前房间状态，包含 globalState，教具，房间成员信息，缩放，SceneState，用户视角状态 */
- (void)getRoomStateWithResult:(void (^) (WhiteRoomState *state))result;


/**
 获取所有 ppt 图片，回调内容为所有 ppt 图片的地址。
 @param result 如果当前页面，没有插入过 PPT，则该页面会返回一个空字符串
 */
- (void)getPptImagesWithResult:(void (^) (NSArray<NSString *> *pptPages))result DEPRECATED_MSG_ATTRIBUTE("使用 getScenesWithResult:");

@end
```

### 2. Player 状态

```Objective-C
@interface WhitePlayer : NSObject

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

## 订阅白板状态变化

当白板状态发生变化时，sdk 会回调创建时传入的 delegate 实例。

v2版本将事件回调拆分成了三种。v1版本中的图片替换功能，由于在 Room 以及 Player 中，都会被调用，所以剥离到了通用回调中。

### 1. 通用回调

在创建 WhiteSDK 时，直接传入实现了对应协议的实例，后续有需要时，就会回调。

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
 启用改功能，需要在初始化 SDK 时，在 WhiteSDKConfig 设置 enableInterrupterAPI 为 YES; 初始化后，无法更改。
 之后，在调用插入图片API/插入scene 时，会回调该 API，允许拦截修改最后传入的图片地址。
 在回放中，也会持续调用。
 */
- (NSString *)urlInterrupter:(NSString *)url;

@end

```

#### 修改通用回调

可以通过 WhiteSDK 下述方法进行修改

```Objective-C
@interface WhiteSDK : NSObject

/** 为空，则移除原来的 CommonCallbacks */
- (void)setCommonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callbackDelegate;

@end
```

### 2. 房间状态回调

在加入房间时，使用 

`- (void)joinRoomWithRoomUuid:(NSString *)roomUuid roomToken:(NSString *)roomToken callbacks:(nullable id<WhiteRoomCallbackDelegate>)callbacks completionHandler:(void (^) (BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error))completionHandler;
` API，传入实现 WhiteRoomCallbackDelegate 的实例类。

*传入 nil 时，不会修改当 roomCallback 回调，也不会移除之前设置的实例*

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

/*
 该 API 迁移至 WhiteCommonCallback
 */
//- (NSString *)urlInterrupter:(NSString *)url;

@end
```

### 3. Player 状态回调

v2版本中，我们增加了2.0版本的回调状态，以便得知回放时，房间的状态变化。
在创建 Player 时，一起传入即可。

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
/** 用户头像信息变化 */
- (void)cursorViewsUpdate:(WhiteUpdateCursor *)updateCursor;

@end

```
