---
id: about-log
title: 关于日志
---

## 一、目的说明

如果想准确的定位客户的问题，就需要详细的客户端日志上报服务，这样才能了解问题的具体情况。

## 二、我们会在客户端采集哪些信息

```ts
    ip // 设备的网络 ip，为了获取网络运营商
    timestamp // 时间戳，为了获取发生的时间
    akkoVersion // 白板底层的同步引擎版本，为了获取问题版本
    level // 日志等级
    message // 日志信息
    os // 设备的操作系统
    platform // 设备系统
    sdkVersion // sdk 版本
    userId // 用户 id（可选），为了定位具体客户的问题
    uuid // 白板房间的 uuid
```

日志获取以上字段的具体信息是为了完整的复原整个故障现场，帮助 netless 和客户快速锁定问题。

## 三、采集的信息会上传到哪里，打算怎么使用

1. netless 会将这些信息上传数据仓库并且设置严格的安全保护.
2. 后续会允许客户在管理控制台上查询自己的上报日志。

## 四、我们对日志信息上报比较敏感怎么办

1. 关闭客户端日志上报功能（注意：会造成排查故障困难）

    ```ts
    {
        //是否禁用上传，默认上传
        disableReportLog: false,
        //上传日志的等级，默认 info
        reportLevelMask: "info",
        //打印日志的等级，默认 info
        printLevelMask: "info";
    }

    {
        disableReportLog?: boolean,
        reportLevelMask?: "debug" | "info" | "warn" | "error",
        printLevelMask?: "debug" | "info" | "warn" | "error";
    }
    ```

    [文档链接](/docs/javascript/parameters/js-sdk/#loggeroptions-日志上报)

2. 后续我们考虑推出上传到客户自己的数据仓库功能。（目前没有此功能，后续支持配置）
