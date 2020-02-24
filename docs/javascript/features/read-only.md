---
id: js-readonly
title: 大课只读
---
## 1. 为何要开启只读

> 提高房间可以承载人数的上限，降低订阅长连接的成本。(sdk 升级到最新支持)

[只读模式和互动模式的详细说明](/docs/blog/large-class/)

## 2. 如何开启只读

### 2.1 加入前开启只读(推荐使用)

``` typescript
     const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    isWritable: false, // 在 jionRoom 方法的参数中写入 {isWritable: false}，性能好
                    ...
                    },
```

### 2.2 加入后开启（或者关闭）只读

``` typescript
     const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    ...
                    },
    room.setWritable(false); // 在 jionRoom 方法的参数中写入 {isWritable: false}，灵活
```

## 3. 注意事项

开启只读后，`room` 对象下所有的成员方法和成员属性中需要和服务器交互的部分就会失去作用，如果在只读模式下调用还会报错。为了方便客户集成减少被报错干扰，我们提供了一个只读模式下特有的报错等级调整 api。

``` typescript
  const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    rejectWhenReadonlyErrorLevel: RoomErrorLevel.Ignore, // js 就用字符串 "ignore"
                    ...
                    },
```
