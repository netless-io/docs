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
    self.title = NSLocalizedString(@"正在连接房间", nil);
    
    WhiteRoomConfig *roomConfig = [[WhiteRoomConfig alloc] initWithUuid:self.roomUuid roomToken:roomToken memberInfo:memberInfo];
    
    [self.sdk joinRoomWithConfig:roomConfig callbacks:self.roomCallbackDelegate completionHandler:^(BOOL success, WhiteRoom * _Nonnull room, NSError * _Nonnull error) {
        if (success) {
            self.title = NSLocalizedString(@"我的白板", nil);
            self.room = room;
        } else {
            self.title = NSLocalizedString(@"加入失败", nil);
            UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"加入房间失败", nil) message:[NSString stringWithFormat:@"错误信息:%@", [error localizedDescription]] preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction *action = [UIAlertAction actionWithTitle:NSLocalizedString(@"确定", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                [self.navigationController popViewControllerAnimated:YES];
            }];
            [alertVC addAction:action];
            [self presentViewController:alertVC animated:YES completion:nil];
        }
    }];
}

@end
```

## 主动断开房间

调用主动断连 API 后，如果想再次加入房间，需要重新创建 SDK 实例，进行连接。room uuid 和 room token，可以保持不变。

```Objective-C
[self.room disconnect:^{
    //断连成功
}];
```

## 效果


![image.png | left | 488x850](/screenshot/iOS_screen.png)

## 相关文档