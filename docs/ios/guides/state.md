---
id: ios-state
title: State management
---

## Status Acquisition API

> New in version 2.4.0: Sync (Real-time Room / Playback Room) Status API

### 1. Real-time room status (WhiteRoom)

```Objective-C

/** Status acquisition, synchronous API, read with .property */
@interface WhiteRoom : WhiteDisplayer

#pragma mark-Synchronization API
/** Global status */
@property (nonatomic, strong, readonly) WhiteGlobalState * globalState;
/** Teaching aid information */
@property (nonatomic, strong, readonly) WhiteReadonlyMemberState * memberState;
/** Whiteboard Online Member Information */
@property (nonatomic, strong, readonly) NSArray <WhiteRoomMember *> * roomMembers;
/** Viewpoint status information, user's current scene status, anchor information */
@property (nonatomic, strong, readonly) WhiteBroadcastState * broadcastState;
/** scaling ratio */
@property (nonatomic, assign, readonly) CGFloat scale;
@property (nonatomic, strong, readonly) WhiteRoomState * state;
/** Scene status */
@property (nonatomic, strong, readonly) WhiteSceneState * sceneState;
/** Connection Status */
@property (nonatomic, assign, readonly) WhiteRoomPhase phase;

@end

#pragma mark-Asynchronous API
/ ** This part of the API is obtained asynchronously. New data can be fetched directly using synchronous properties * /
@interface WhiteRoom (Asynchronous)

/** Get the current room GlobalState */
- (void) getGlobalStateWithResult: (void (^) (WhiteGlobalState * state)) result;
/** Get the current room WhiteMemberState: teaching aids */
- (void) getMemberStateWithResult: (void (^) (WhiteMemberState * state)) result;
/** Get the current room WhiteRoomMember: Room member information */
- (void) getRoomMembersWithResult: (void (^) (NSArray <WhiteRoomMember *> * roomMembers)) result;
/** Get current view status */
- (void) getBroadcastStateWithResult: (void (^) (WhiteBroadcastState * state)) result;
/** Get the current room connection status */
- (void) getRoomPhaseWithResult: (void (^) (WhiteRoomPhase phase)) result;
/** Get the current zoom ratio */
- (void) getZoomScaleWithResult: (void (^) (CGFloat scale)) result;
/** Get the current room state, including globalState, teaching aids, room member information, zoom, SceneState, user perspective state */
- (void) getRoomStateWithResult: (void (^) (WhiteRoomState * state)) result;

@end

```

### 2. Playback Room Status (WhitePlayer)

```Objective-C
@interface WhitePlayer : WhiteDisplayer

@property (nonatomic, assign, readonly) WhitePlayerPhase phase;
/ ** When phase is in WhitePlayerPhaseWaitingFirstFrame, the room is in the starting state and the state is empty * /
@property (nonatomic, strong, readonly) WhitePlayerState *state;
@property (nonatomic, strong, readonly) WhitePlayerTimeInfo *timeInfo;

@end

/ ** Asynchronous API * /
@interface WhitePlayer (Asynchronous)

/**
 Currently: Initial state is WhitePlayerPhaseWaitingFirstFrame
 When WhitePlayerPhaseWaitingFirstFrame is called, the return value of calling getPlayerStateWithResult may be empty.
 */
- (void)getPhaseWithResult:(void (^)(WhitePlayerPhase phase))result;

/**
 When phase is WhitePlayerPhaseWaitingFirstFrame
 The data obtained by the callback is empty
 */
- (void)getPlayerStateWithResult:(void (^)(WhitePlayerState * _Nullable state))result;

/** Get player information (current time, total market, start UTC timestamp) */
- (void)getPlayerTimeInfoWithResult:(void (^)(WhitePlayerTimeInfo *info))result;

@end
```

## State Change Callback API

When the state of the room changes, `sdk` will call back the` delegate` instance passed in when it was created.

The v2 version splits event callbacks into the following three. Among them, the picture replacement function in the v1 version needs to be called in the real-time room and the playback room, so it is moved to the general callback.

> The synchronization API is actually listening to the state change callback, updating the state and caching. At the time of callback, when you check the status through the synchronization API obtained by the status, the status value has changed.

### 1. General callback (picture, error)

When creating `WhiteSDK`, you can directly pass in an instance that implements` WhiteCommonCallbackDelegate` protocol.

```Objective-C
@interface WhiteSDK : NSObject
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback;
@end
```

```Objective-C
@protocol WhiteCommonCallbackDelegate <NSObject>

@optional
/**
When an uncaught global error occurs in the SDK, an NSError object is thrown here
 */
- (void)throwError:(NSError *)error;

/*
To enable this function, you need to set enableInterrupterAPI to YES in the WhiteSDKConfig when initializing the SDK; it cannot be changed after initialization.
When inserting the image API / insert scene (including the ppt parameter), the API will be called back, allowing the final image address to be modified.
 */
- (NSString *)urlInterrupter:(NSString *)url;

@end
```

#### Modifying general callbacks

```Objective-C
@interface WhiteSDK : NSObject
/** is empty, remove the original CommonCallbacks */
- (void)setCommonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callbackDelegate;
@end
```

### 2. Real-time room callback (WhiteRoom)

When joining a room, use the following API to pass in an instance that implements the `WhiteRoomCallbackDelegate` protocol. When the real-time room status changes, `sdk` will automatically call back the corresponding method in this instance.

```Objective-C
- (void)joinRoomWithRoomUuid:(NSString *)roomUuid roomToken:(NSString *)roomToken callbacks:(nullable id<WhiteRoomCallbackDelegate>)callbacks completionHandler:(void (^) (BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error))completionHandler;
```

> When the `callbacks` parameter is passed to nil, the` roomCallback` callback will not be modified, and the previously set callbacks will not be removed. When reconnecting manually, it is not necessary to pass in `callbacks`.

```Objective-C
//WhiteRoomCallbacks.h
@protocol WhiteRoomCallbackDelegate <NSObject>

@optional

/** Whiteboard network connection status callback event */
- (void) firePhaseChanged: (WhiteRoomPhase) phase;

/**
 The RoomState property in the whiteboard will trigger this callback when it changes.
 Note: The RoomState that is actively set will not trigger this callback.
 Currently there are individual state contents, which are also triggered when actively called. This issue will be fixed in a future release.
 @param modifyState RoomState content changed
 */
- (void) fireRoomStateChanged: (WhiteRoomState *) modifyState;

- (void) fireBeingAbleToCommitChange: (BOOL) isAbleToCommit;

/** Whiteboard loses connection callback with error message */
- (void) fireDisconnectWithError: (NSString *) error;

/** The user was kicked out of the room by the remote server with a kick out reason */
- (void) fireKickedWithReason: (NSString *) reason;

/** User error event capture with user id and error cause */
- (void) fireCatchErrorWhenAppendFrame: (NSUInteger) userId error: (NSString *) error;

/**
 Whiteboard custom event callback,
 Custom event reference documentation, or RoomTests code
 */
- (void) fireMagixEvent: (WhiteEvent *) event;

@end
```

### 3. Playback Room Callback (WhitePlayer)

Similar to a real-time room, when a playback room is created, an instance that implements the `WhitePlayerEventDelegate` protocol is passed in. When the state of the playback room occurs, `sdk` will automatically call back the corresponding method of the instance.

```Objective-C
@interface WhiteSDK : NSObject
- (void)createReplayerWithConfig:(WhitePlayerConfig *)config callbacks:(nullable id<WhitePlayerEventDelegate>)eventCallbacks completionHandler:(void (^) (BOOL success, WhitePlayer * _Nullable player, NSError * _Nullable error))completionHandler;
@end
```

```Objective-C

//WhitePlayerEvent.h
@protocol WhitePlayerEventDelegate <NSObject>

@optional

/** Playback status switching callback */
- (void) phaseChanged: (WhitePlayerPhase) phase;
/** First frame loading callback */
- (void) loadFirstFrame;
/** Shard switching callback, you need to understand the sharding mechanism. No actual use at this time */
- void) sliceChanged: (NSString *) slice;
/** Callback when status changes during playback */
- (void) playerStateChanged: (WhitePlayerState *) modifyState;
/** Pause on error */
- (void) stoppedWithError: (NSError *) error;
/** Progress time change */
- (void) scheduleTimeChanged: (NSTimeInterval) time;
/** Error adding frame */
- (void) errorWhenAppendFrame: (NSError *) error;
/** Error during rendering */
- (void) errorWhenRender: (NSError *) error;
@end

```

## Custom GlobalState <span class = "anchor" id = "globalstate">

> 2.4.6 Added API

The globalState property in the real-time room state is a common read-write state for all customers; the playback room state globalState is a read-only property, and the modification will not take effect.
If the custom event is a synchronous custom behavior, then `globalState` is used to synchronize the custom state.

> 2.0 version always set custom `globalState` state. `setGlobalState:` API. Pass the custom `globalState` subclass to pass the custom content to other users in the room.

Developers can call the `(BOOL) setCustomGlobalStateClass:` class method in `WhiteDisplayerState` to set the custom` globalState` property globally.

```Objective-C
@interface WhiteDisplayerState : WhiteObject<YYModel>

/**
 Configure custom global state classes

 @param clazz Custom global state class, which must be a subclass of WhiteGlobalState, otherwise the configuration will be cleared.
 @return Global custom class configuration is successful or not; return YES to successfully configure subclasses; return NO to return to WhiteGlobalState class.
 */
  (BOOL) setCustomGlobalStateClass: (Class) clazz;
@end
`` `

After passing in the developer-defined `WhiteGlobalState` subclass,` WhiteRoomState`, `WhitePlayerState` will deserialize the content into this subclass automatically when deserializing` globalState`.

> After setting the custom `globalState`, no additional operations are required. You only need to cast the corresponding type when using the original API.