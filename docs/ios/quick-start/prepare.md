---
id: ios-prepare
title: 客户端集成
sidebar_label: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

## 前提条件

1. Xcode 10.10+
1. iOS 9.0+

## 创建 sdk 账号，并获取 sdkToken

1. 进入 [console](https://console.herewhite.com) ，注册账号。
1. 点击左侧导航栏 <svg viewBox="64 64 896 896" class="" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg> 
1. 进入用户中心后，找到 密钥管理 ，点击 Token右侧的 <svg viewBox="64 64 896 896" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg> 按钮，获取完整的 token。

## 添加 SDK 到项目中

### 方式一： 使用 Cocoapods 添加

<br>

<details>
<summary><i>安装 Cocoapods（已安装可跳过）<i></summary>

如果你未接触过 Cocoapods ，我们推荐您阅读 [唐巧的博客-用CocoaPods做iOS程序的依赖管理](https://blog.devtang.com/2014/05/25/use-cocoapod-to-manage-ios-lib-dependency/ "用CocoaPods做iOS程序的依赖管理") ，了解我们为何使用 Cocoapods 。另外文章中提及的淘宝源已经不再维护，需要使用 [Ruby-China RubyGems 镜像](https://gems.ruby-china.com/)替换。

如果觉得上面两个文章比较繁琐，可以直接根据我们提供的简要步骤，进行安装。
* 简要步骤：打开mac自带的 终端(terminal)，然后输入依次执行下述命令。

```bash
## 注释：Ruby-China 推荐2.6.x，实际 mac 自带的 ruby 也能用了
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
gem sources -l
## 注释：上面的命令，应该会输出以下内容，>>> 代表此处为输出
>>> https://gems.ruby-china.com
## 注释：确保只有 gems.ruby-china.com

sudo gem install cocoapods
## 注释：由于我们不需要使用官方库，所以可以不执行 pod setup。
```

</details>

<br>

#### 使用 Podfile 集成

1. 创建 Podfile 文件。在 Terminal 里进入项目所在路径，然后输入以下命令行。输入后，项目路径下会出现一个 Podfile 文本文件。

```shell
pod init
```

2. 添加 SDK 引用。在项目根目录下的 Podfile 文件中添加如下内容。注意 “Your App” 是你的 Target 名称

```ruby

platform :ios, '9.0'

target 'Your App' do
    pod 'White-SDK-iOS'
    ## 使用动态 ppt 用户，请暂时使用以下版本
    ## pod 'White-SDK-iOS', '2.0.0-ppt'
end
```

3. 安装 SDK。

*如果长时间没有拉取过pod 仓库，可能出现无法找到我们的repo的情况，此时建议先使用* `pod repo update` 更新pod仓库。

```shell
pod install
```

如果 Terminal 显示 Pod installation complete!，则表示自动添加库已完成。点击打开项目的 YourApp.xcworkspace 文件，或输入以下命令行进行打开，注意 “Your App” 是你的 Target 名称。

```shell
 open YourApp.xcworkspace
```

### 方式二：自动集成（不建议）

1. 下载 [cocoapods发布的版本](https://github.com/duty-os/white-sdk-ios-release)。
    * 根据需要安装的对应版本，切换到不同分支。（建议选择最新的 tag，而不是最新的 commit，以保证可运行性）
1. 解压，并进入 White-SDK-iOS 文件夹。将 WhiteSDK.bundle，libWhiteSDK.a，Headers 文件夹，拖拽入项目中。
1. 打开 Build Phases 页签，展开 Link Binary with Libraries 项并添加如下库。点击 + 图标开始添加 `WebKit.framework`