---
id: android-events
title: Custom event
---

You can use custom events to meet scenarios such as IM, barrage, and like.

Room, Player (2.0.0-beta15) both support custom events. Player cannot send custom events, but supports adding and removing listeners.

## Register and remove custom event listeners

```java

public void addMagixEventListener(String eventName, EventListener eventListener) ;
public void removeMagixEventListener(String eventName) ;
```

`addMagixEventListener` and` removeMagixEventListener` are used to register and remove custom event listeners, and eventName is the message type name. `EventListener` is handled when a custom event is received.

## Sending Custom Events (Room only)

```Java

public void dispatchMagixEvent(AkkoEvent eventEntry);
```

`dispatchMagixEvent` is used to send AkkoEvent. AkkoEvent structure is as follows:
- `payload` is any JSON serializable object
- `eventName` is the name of the message type. Everyone in the same room will receive a message of the same type in the room.

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