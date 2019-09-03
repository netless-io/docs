---
id: ios-prepare
title: 客户端集成
sidebar_label: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

## 前提条件

1. Xcode 10.10+
1. iOS 9.0+

## 获取 sdkToken

阅读 [接入准备](/docs/blog/blog-begin-netless/)，注册账号，获取 sdk token。

## 添加 SDK 到项目中

### 方式一： 使用 Cocoapods 添加

<br>

<details>
<summary>安装 Cocoapods（已安装可跳过）</summary>

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
    # 2.1.0 与 2.0 之前的房间无法互联，详情请看版本历史
    pod 'White-SDK-iOS'
end
```

3. 安装 SDK。

>如果长时间没有拉取过pod 仓库，可能出现无法找到我们的repo的情况，此时建议先使用 `pod repo update` 更新pod仓库。

```shell
pod install
```

如果 Terminal 显示 Pod installation complete!，则表示自动添加库已完成。点击打开项目的 YourApp.xcworkspace 文件，或输入以下命令行进行打开，注意 “Your App” 是你的 Target 名称。

```shell
 open YourApp.xcworkspace
```

### 方式二：手动添加（不建议）

1. 下载 [cocoapods发布的版本](https://github.com/duty-os/white-sdk-ios-release)。
    * 根据需要安装的对应版本，切换到不同分支。（建议选择最新的 tag，而不是最新的 commit，以保证可运行性）
1. 解压，并进入 White-SDK-iOS 文件夹。将 WhiteSDK.bundle，libWhiteSDK.a，Headers 文件夹，拖拽入项目中。
1. 打开 Build Phases 页签，展开 Link Binary with Libraries 项并添加如下库。点击 + 图标开始添加 `WebKit.framework`