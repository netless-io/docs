---
id: ios-readonly
title: Big class read-only
---
## 1. Why enable read-only

> Increase the maximum number of people that can be carried in a room and reduce the cost of subscribing to a long connection. (sdk upgrade to latest support)

[Detailed description of read-only mode and interactive mode](/docs/blog/large-class/)

## 2. How to enable read-only

### 2.1 Enable read-only before joining (recommended)

``` Objective-C
     @interface WhiteRoomConfig : WhiteObject

     @property (nonatomic, assign) BOOL isWritable;

     @end

```

### 2.2 Open (or close) read-only after joining

``` Objective-C
     @interface WhiteRoom : WhiteDisplayer

     - (void)setWritable:(BOOL)writable completionHandler:(void (^ _Nullable)(BOOL isWritable, NSError * _Nullable error))completionHandler;
     @end
```
