---
id: ios-init-sdk
title: 初始化 SDK
---

本文介绍如何引用 SDK，并进行初始化。

* 阅读本文前，请确保已经注册账号，获取到 token，并且集成安装包等操作，详见 [集成客户端](./prepare.md)。

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteBaseViewController` 文件中查看。

## 引入 SDK

* 在需要添加白板的 ViewController 实例中，引入 White-iOS-SDK 的头文件文件 WhiteSDK.h。

```Objective-C
#import <UIKit/UIKit.h>
#import <WhiteSDK.h>

@interface WhiteBaseViewController : UIViewController

@property (nonatomic, strong) WhiteBoardView *boardView;
@property (nonatomic, strong) WhiteSDK *sdk;

#pragma mark - CallbackDelegate
@property (nonatomic, weak, nullable) id<WhiteCommonCallbackDelegate> commonDelegate;
@end
```

## 创建 SDK 实例

创建 `WhiteBoardView` 和 `WhiteSDK`， 在 `ViewDidLoad` 中创建sdk需要的实例类。

```Objective-C
#import "WhiteBaseViewController.h"
#import <Masonry/Masonry.h>

@interface WhiteBaseViewController ()<WhiteCommonCallbackDelegate>

@end

@implementation WhiteBaseViewController

...

- (void)initSDK
{
    // 4. 初始化 SDK 配置类，根据需求设置配置
    WhiteSdkConfiguration *config = [[WhiteSdkConfiguration alloc] initWithApp:@"需要填入的 App Identifier"];

    // 5. 初始化 WhiteSDK，并传入callback，可以在 Example 中查看 callback 实现
    self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self.commonDelegate];
}

@end
```

### 注意点

>1. 请保证在初始化 SDK 时，传入的 WhiteBoardView 已经添加在 ViewController 的视图栈中。
>    * 否则 iOS 12 开始，无法正确初始化，且不会有任何错误反馈。
>1. WhiteBoardView 内部含有 UIScrollView 实例。
>    * 在部分 NavigationController 的 ViewController 中，如果没有正确设置，会出现异常。
>    * iOS 11 及其以上，sdk 内部已经有做支持。
>    * iOS10 及其以下，需要调用时，对 ViewController 做设置。参考初始化代码。