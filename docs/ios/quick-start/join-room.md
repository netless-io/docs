---
id: ios-join-room
title: Join room
---

After completing the operation of creating a room / obtaining a RoomToken for a specific room, and getting the room UUID and room RoomToken, the developer can call `WhiteSDK`` joinRoom` related APIs.

The related code in this article can be viewed in the `WhiteRoomViewController` of the [Demo](declaration.md#demo) project.

## Join the room

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
    self.title = NSLocalizedString(@"Connecting room", nil);
    
    WhiteRoomConfig *roomConfig = [[WhiteRoomConfig alloc] initWithUuid:self.roomUuid roomToken:roomToken memberInfo:memberInfo];
    
    [self.sdk joinRoomWithConfig:roomConfig callbacks:self.roomCallbackDelegate completionHandler:^(BOOL success, WhiteRoom * _Nonnull room, NSError * _Nonnull error) {
        if (success) {
            self.title = NSLocalizedString(@"My whiteboard", nil);
            self.room = room;
        } else {
            self.title = NSLocalizedString(@"Join failed", nil);
            UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"Failed to join the room", nil) message:[NSString stringWithFormat:@"Error message:%@", [error localizedDescription]] preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction *action = [UIAlertAction actionWithTitle:NSLocalizedString(@"determine", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                [self.navigationController popViewControllerAnimated:YES];
            }];
            [alertVC addAction:action];
            [self presentViewController:alertVC animated:YES completion:nil];
        }
    }];
}

@end
```

## Active disconnect room

After calling the active disconnect API, if you want to join the room again, you need to re-create the SDK instance to connect. Room uuid and room token can remain unchanged.

```Objective-C
[self.room disconnect:^{
    // Disconnected successfully
}];
```

## Effect


![image.png | left | 488x850](/screenshot/iOS_screen.png)