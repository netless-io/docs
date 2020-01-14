---
id: ios-replay
title: Replay
---

> When creating a room, you need to set it as a replayable room. Since the playback room consumes more resources, it needs to be set up by the developer.
For details, please refer to [Server Documentation](../../server/api/whiteboard-base.md) Create Whiteboard API.

## Quick start

```Objective-C
@interface WhitePlayerViewController ()<WhitePlayerEventDelegate>
@end

@implementation WhitePlayerViewController

// Configure SDK settings
WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
config.enableDebug = YES;
// Initialize WhiteSDK by instantiating and adding Whiteboard to the view stack.
self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self];
// Initialize the playback configuration class
WhitePlayerConfig *playerConfig = [[WhitePlayerConfig alloc] initWithRoom:@"uuid" roomToken:@"roomToken"];
// Playback room, support playing m3u8 address. Can play audio content recorded by rtc.
playerConfig.audioUrl = @"https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8";
// Create a whitePlayer instance for playback

[self.sdk createReplayerWithConfig:playerConfig callbacks:self completionHandler:^(BOOL success, WhitePlayer * _Nonnull player, NSError * _Nonnull error) {
    if (error) {
        NSLog(@"Failed to create playback room error:%@", [error localizedDescription]);
    } else {
        self.player = player;
        NSLog(@"Create playback room successfully, start playback");
        [self.player seekToScheduleTime:0];
        [self.player play];
    }
}];

#pragma mark - WhitePlayerEventDelegate
//See WhitePlayerEvent class explanation
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

> The above code can be viewed in the WhitePlayerViewController in [Whiteboard](https://github.com/netless-io/Whiteboard-ios) Example.

### Video playback

> 2.5.0 (open source version SDK). Added the `WhiteCombinePlayer` class to support whiteboard video playback.

* Implementation steps:

1. Initialize `WhiteCombinePlayer`.
2. In the `-(void) phaseChanged: (WhitePlayerPhase) phase` callback of` WhitePlayer`, actively update the `whitePlayer` status of` WhiteCombinePlayer`.
3. Initialize `WhiteVideoView`, and call`-(void) setAVPlayer: (AVPlayer *) player` method, and pass in `nativePlayer` of` CombinePlayer`.

> You can view the sample code in the example of [Open Source Version SDK] (../ overview / ios-open-source).

## Detailed classes and APIs

### WhitePlayerConfig

Used to initialize WhitePlayer, pass in specific parameters, and set the beginTimestamp to determine the UTC time to start playback. Set duration to determine the duration.

```Objective-C
@interface WhitePlayerConfig : WhiteObject

- (instancetype)initWithRoom:(NSString *)roomUuid roomToken:(NSString *)roomToken;

/** Room UUID, currently must have */
@property (nonatomic, copy, nonnull) NSString * room;
/** Fragment ID, which can jump to a specific room location, which can be ignored at present. */
@property (nonatomic, copy, nullable) NSString * slice;
/** Pass in the corresponding UTC timestamp (seconds). If correct, playback will start at the corresponding position. */
@property (nonatomic, strong, nullable) NSNumber * beginTimestamp;
/** Incoming duration (seconds), when the corresponding position is played, it will not be played again. If not set, it will play from the start time to the end of the room. */
@property (nonatomic, strong, nullable) NSNumber * duration;
/** Audio address.
 Incoming video will only play the audio part. Once set, the SDK will be responsible for synchronous playback with the whiteboard.
 To play audio, use WhiteCombinePlayer in the WhiteNativePlayer module.
 */
@property (nonatomic, strong, nullable) NSString *audioUrl;
@end
```

> Current: Duration takes effect only when the start UTC timestamp is passed in.

Playback class, you can think of this class as a video player. There are functions similar to player playback, pause, etc., and the current status of some Players can be obtained through the get API.

> Player Active state change callback, please check in [State Management] (./ state.md) or `WhitePlayerEvent`

```Objective-C

@interface WhitePlayer : NSObject

- (void)play;
- (void)pause;
// stop, the player resource will be released. Need to be recreated before it can be replayed
- (void)stop;
// Jump to a specific time (start time is 0)
- (void)seekToScheduleTime:(NSTimeInterval)beginTime;
// Set viewing mode
- (void)setObserMode:(WhiteObserverMode)mode;

// Get playback status
- (void)getPhaseWithResult:(void (^)(WhitePlayerPhase phase))result;
// Get PlayerState
- (void)getPlayerStateWithResult:(void (^) (WhitePlayerState *state))result;
// Get playback information
- (void)getPlayerTimeInfoWithResult:(void (^) (WhitePlayerTimeInfo *info))result;

```

### WhiteConsts.h

Some enumeration constants are used to indicate the current follow mode and playback status.

```Objective-C
typedef NS_ENUM(NSInteger, WhiteObserverMode) {
    WhiteObserverModeDirectory, // Follow Mode
    WhiteObserverModeFreedom // Free mode
};

typedef NS_ENUM(NSInteger, WhitePlayerPhase) {
    WhitePlayerPhaseWaitingFirstFrame, // Wait for the first frame
    WhitePlayerPhasePlaying, // Playing status
    WhitePlayerPhasePause, // Pause status
    WhitePlayerPhaseStopped, // Stop
    WhitePlayerPhaseEnded, // End of playback
    WhitePlayerPhaseBuffering, // In buffering
};
```

### WhitePlayerEvent

`WhitePlayerEvent` itself does not expose the API.
When creating a WhitePlayer, developers need to pass in an instance that implements the WhitePlayerEventDelegate protocol. When the Player triggers a specific event, `WhitePlayerEvent` will call back the instance.

```Objective-C
@protocol WhitePlayerEventDelegate <NSObject>

@optional

/** Playback status switching callback */
-(void) phaseChanged: (WhitePlayerPhase) phase;
/** First frame loading callback */
-(void) loadFirstFrame;
/** Shard switching callback, you need to understand the sharding mechanism. No actual use at this time */
-(void) sliceChanged: (NSString *) slice;
/** Callback when status changes during playback */
-(void) playerStateChanged: (WhitePlayerState *) modifyState;
/** Pause on error */
-(void) stoppedWithError: (NSError *) error;
/** Progress time change */
-(void) scheduleTimeChanged: (NSTimeInterval) time;
/** Error adding frame */
-(void) errorWhenAppendFrame: (NSError *) error;
/** Error during rendering */
-(void) errorWhenRender: (NSError *) error;
/**
 2.0.4 New API
 Whiteboard custom event callback,
 Custom event reference documentation, or RoomTests code
 */
-(void) fireMagixEvent: (WhiteEvent *) event;
@end
```

### WhitePlayerState

`WhiteRoomState`, similar to `WhiteRoom`, stores some states of the playback room.

```Objective-C
@interface WhitePlayerState : WhiteObject

@property (nonatomic, strong, readonly, nullable) WhiteGlobalState * globalState;
/** Room user status */
@property (nonatomic, strong, readonly, nullable) NSArray <WhiteRoomMember *> * roomMembers;
// The information obtained by this API is incorrect. In order to prevent the use of this API to obtain incorrect content, version 2.0.4, this API has been removed
// @ property (nonatomic, strong, readonly, nullable) WhiteObserverState * observerState;
/** User observation status */
@property (nonatomic, assign, readonly) WhiteObserverMode observerMode;
/** Scene status */
@property (nonatomic, strong, readonly, nullable) WhiteSceneState * sceneState;

@end
```