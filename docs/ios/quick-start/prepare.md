---
id: ios-prepare
title: 客户端集成
sidebar_label: 客户端集成
---

本文介绍在正式使用白板 SDK 前，需要准备的开发环境。

## 1. 前提条件

1. Xcode 10.10+
1. iOS 9.0+

## 2. 获取所需要的信息

1. 阅读 [应用与权限](docs/doc/token)，获取 SDK Token
2. 阅读 [APP Identifier](/faq/app-identifier)，获取 App Identifier

## 3. 添加 SDK 到项目中

<details><summary>安装 Cocoapods（已安装可跳过）</summary>

如果你未接触过 Cocoapods ，我们推荐您阅读 [唐巧的博客-用CocoaPods做iOS程序的依赖管理](https://blog.devtang.com/2014/05/25/use-cocoapod-to-manage-ios-lib-dependency/ "用CocoaPods做iOS程序的依赖管理") ，了解我们为何使用 Cocoapods 。另外文章中提及的淘宝源已经不再维护，需要使用 [Ruby-China RubyGems 镜像](https://gems.ruby-china.com/)替换。

如果觉得上面两个文章比较繁琐，可以直接根据我们提供的简要步骤，进行安装。

- 简要步骤：打开mac自带的 终端(terminal)，然后输入依次执行下述命令。

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

### 方式一： Cocoapods 添加

1. 创建 Podfile 文件。在 Terminal 里进入项目所在路径，然后输入以下命令行。输入后，项目路径下会出现一个 Podfile 文本文件。

```shell
pod init
```

2. 添加 SDK 引用。在项目根目录下的 Podfile 文件中添加如下内容。注意 “Your App” 是你的 Target 名称

```ruby
platform :ios, '9.0'

target 'Your App' do
    # 注意大写
    pod 'Whiteboard'
end
```

3. 安装 SDK。

> 如果长时间没有拉取过pod 仓库，可能出现无法找到我们的repo的情况，此时建议先使用 `pod repo update` 更新pod仓库。

```shell
pod install
```

如果 Terminal 显示 Pod installation complete!，则表示自动添加库已完成。点击打开项目的 YourApp.xcworkspace 文件，或输入以下命令行进行打开，注意 “Your App” 是你的 Target 名称。

```shell
open YourApp.xcworkspace
```

### 方式二：手动添加（不建议）

1. 下载 [cocoapods发布的版本](https://github.com/netless-io/whiteboard-ios)。
    - 根据需要安装的对应版本，切换到不同分支。（建议选择最新的 tag，而不是最新的 commit，以保证可运行性）
1. 进入`Example`文件夹，执行`pod install`，然后 build 项目，在 Pod Project 下，找到 `Products` 文件夹，复制`Whiteboard.framework` 文件，复制到对应文件中。
1. 在要集成的项目中，选择 `Build Phases` 标签，找到 `Link Binary with Libraries` 项，点击 + 图标开始添加 `WebKit.framework`。

>如果您使用该方式，需要自己处理`Whiteboard`在`podspec`文件中的依赖，目前有`YYMolde`，`dsbridge`，未来可能有所增加。

>该集成方式需要有一定项目集成经验，我们不建议使用该方式，也不会对该集成方式提供过多技术支持。