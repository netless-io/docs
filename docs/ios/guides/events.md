---
id: ios-events
title: 自定义事件
---

开发者在使用过程中，很可能有其他多种多样的需求，SDK 同样提供了部分自定义接口，以便开发者实现。  
可以简单把这个功能，类比于 iOS 的通知中心 `NSNotificationCenter` 。  
自定义事件 API 与通知中心相似。

## 注册，移除，发送自定义事件

### 实时房间

```Objective-C
@interface WhiteRoom : NSObject

//注册 eventName 的自定义事件
- (void)addMagixEventListener:(NSString *)eventName;
/**
    eventName 发送的事件名称
    事件附带的 payload 数据
 */
- (void)dispatchMagixEvent:(NSString *)eventName payload:(NSDictionary *)payload;
//移除 eventName 的自定事件监听
- (void)removeMagixEventListener:(NSString *)eventName;
@end
```

### 回放房间

> 2.0.4 版本新增 API

```Objective-C
@interface WhitePlayer : NSObject

//注册 eventName 的自定义事件
- (void)addMagixEventListener:(NSString *)eventName;
//移除 eventName 的自定事件监听
- (void)removeMagixEventListener:(NSString *)eventName;

@end
```

## 自定义事件回调

### 实时房间

当一个已经被注册的自定义事件触发时，SDK 会回调在使用 `WhiteSDK` 创建 `WhiteRoom` 实例时，传入的实现了 `WhiteRoomCallbackDelegate` 协议的实例。即

```Objective-C
@interface WhiteSDK : NSObject
- (instancetype)initWithBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config callbackDelegate:(id<WhiteRoomCallbackDelegate>)callbackDelegate
@end
```

中的 `callbackDelegate` 参数。

当房间中，有用户发送了对应名称的自定义事件时，SDK 会回调  `WhiteRoomCallbackDelegate` 的方法：

```Objective-C
@protocol WhiteRoomCallbackDelegate <NSObject>
@optional
//自定义事件回调事件
- (void)fireMagixEvent:(WhiteEvent *)event;
@end
```

### 回放房间

> 2.0.4 版本新增 API

与实时房间相似，当回放时，某个自定义事件发生，SDK 会回调在 `WhiteSDK` 创建 `WhitePlayer` 实例时，传入的实现了 `WhitePlayerEventDelegate` 协议的实例。即

```Objective-C
@interface WhiteSDK : NSObject
- (void)createReplayerWithConfig:(WhitePlayerConfig *)config callbacks:(nullable id<WhitePlayerEventDelegate>)eventCallbacks completionHandler:(void (^) (BOOL success, WhitePlayer * _Nullable player, NSError * _Nullable error))completionHandler;
@end
```

当回放中，有用户发送了对应名称的自定义事件时，SDK 会回调  `WhiteRoomCallbackDelegate` 的方法：

```Objective-C
@protocol WhitePlayerEventDelegate <NSObject>
@optional
/**
 白板自定义事件回调，
 */
- (void)fireMagixEvent:(WhiteEvent *)event;
@end
```
