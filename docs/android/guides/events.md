---
id: android-events
title: 自定义事件
---

可以使用自定义事件来满足类似 IM 、弹幕、点赞等场景。

Room ， Player（2.0.0-beta15） 均支持自定义事件。Player 不能发送自定义事件，但是支持增加监听，以及移除监听。

## 注册，移除自定义事件监听

```java

public void addMagixEventListener(String eventName, EventListener eventListener) ;
public void removeMagixEventListener(String eventName) ;
```

`addMagixEventListener` 和 `removeMagixEventListener` 用来注册和移除自定义事件监听，eventName 为消息类型名称。 `EventListener` 则为收到自定义事件时的处理。

## 发送自定义事件（Room only）

```Java

public void dispatchMagixEvent(AkkoEvent eventEntry);
```

`dispatchMagixEvent` 用来发送 AkkoEvent，AkkoEvent 结构如下：
- `payload` 为任意可被 JSON 序列化的对象
- `eventName` 为消息类型名称，同一个房间的所有人都会收到房间内同一个消息类型的消息

```java
public class AkkoEvent {
    private String eventName;
    private Object payload;

    public AkkoEvent(String eventName, Object payload) {
        this.eventName = eventName;
        this.payload = payload;
    }
}
```