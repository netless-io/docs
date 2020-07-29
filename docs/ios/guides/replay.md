---
id: ios-replay
title: 回放
---

>创建房间时，需要设置为可回放房间。由于回放房间会占用更多资源，需要开发者主动设置。  
具体请在 [服务器文档](docs/server/api/server-room) 中查看 创建白板 API。

## 快速开始

```Objective-C
@interface WhitePlayerViewController ()<WhitePlayerEventDelegate>
@end

@implementation WhitePlayerViewController

//配置 SDK 设置
WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
config.enableDebug = YES;
//通过实例化，并已经添加在视图栈中 Whiteboard，初始化 WhiteSDK。
self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self];
//初始化回放配置类
WhitePlayerConfig *playerConfig = [[WhitePlayerConfig alloc] initWithRoom:@"uuid" roomToken:@"roomToken"];
//回放房间，支持播放m3u8地址。可以播放 rtc 录制的声音内容。
playerConfig.audioUrl = @"https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8";
//创建 whitePlayer 实例，进行回放

[self.sdk createReplayerWithConfig:playerConfig callbacks:self completionHandler:^(BOOL success, WhitePlayer * _Nonnull player, NSError * _Nonnull error) {
    if (error) {
        NSLog(@"创建回放房间失败 error:%@", [error localizedDescription]);
    } else {
        self.player = player;
        NSLog(@"创建回放房间成功，开始回放");
        [self.player seekToScheduleTime:0];
        [self.player play];
    }
}];

#pragma mark - WhitePlayerEventDelegate
//见 WhitePlayerEvent 类解释
- (void)phaseChanged:(WhitePlayerPhase)phase
{
    NSLog(@"player %s %ld", __FUNCTION__, (long)phase);
}

- (void)loadFirstFrame
{
    NSLog(@"player %s", __FUNCTION__);
}

- (void)sliceChanged:(NSString *)slice
{
    NSLog(@"player %s slice:%@", __FUNCTION__, slice);
}

- (void)playerStateChanged:(WhitePlayerState *)modifyState
{
    NSString *str = [modifyState jsonString];
    NSLog(@"player %s state:%@", __FUNCTION__, str);
}

- (void)stoppedWithError:(NSError *)error
{
    NSLog(@"player %s error:%@", __FUNCTION__, error);
}

- (void)scheduleTimeChanged:(NSTimeInterval)time
{
    NSLog(@"player %s time:%f", __FUNCTION__, (double)time);
}

@end
```

>以上代码，可以在 [Whiteboard](https://github.com/netless-io/Whiteboard-ios) Example 中的 WhitePlayerViewController 中查看。

### 视频回放

>2.5.0 (开源版本 SDK)开始，新增`WhiteCombinePlayer`类，支持白板+视频的回放方式。

* 实现步骤：

1. 初始化`WhiteCombinePlayer`。
2. 在`WhitePlayer`的`- (void)phaseChanged:(WhitePlayerPhase)phase` 回调中，主动更新 `WhiteCombinePlayer`的`whitePlayer`状态。
3. 初始化`WhiteVideoView`，并调用`- (void)setAVPlayer:(AVPlayer *)player`方法，传入`CombinePlayer`的`nativePlayer`。

>可以在[开源版本 SDK](../overview/ios-open-source)的 example 中查看示例代码。

## 详细类与 API

### WhitePlayerConfig

用于初始化 WhitePlayer，传入特定的参数，通过设置 beginTimestamp，来确定开始回放的 UTC 时间。设置 duration，来确定持续时间。

```Objective-C
@interface WhitePlayerConfig : WhiteObject

- (instancetype)initWithRoom:(NSString *)roomUuid roomToken:(NSString *)roomToken;

/** 房间UUID，目前必须要有 */
@property (nonatomic, copy, nonnull) NSString *room;
/** 分片 ID，可以跳转至特定的房间位置，目前可以不关心。 */
@property (nonatomic, copy, nullable) NSString *slice;
/** 传入对应的UTC 时间戳(秒)，如果正确，则会在对应的位置开始播放。 */
@property (nonatomic, strong, nullable) NSNumber *beginTimestamp;
/** 传入持续时间（秒），当播放到对应位置时，就不会再播放。如果不设置，则从开始时间，一直播放到房间结束。 */
@property (nonatomic, strong, nullable) NSNumber *duration;
/** 音频地址。
 传入视频，也只会播放音频部分。设置后，sdk 会负责与白板同步播放 。
 如需播放音频，请使用 WhiteNativePlayer 模块中的 WhiteCombinePlayer。
 */
@property (nonatomic, strong, nullable) NSString *audioUrl;
@end
```

>目前：持续时间只有在传入了开始 UTC 时间戳的时候，才生效。

回放类，可以将该类看做一个视频播放器。有类似播放器的播放，暂停等功能，并且可以通过 get API，获取一些 Player 的当前状态。  

>Player 主动的状态变化回调，请在 [状态管理](./state.md) 或者 `WhitePlayerEvent` 查看

```Objective-C

@interface WhitePlayer : NSObject

- (void)play;
- (void)pause;
//stop 后，player 资源会被释放。需要重新创建，才可以重新播放
- (void)stop;
//跳转至特定时间（开始时间为 0）
- (void)seekToScheduleTime:(NSTimeInterval)beginTime;
//设置查看模式
- (void)setObserMode:(WhiteObserverMode)mode;

//获取播放状态
- (void)getPhaseWithResult:(void (^)(WhitePlayerPhase phase))result;
//获取 PlayerState
- (void)getPlayerStateWithResult:(void (^) (WhitePlayerState *state))result;
//获取播放信息
- (void)getPlayerTimeInfoWithResult:(void (^) (WhitePlayerTimeInfo *info))result;

```

### WhiteConsts.h

部分枚举常量，用来表示当前的跟随模式，以及播放状态。

```Objective-C
typedef NS_ENUM(NSInteger, WhiteObserverMode) {
    WhiteObserverModeDirectory, //跟随模式
    WhiteObserverModeFreedom    //自由模式
};

typedef NS_ENUM(NSInteger, WhitePlayerPhase) {
    WhitePlayerPhaseWaitingFirstFrame,  //等待第一帧
    WhitePlayerPhasePlaying,            //播放状态
    WhitePlayerPhasePause,              //暂停状态
    WhitePlayerPhaseStopped,            //停止
    WhitePlayerPhaseEnded,              //播放结束
    WhitePlayerPhaseBuffering,          //缓冲中
};
```

### WhitePlayerEvent

`WhitePlayerEvent` 本身不对外暴露 API。  
开发者在创建 `WhitePlayer` 时，需要传入一个实现了 `WhitePlayerEventDelegate` 协议的实例。Player 触发特定事件时，`WhitePlayerEvent` 会回调该实例。

```Objective-C
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
/**
 2.0.4新增API
 白板自定义事件回调，
 自定义事件参考文档，或者 RoomTests 代码
 */
- (void)fireMagixEvent:(WhiteEvent *)event;
@end
```

### WhitePlayerState

类似于 `WhiteRoom` 的 `WhiteRoomState` ，储存了回放房间的一些状态。

```Objective-C
@interface WhitePlayerState : WhiteObject

@property (nonatomic, strong, readonly, nullable) WhiteGlobalState *globalState;
/** 房间用户状态 */
@property (nonatomic, strong, readonly, nullable) NSArray<WhiteRoomMember *> *roomMembers;
// 该 API 获取的信息不正确，为防止使用该 API 获取到不正确的内容，2.0.4 版本，已移除该 API
//@property (nonatomic, strong, readonly, nullable) WhiteObserverState *observerState;
/** 用户观察状态 */
@property (nonatomic, assign, readonly) WhiteObserverMode observerMode;
/** 场景状态 */
@property (nonatomic, strong, readonly, nullable) WhiteSceneState *sceneState;

@end
```