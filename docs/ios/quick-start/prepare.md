---
id: ios-prepare
title: Client integration
---

This article describes the development environment that needs to be prepared before using the whiteboard SDK formally.

## Prerequisites

1. Xcode 10.10
1. iOS 9.0

## Get sdkToken

Read [Access Preparation](/docs/blog/blog-begin-netless/), register for an account, and get the sdk token.

## Add SDK to the project

### Option 1: Add with Cocoapods

<br>

<details>
<summary>安装 Cocoapods（已安装可跳过）</summary>

如果你未接触过 Cocoapods ，我们推荐您阅读 [唐巧的博客-用CocoaPods做iOS程序的依赖管理](https://blog.devtang.com/2014/05/25/use-cocoapod-to-manage-ios-lib-dependency/ "用CocoaPods做iOS程序的依赖管理") ，了解我们为何使用 Cocoapods 。另外文章中提及的淘宝源已经不再维护，需要使用 [Ruby-China RubyGems 镜像](https://gems.ruby-china.com/)替换。

如果觉得上面两个文章比较繁琐，可以直接根据我们提供的简要步骤，进行安装。
* 简要步骤：打开mac自带的 终端(terminal)，然后输入依次执行下述命令。

<summary> Install Cocoapods (installed skippable) </ summary>

If you have n’t come into contact with Cocoapods, we recommend that you go to [docs](https://cocoapods.org/);

If you find the above two articles cumbersome, you can install them directly according to the brief steps we provide.
* Brief steps: Open the terminal that comes with mac, and then enter and execute the following commands in order.

```bash
## Note: Ruby-China recommends 2.6.x, the actual ruby ​​that comes with mac can also be used
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
gem sources -l
## Note: The above command should output the following, >>> means here is the output
>>> https://gems.ruby-china.com
## Note: Make sure only gems.ruby-china.com

sudo gem install cocoapods
## Note: Since we don't need to use the official library, we can not perform pod setup.
```

</details>

<br>

#### Using Podfile Integration

1. Create a Podfile. Enter the project path in Terminal and enter the following command line. After inputting, a Podfile text file will appear under the project path.

`` `shell
pod init
`` `

2. Add SDK reference. Add the following to the Podfile in the project root directory. Note "Your App" is your target name

```ruby

platform :ios, '9.0'

target 'Your App' do
    pod 'Whiteboard'
end
```

3. Install the SDK.

> If you haven't pulled the pod repository for a long time, we may not be able to find our repo. At this time, it is recommended to use `pod repo update` to update the pod repository first.

```shell
pod install
```

If Terminal displays Pod installation complete !, the automatic library addition is complete. Click to open the project's YourApp.xcworkspace file, or enter the following command line to open it. Note that "Your App" is your Target name.

```shell
 open YourApp.xcworkspace
```

### Method 2: Add manually (not recommended)

1. Download [cocoapods released version](https://github.com/netless-io/whiteboard-ios).
    * Switch to different branches according to the corresponding version installed. (It is recommended to choose the latest tag instead of the latest commit to ensure operability)
1. Enter the `Example` folder, execute` pod install`, and then build the project. Under the Pod Project, find the `Products` folder, copy the` Whiteboard.framework` file, and copy it to the corresponding file.
1. In the project to be integrated, select the Build Phases tab, find the `Link Binary with Libraries` item, and click the icon to start adding `WebKit.framework`.