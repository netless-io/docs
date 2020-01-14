---
id: ios-create-room
title: Create Room
---

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteUtils` 类中查看。

The relevant code of this article can be viewed in the `WhiteUtils` class of the [Demo](declaration.md#demo) project.

## Safety instructions

To create a room / get a room, you need to use sdkToken to interact with the SDK backend server.
The Token is a certificate for the SDK back-end server to communicate with the developer's back-end business server. After mastering this token, the SDK backend server will think that this is an operation performed by the developer.

In the example, for the convenience of demonstration, the operation of creating a room / obtaining a roomToken is written on the client. In actual business, in order to prevent someone from decompiling the client code and obtaining the SDKToken, the token should not be exposed on any client.
The token should be in the developer's business server code or configuration item.

## Create a new room and get RoomToken directly
```Objective-C
@interface WhiteUtils : NSObject
+ (NSString *)sdkToken;
@end
```

```Objective-C
@implementation WhiteUtils

+ (void)createRoomWithResult:(void (^) (BOOL success, id response, NSError *error))result;
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:[APIHost stringByAppendingPathComponent:@"room?token=%@"], self.sdkToken]]];
    NSMutableURLRequest *modifyRequest = [request mutableCopy];
    [modifyRequest setHTTPMethod:@"POST"];
    [modifyRequest addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [modifyRequest addValue:@"application/json" forHTTPHeaderField:@"Accept"];
    //@"mode": @"historied" For replayable rooms, the default is persistent.
    NSDictionary *params = @{@"name": @"test", @"limit": @110, @"mode": @"historied"};
    NSData *postData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
    [modifyRequest setHTTPBody:postData];
    
    NSURLSessionTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:modifyRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error && result) {
                result(NO, nil, error);
            } else if (result) {
                NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                result(YES, responseObject, nil);
            }
        });
    }];
    [task resume];
}

@end
```

## Know Room UUID, Get Room RoomToken

```Objective-C
@interface WhiteUtils : NSObject
+ (NSString *)sdkToken;
@end
```

```Objective-C
@implementation WhiteUtils

+ (void)getRoomTokenWithUuid:(NSString *)uuid Result:(void (^) (BOOL success, id response, NSError *error))result
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:[APIHost stringByAppendingPathComponent:@"/room/join?uuid=%@&token=%@"], uuid, self.sdkToken]]];
    NSMutableURLRequest *modifyRequest = [request mutableCopy];
    [modifyRequest setHTTPMethod:@"POST"];
    [modifyRequest addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLSessionTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:modifyRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error && result) {
                result(NO, nil, error);
            } else if (result) {
                NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                if ([responseObject[@"code"] integerValue]  == 200) {
                    result(YES, responseObject, nil);
                } else {
                    result(NO, responseObject, nil);
                }
            }
        });
    }];
    [task resume];
}

@end
```
