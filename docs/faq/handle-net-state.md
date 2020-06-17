---
id: handle-net-state
title: 网络异常处理
---

> 长连接服务的对网络质量有较高的要求，在使用 netless 白板的时候一定要处理网络的异常状况。

## 网络异常时候 netless 提供的回调

``` ts
const room = whiteWebSdk.joinRoom({
                uuid: uuid,
                roomToken: roomToken,
                {
                    onPhaseChanged: phase => {
                        console.log(`room ${"uuid"} changed: ${phase}`);
                        // 当白板连接状态发生变化 phase 可能会变成以下几种状态
                        // Connecting = "connecting",
                        // Connected = "connected",
                        // Reconnecting = "reconnecting",
                        // Disconnecting = "disconnecting",
                        // Disconnected = "disconnected",
                    },
                });
```

## 遇到网络异常的时候处理原则

1. 断连状态下 room 的成员方法和成员属性都不可以操作.

    ``` ts
    phase === "connected" // 时是 room 和服务器连接上的状态，其他四种状态都要静止一切操作
    ```

2. 代码案例

    ``` ts
        // 这种成员方法不能调用
        room.setViewMode(ViewMode.Broadcaster);
        // 这种成员属性不能赋值
        room.disableCameraTransform = false;
    ```

3. 报错案例

    ![error](/img/error.png)
