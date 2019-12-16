---
id: ios-introduction
title: 使用须知
---

## 介绍

依赖库：YYModel，DSBridge-iOS。

导入方式：支持`Cocoapods`（推荐）与直接导入。

支持版本：iOS 9+

兼容性：<span style="color:red">iOS 2.1.0 之前的版本与 iOS 2.1.0 及其以后的版本，连接的是不同服务器，无法互连。SDK API 保持兼容。</span>具体请看 [2.0.0正式版发布](/docs/ios/guides/ios-v2migration)

## Cocoapods 使用

### 使用镜像站加速

由于网络原因，GitHub cocoapods 仓库网络可能存在延迟，此类用户，推荐使用[清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/)。
具体使用请看该站使用帮助。

### 疑难问题

提示`[!] Unable to find a pod with name, author, summary, or descriptionmatching`等提示。

由于`Cocoapods`安装是根据本地库进行查询。如果安装时，查询不到对应版本，可以执行以下命令更新

```shell
# 更新 cocoapods repo 内容
pod repo update
# 重新安装
pod install
```

### 查看使用版本

`podfile`中存的是版本约束，并非最终使用的版本。具体版本需要在`Podfile.lock`文件中查看。

```text
# 2.5.0 即为所使用的版本
- Whiteboard (2.5.0):
    - dsBridge (~> 3.0.2)
    - YYModel (~> 1.0.4)
```

### 更新 sdk 版本

由于`Cocoapods`使用了`Podfile.lock`锁定版本号，所以，一旦安装过 sdk（存在符合`Podfile`的`lock` 文件），`pod install`将不再变更版本。

先执行以下命令：

```shell
# 查看本地 cocoapods spec repo，是否有最新版本
pod search Whiteboard
# 如果没有最新版本，更新spec repo
pod repo update
```

通过以下任一方式更新 sdk：
1. 可以通过执行`pod update Whiteboard`进行单独更新。
1. 删除`Podfile.lock`文件中 sdk 相关内容，重新执行`pod install`

### 参考资料

[pod update](https://guides.cocoapods.org/using/pod-install-vs-update.html)