---
id: ios-introduction
title: Introduction
---

## Introduction

Dependent libraries: YYModel, DSBridge-iOS.

Import method: Support `Cocoapods` (recommended) and direct import.

Supported version: iOS 9

Compatibility: <span style = "color: red"> Before iOS 2.1.0 and iOS 2.1.0 and later, different servers are connected and cannot be interconnected. The SDK API remains compatible. </ span> For details, please see [2.0.0 official release](/docs/ios/guides/ios-v2migration).

## Cocoapods used

### Use mirror station to accelerate

Due to network reasons, there may be a delay in the GitHub cocoapods warehouse network. Such users are recommended to use [Tsinghua University Open Source Software Mirror Station](https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/).
For specific use, please see the site's help.

### Difficult Problems

Prompt `[!] Unable to find a pod with name, author, summary, or descriptionmatching`.

Because `Cocoapods` installation is based on querying the local library. If you cannot find the corresponding version during installation, you can run the following command to update

```shell
# Update cocoapods repo content
pod repo update
# re-install
pod install
```

### View version used

`Podfile 'stores version constraints, not the final version. The specific version needs to be viewed in the `Podfile.lock` file.

```text
# 2.5.0 Is the version used
- Whiteboard (2.5.0):
    - dsBridge (~> 3.0.2)
    - YYModel (~> 1.0.4)
```

### Update sdk version

Because `Cocoapods` uses` Podfile.lock` to lock the version number, once sdk has been installed (the `lock` file that matches` Podfile`), `pod install` will no longer change the version.

First execute the following command:

```shell
# Check the local cocoapods spec repo for the latest version
pod search Whiteboard
# If there is no latest version, update the spec repo
pod repo update
```

Update the SDK in any of the following ways:
1. It can be updated individually by executing `pod update Whiteboard`.
2. Delete the sdk related content in the `Podfile.lock` file and re-execute` pod install`

### References

[pod update](https://guides.cocoapods.org/using/pod-install-vs-update.html)