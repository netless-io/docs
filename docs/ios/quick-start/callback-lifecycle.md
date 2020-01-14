---
id: ios-callback-lifecycle
title: Callback and lifecycle
---

The relevant code of this article can be viewed in the `WhiteRoomViewController` of the [Demo](declaration.md#demo) project.

The `WhiteRoomViewController` part implements the` WhiteRoomCallbackDelegate` protocol, which defines the `WhiteRoomCallbacks.h` file that can be viewed in the SDK.

[Join Room](./join-room.md) When calling the Join Room operation, `id <WhiteRoomCallbackDelegate>) callbacks` is passed in. When the following status callback occurs on the whiteboard, the SDK will callback the` id <WhiteRoomCallbackDelegate>) callbacks` interface.

## Callback event

```Objective-C
//WhiteRoomCallbacks.h
@protocol WhiteRoomCallbackDelegate <NSObject>

@optional

/** Whiteboard network connection status callback event */
- (void)firePhaseChanged:(WhiteRoomPhase)phase;

/**
 The RoomState property in the whiteboard will trigger this callback when it changes.
 Note: The RoomState that is actively set will not trigger this callback.
 Currently there are individual state contents, which are also triggered when actively called.
 @param modifyState RoomState content changed
 */
- (void)fireRoomStateChanged:(WhiteRoomState *)modifyState;

- (void)fireBeingAbleToCommitChange:(BOOL)isAbleToCommit;

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

### Disconnection and reconnection

When the room is disconnected unexpectedly, the SDK first reconnects.
As the connection status of the room changes, SDK will call back to the callback proxy passed in the Room API, and call the `- (void) firePhaseChanged:` method implemented by it.

When the SDK fails to reconnect automatically, you can use SDK to join the room API and reconnect. (If callbacks are not passed in, the callbacks proxy will not be changed.)

```Objective-C
- (void)firePhaseChanged:(WhiteRoomPhase)phase
{
    NSLog(@"%s, %ld", __FUNCTION__, (long)phase);
    // Add some judgments, because this API will also be called back when the SDK first joins the room.
    if (phase == WhiteRoomPhaseDisconnected && self.sdk && !self.isReconnecting) {
        self.reconnecting = YES;
        [self.sdk joinRoomWithUuid:self.roomUuid roomToken:self.roomToken completionHandler:^(BOOL success, WhiteRoom *room, NSError *error) {
            self.reconnecting = NO;
            NSLog(@"reconnected");
            if (error) {
                NSLog(@"error:%@", [error localizedDescription]);
            } else {
                self.room = room;
            }
        }];
    }
}
```