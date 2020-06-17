---
id: ios-readonly
title: 大课只读
---
## 1. 为何要开启只读

> 提高房间可以承载人数的上限，降低订阅长连接的成本。(sdk 升级到最新支持)

[只读模式和互动模式的详细说明](/docs/faq/large-class/)

## 2. 如何开启只读

### 2.1 加入前开启只读(推荐使用)

``` Objective-C
     @interface WhiteRoomConfig : WhiteObject

     @property (nonatomic, assign) BOOL isWritable;

     @end

```

### 2.2 加入后开启（或者关闭）只读

``` Objective-C
     @interface WhiteRoom : WhiteDisplayer

     - (void)setWritable:(BOOL)writable completionHandler:(void (^ _Nullable)(BOOL isWritable, NSError * _Nullable error))completionHandler;
     @end
```
