# 自定义需求

开发者在使用过程中，很可能有其他多种多样的需求，SDK 同样提供了部分自定义接口，以便开发者实现。

## 自定义事件

您可以简单把这个功能，类比于 iOS 的通知中心 `NSNotificationCenter` 。自定义事件 API 与通知中心相似。

### 注册，移除，发送自定义事件

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

```
通过上述 API，注册并发送自定义事件。

### 自定义事件回调

当一个已经被注册的自定义事件触发时，SDK 会回调 `WhiteRoomCallbackDelegate` ，也就是 `WhiteSDK` 的初始化方法 `- (instancetype)initWithBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config callbackDelegate:(id<WhiteRoomCallbackDelegate>)callbackDelegate` 中，传入的 callbacks 参数。

```Objective-C
@protocol WhiteRoomCallbackDelegate <NSObject>
//自定义事件回调事件
- (void)fireMagixEvent:(WhiteEvent *)event;
```

## 外部设备输入 API

为了满足自行传入触碰事件的需求。这里提供以下方法，允许将触碰事件转换为 touch 事件。

注意事项：

1. 该 API 并不稳定，有特殊需求的用户，可以使用该系列 API，目前不保证向后兼容。
2. **调用该 API 前，需要讲白板设置为只读模式（WhiteRoom 的 `disableOperations:` 方法）**
3. 该 API 适用于画笔教具，无法用于选择教具；其他教具无法保证效果。


```Objective-C
//WhitePanEvent 有 x，y 属性。坐标原点为左上角（whiteboardView）与 iOS 方向一致。
- (void)externalDeviceEventDown:(WhitePanEvent *)event;
- (void)externalDeviceEventMove:(WhitePanEvent *)event;
- (void)externalDeviceEventUp:(WhitePanEvent *)event;
- (void)externalDeviceEventLeave:(WhitePanEvent *)event;
```