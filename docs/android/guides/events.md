---
id: android-events
title: 自定义事件
---

## 自定义事件

可以使用自定义事件来满足类似 IM 、弹幕、点赞等场景。

```java
public void dispatchMagixEvent(AkkoEvent eventEntry);

public void addMagixEventListener(String eventName, EventListener eventListener) ;

public void removeMagixEventListener(String eventName) ;

```

- dispatchMagixEvent 用来发送 AkkoEvent，AkkoEvent 结构如下，
  - payload 为任意可被 JSON 序列化的对象
  - eventName 为消息类型名称，同一个房间的所有人都会收到房间内同一个消息类型的消息

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

- addMagixEventListener 和 removeMagixEventListener 用来增加和删除消息监听器，eventName 为消息类型名称。