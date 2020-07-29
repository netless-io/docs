---
id: ios-callback-lifecycle
title: 生命周期以及事件回调
---

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteRoomViewController` 中查看。

`WhiteRoomViewController` 部分实现 `WhiteRoomCallbackDelegate` 协议，定义可以查看 SDK 的 `WhiteRoomCallbacks.h` 文件。 

[加入房间](./join-room.md) 在调用加入房间操作时，传入了 `id<WhiteRoomCallbackDelegate>)callbacks` ，当白板出现以下状态回调时，SDK 会回调 `id<WhiteRoomCallbackDelegate>)callbacks` 接口。

## 回调事件

```Objective-C
//WhiteRoomCallbacks.h 文件
@protocol WhiteRoomCallbackDelegate <NSObject>

@optional

/** 白板网络连接状态回调事件 */
- (void)firePhaseChanged:(WhiteRoomPhase)phase;

/**
 白板中RoomState属性，发生变化时，会触发该回调。
 注意：主动设置的 RoomState，不会触发该回调。
 目前有个别 state 内容，主动调用时，也会触发。
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

### 断线重连

当房间连接状态发生变化，SDK 会回调在加入房间时，传入的`id<WhiteRoomCallbackDelegate>`对象，调用对应`- (void)firePhaseChanged:` 方法。

当房间出现意外断连时，SDK 首先会进行三次重连操作，此时，房间状态处于`WhiteRoomPhaseReconnecting`。

```Objective-C
- (void)firePhaseChanged:(WhiteRoomPhase)phase
{
    if (self.room.disconnectedBySelf || self.isReconnecting || !self.sdk) {
        return;
    }
    
    if (phase == WhiteRoomPhaseDisconnected && self.roomUuid && self.roomToken) {
        self.reconnecting = YES;
        [self.sdk joinRoomWithUuid:self.roomUuid roomToken:self.roomToken completionHandler:^(BOOL success, WhiteRoom *room, NSError *error) {
            self.reconnecting = NO;
            NSLog(@"reconnected");
            if (error) {
                NSLog(@"error:%@", [error description]);
            } else {
                self.room = room;
            }
        }];
    }
}
```