---
id: debug-help
title: 如何协助 netless 帮您定位问题
---

> 我们在 `2.6.3` 之后的版本中加入和详细的客户端报错日志，便于帮助客户定位问题。

## debug 建议

如果后面客户有问题我们需要快速得到一下的信息

1. `uuid` 是白板房间的唯一识别号，帮助我们锁定房间已经查看上报日志。
2. `roomToken`，我们远程进入房间调试的凭证。(注意 `roomToken` 不是管理控制台中返回的 `sdkToken`，是创建房间时候返回的)
3. 可以再 `userPayload` 里面加 `userId`，上报日志可以精确到你们的用户 ID（sdk 升级到 2.6.3 版本后支持）

    ``` typescript
        const room = await whiteWebSdk.joinRoom({
                            uuid: uuid,
                            roomToken: roomToken,
                            userPayload: {
                                userId: userId, // 协助定位问题的 userId 写在这边
                            }},
    ```

4. 如果开始的那个 loading 有很多的网络请求，可以考虑吧这些请求都显示一下文案，比如：聊天室正在建立，白板正在建立。这样一旦卡住，就可以清晰的锁定是哪个请求要去处理故障。
