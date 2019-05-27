---
id: ios-create-room
title: 创建房间/获取房间信息
---

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteUtils` 类中查看。

## 安全须知

创建房间/获取房间，需要使用 sdkToken，与 SDK 后端服务器，进行交互。
该 Token，是 SDK 后端服务器，与开发者后端业务服务器通讯的凭证。掌握了这个 Token，SDK 后端服务器就会认为，这是开发者进行的操作。

Example 中，为了演示方便，将创建房间/获取房间 roomToken 操作写在了客户端中，实际业务中，为了防止有人反编译客户端代码，获取 SDKToken，不应该在任何客户端暴露该 Token。
该 Token，应该在开发者的业务服务器代码，或者配置项中。

## 创建新房间，并直接获取 RoomToken

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
    //@"mode": @"historied" 为可回放房间，默认为持久化房间。
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

## 已知房间 UUID，获取房间 RoomToken

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
