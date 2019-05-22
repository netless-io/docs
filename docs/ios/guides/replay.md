---
id: ios-replay
title: 回放
---

在教育领域中，上完课之后往往需要记录板书让学生可以复习使用；在会议场景下，会后也需要发出完整的会议记录来帮助后面执行讨论的成果。

为了更好的满足客户对回放的需求，我们在云端提供的白板回放的录制功能，客户再也不用花费高昂的人力物力去手动录制成视频来提供回放功能。

并且相比传统的录制方式，我们的『白板回放加音频回放』的组合方案具备诸多优势如下：

- 高清播放、低带宽占用。方便用流量观看、以及在校园网等网络环境不稳定的场景下观看。
- 观看时支持缩放操作（zoom in & zoom out），方便客户用手机等移动端设备观看。
- 支持在微信朋友圈、小程序等流量平台传播课程。
- 无需老师或者工作人员介入，自动在云端完成。

**创建房间时，需要设置为可回访房间，由于回放房间会占用更多资源，需要开发者主动设置。**

具体请在 [服务器文档](zh-CN/v2/server-detail-api.md) 中查看 创建白板 API**

房间有三种模式：临时房间、持久化房间、可回放房间。房间模式必须在创建时指定，一旦确定，将不可修改。这三种模式的特征如下。

## 创建回放——快速开始

```Objective-C
//配置 SDK 设置
WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
config.enableDebug = YES;
//通过实例化，并已经添加在视图栈中 Whiteboard，初始化 WhiteSDK。
self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self];
//初始化回放配置类
WhitePlayerConfig *playerConfig = [[WhitePlayerConfig alloc] init];
//传入房间 UUID，还支持其他参数，在后续文档中，会逐步解释
playerConfig.room = @"填入房间 UUID";
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
```

* 以上代码，可以在 [White-SDK-iOS](https://github.com/duty-os/white-sdk-ios-release) Example 中的 WhitePlayerViewController 中查看。

### 详细类与 API

#### `WhitePlayerConfig` 

用于初始化 WhitePlayer，传入特定的参数，可以回放房间中，不同时间的画面。

```Objective-C
@interface WhitePlayerConfig : WhiteObject

- (instancetype)initWithRoom:(NSString *)roomUuid;

/** 房间UUID，目前必须要有 */
@property (nonatomic, copy, nonnull) NSString *room;
/** 分片 ID，可以跳转至特定的房间位置，目前可以不关心。 */
@property (nonatomic, copy, nullable) NSString *slice;
/** 传入对应的UTC 时间戳(秒)，如果正确，则会在对应的位置开始播放。 */
@property (nonatomic, strong, nullable) NSNumber *beginTimestamp;
/** 传入持续时间（秒），当播放到对应位置时，就不会再播放。如果不设置，则从开始时间，一直播放到房间结束。 */
@property (nonatomic, strong, nullable) NSNumber *duration;
/** m3u8地址，暂不支持视频。设置后，会与白板同步播放 */
@property (nonatomic, strong, nullable) NSString *audioUrl;
@end
```

#### WhiteConsts.h

表示部分枚举常量

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

#### WhitePlayerEvent

`WhitePlayerEvent` 本身不对外暴露 API，开发者在创建 WhitePlayer 时，需要传入一个实现了 `WhitePlayerEventDelegate` 的实例。当实现了对应Player 触发特定事件时，会调用该实例。

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
- (void)scheduleTimeChanged:(NSInteger)time;
/** 添加帧出错 */
- (void)errorWhenAppendFrame:(NSError *)error;
/** 渲染时，出错 */
- (void)errorWhenRender:(NSError *)error;
/** 用户头像信息变化 */
- (void)cursorViewsUpdate:(WhiteUpdateCursor *)updateCursor;

@end
```

#### WhitePlayer

```Objective-C

@interface WhitePlayer : NSObject

- (void)play;
- (void)pause;
//stop 后，player 资源会被释放。需要重新创建，才可以重新播放
- (void)stop;
//跳转至特定时间
- (void)seekToScheduleTime:(NSTimeInterval)beginTime;
//设置查看模式
- (void)setObserMode:(WhiteObserverMode)mode;
//设置跟随的用户
- (void)setFollowUserId:(NSInteger)userId;

@end
```

```Objective-C
//获取播放状态
- (void)getPhaseWithResult:(void (^)(WhitePlayerPhase phase))result;
//获取 PlayerState
- (void)getPlayerStateWithResult:(void (^) (WhitePlayerState *state))result;
//获取播放信息
- (void)getPlayerTimeInfoWithResult:(void (^) (WhitePlayerTimeInfo *info))result;

```

#### WhitePlayerState

类似于 `WhiteRoom` 的 `WhiteRoomState` 。储存了所有Player 当前状态的一些属性。

```Objective-C
@interface WhitePlayerState : WhiteObject

@property (nonatomic, strong, readonly, nullable) WhiteGlobalState *globalState;
/** 房间用户状态 */
@property (nonatomic, strong, readonly, nullable) NSArray<WhiteRoomMember *> *roomMembers;
/** 用户观察状态 */
@property (nonatomic, strong, readonly, nullable) WhiteObserverState *observerState;

@end
```