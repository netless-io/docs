---
id: android-readonly
title: 只读订阅
---

## 1. 为何要开启只读订阅

> 提高房间可以承载人数的上限，降低订阅长连接的成本。(sdk 升级到最新支持)

[只读模式和互动模式的详细说明](/docs/faq/large-class/)

## 2. 如何开启只读

### 2.1 加入前开启只读(推荐使用)

``` Java
     public class RoomParams extends WhiteObject {

     public void setWritable(boolean writable) {
          isWritable = writable;
     }
}
```

### 2.2 加入后开启（或者关闭）只读

``` Java
/**
    * 设置读写模式
    * @param writable 是否可写
    * @param promise 完成回调，并同时返回房间的读写状态
    * @since 2.6.1
*/
public void setWritable(final boolean writable, @Nullable final Promise<Boolean> promise);
```
