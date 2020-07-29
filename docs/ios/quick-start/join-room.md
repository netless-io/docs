---
id: ios-join-room
title: 加入房间
---

在完成创建房间/获取特定房间 RoomToken 操作，拿到房间 UUID 与房间 RoomToken 后，开发者可以调用 `WhiteSDK` `joinRoom` 相关的 API。

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteRoomViewController` 中查看。

## 加入房间

```Objective-C
@import UIKit;
#import "WhiteBaseViewController.h"

@interface WhiteRoomViewController : WhiteBaseViewController

@property (nonatomic, strong, nullable) WhiteRoom *room;

#pragma mark - CallbackDelegate
@property (nonatomic, weak, nullable) id<WhiteRoomCallbackDelegate> roomCallbackDelegate;

@end
```


```Objective-C

@implementation WhiteRoomViewController

- (void)joinRoomWithToken:(NSString *)roomToken
{

    ...

    WhiteRoomConfig *roomConfig = [[WhiteRoomConfig alloc] initWithUuid:@"UUID" roomToken:@"ROOMTOKEN"];
    
    [self.sdk joinRoomWithConfig:roomConfig callbacks:self.roomCallbackDelegate completionHandler:^(BOOL success, WhiteRoom * _Nonnull room, NSError * _Nonnull error) {
        if (success) {
            self.room = room;
        } else {
            // 错误处理
        }
    }];
}

@end
```

## 主动断开房间

调用主动断连 API 后，Room 对象将无法继续操作。如需重新加入房间，需要重新调用`WhiteSDK`的`joinRoom`API。

> room uuid 和 room token，可以保持不变。

```Objective-C
[self.room disconnect:^{
    //断连成功
}];
```

> disconnect 方法，仍然会触发`- (void)firePhaseChanged:`回调。
> 最新版本，可以通过`WhiteRoom`的`disconnectedBySelf`属性进行区分。

## 预期效果

![image.png | left | 488x850](/screenshot/iOS_screen.png)