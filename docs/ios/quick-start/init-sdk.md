---
id: ios-init-sdk
title: 初始化 SDK
---

在初始化 SDK 前，请确保已经完成注册账号获取 token，集成安装包等操作，详见 [集成客户端](./prepare.md)。

本文介绍，引用 SDK，并进行初始化。  
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

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupViews];
}

- (void)setupViews
{
    // 1. 初始化 WhiteBoardView，
    // 注意点：提前加入视图栈，防止 iOS12 无法正常初始化
    self.boardView = [[WhiteBoardView alloc] init];
    [self.view addSubview:self.boardView];

    // 2. 为 WhiteBoardView 做 iOS10 及其以下兼容。
    if (@available(iOS 11, *)) {
    } else {
        self.automaticallyAdjustsScrollViewInsets = NO;
    }

    // 3. 使用 Masonry 做自动布局支持
    [self.boardView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.mas_topLayoutGuideBottom);
        make.left.bottom.right.equalTo(self.view);
    }];
    [self initSDK];
}

- (void)initSDK
{
    // 4. 初始化 SDK 配置类，根据需求设置配置
    WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
    
    // 如果不需要拦截图片API，则不需要开启，页面内容较为复杂时，可能会有性能问题
    //config.enableInterrupterAPI = YES;
    config.debug = YES;

    // 5. 初始化 WhiteSDK，并传入callback，可以在 Example 中查看 callback 实现
    self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self.commonDelegate];
}

@end
```

### 注意点

1. 请保证在初始化 SDK 时，传入的 WhiteBoardView 已经添加在 ViewController 的视图栈中。
    * 否则会造成 iOS12 下，无法正确初始化。
1. WhiteBoardView 内部含有 UIScrollView 实例。
    * 在部分 NavigationController 的 ViewController 中，如果没有正确设置，会出现异常。
    * iOS 11 及其以上，sdk 内部已经有做支持。
    * iOS10 及其以下，需要调用时，对 ViewController 做设置。参考初始化代码。