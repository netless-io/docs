---
id: js-redo-undo
title: 撤回与重做
---

## 开启

> 注意这是个不兼容功能，如果加入房间的用户有的开启有不开启，一旦调用此功能未开启的客户就会 crash。

```ts
room.disableSerialization = true; // true 是默认值，不启用。
room.disableSerialization = false; // false 是启用，如果要开启撤回和重做，需要设置为 false。
```

1. 如果您的产品已经上线，请谨慎开启。因为此功能要求所有用户都升级到 2.9.2 以上。
2. 如果您的产品还在测试阶段且非常可能用到这个功能，建议开启此功能。

## 调用

```ts
    room.redo() // 重做
    room.undo() // 撤回
```
