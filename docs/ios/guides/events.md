---
id: ios-events
title: Custom event
---

During the use of the developer, there are likely to be other diverse requirements. The SDK also provides some custom interfaces for developers to implement.
You can simply compare this function to the iOS Notification Center `NSNotificationCenter`.
The custom event API is similar to the notification center.

## Register, remove, send custom events

### Real-time room

```Objective-C
@interface WhiteRoom : NSObject

// Register custom eventName
- (void) addMagixEventListener: (NSString *) eventName;
/**
    eventName event name sent
    Payload data attached to the event
 */
- (void) dispatchMagixEvent: (NSString *) eventName payload: (NSDictionary *) payload;
// Remove the custom event listener for eventName
- (void) removeMagixEventListener: (NSString *) eventName;
@end
```

### Playback Room

> New in version 2.0.4

```Objective-C
@interface WhitePlayer : NSObject

// Register custom eventName
- (void) addMagixEventListener: (NSString *) eventName;
// Remove the custom event listener for eventName
- (void) removeMagixEventListener: (NSString *) eventName;

@end
```

## Custom event callback

### Real-time room

When a registered custom event is triggered, the SDK will call back an instance that implements the WhiteRoomCallbackDelegate protocol when a WhiteRoom instance is created using WhiteSDK. which is

```Objective-C
@interface WhiteSDK : NSObject
- (instancetype)initWithBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config callbackDelegate:(id<WhiteRoomCallbackDelegate>)callbackDelegate
@end
``` 

`CallbackDelegate` parameter.


When a user sends a custom event with the corresponding name in the room, the SDK will callback the method of `WhiteRoomCallbackDelegate`:

```Objective-C
@protocol WhiteRoomCallbackDelegate <NSObject>
@optional
// Custom event callback event
- (void)fireMagixEvent:(WhiteEvent *)event;
@end
```

### Playback Room

> New in version 2.0.4

Similar to a real-time room, when a custom event occurs during playback, the SDK will call back when the WhitePlayer instance is created in WhiteSDK, and an instance that implements the WhitePlayerEventDelegate protocol is passed in. which is

```Objective-C
@interface WhiteSDK : NSObject
- (void)createReplayerWithConfig:(WhitePlayerConfig *)config callbacks:(nullable id<WhitePlayerEventDelegate>)eventCallbacks completionHandler:(void (^) (BOOL success, WhitePlayer * _Nullable player, NSError * _Nullable error))completionHandler;
@end
```

When a user sends a custom event with the corresponding name during playback, the SDK will call back the method of `WhiteRoomCallbackDelegate`:

```Objective-C
@protocol WhitePlayerEventDelegate <NSObject>
@optional
/**
Whiteboard custom event callback,
 */
- (void)fireMagixEvent:(WhiteEvent *)event;
@end
```