---
id: js-leave-room
title: 离开房间
---

```typescript
room.disconnect().then(function() {
    console.log("Leave room success");
})
```

离开房间后，`room` 实例，无法再次连接进入同一个房间。如果想要加入房间，需要重新使用 sdk 调用 `joinRoom` API。