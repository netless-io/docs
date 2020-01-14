---
id: ios-init-sdk
title: Init SDK
---

This article describes how to reference the SDK and initialize it.

* Before reading this article, please make sure you have registered an account, obtained a token, and integrated the installation package. For details, see [Integration Client] (./ prepare.md).

The related code of this article can be viewed in the `WhiteBaseViewController` file of the [Demo] (declaration.md # demo) project.

## Introduce SDK

* In the ViewController instance where a whiteboard needs to be added, the White-iOS-SDK header file WhiteSDK.h is introduced.

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

## Create SDK instance

Create `WhiteBoardView` and` WhiteSDK`, and create instance classes required by SDK in ViewDidLoad`.

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
    // 1. Initialize WhiteBoardView,
    // Note: Add the view stack in advance to prevent iOS12 from failing to initialize properly
    self.boardView = [[WhiteBoardView alloc] init];
    [self.view addSubview:self.boardView];

    // 2. Make iOS10 and below compatible for WhiteBoardView.
    if (@available(iOS 11, *)) {
    } else {
        self.automaticallyAdjustsScrollViewInsets = NO;
    }

    // 3. Use Masonry for auto layout support
    [self.boardView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.mas_topLayoutGuideBottom);
        make.left.bottom.right.equalTo(self.view);
    }];
    [self initSDK];
}

- (void)initSDK
{
    // 4. Initialize the SDK configuration class and set the configuration as required
    WhiteSdkConfiguration *config = [WhiteSdkConfiguration defaultConfig];
    
    // If you do not need to intercept the image API, you do not need to open it. When the page content is more complicated, there may be performance problems.
    //config.enableInterrupterAPI = YES;
    config.debug = YES;

    // 5. Initialize WhiteSDK and pass in callback, you can check the callback implementation in Example
    self.sdk = [[WhiteSDK alloc] initWithWhiteBoardView:self.boardView config:config commonCallbackDelegate:self.commonDelegate];
}

@end
```

### be careful

1. Make sure that when the SDK is initialized, the incoming WhiteBoardView has been added to the ViewController's view stack.
    * Otherwise it will cause incorrect initialization under iOS12.
2. WhiteBoardView contains UIScrollView instances.
    * In ViewController of some NavigationController, if it is not set correctly, an exception will occur.
    * iOS 11 and above, there is already support in SDK.
    * iOS10 and below, when you need to call, set the ViewController. See initialization code.