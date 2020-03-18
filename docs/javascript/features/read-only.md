---
id: js-readonly
title: Big class read-only
---
## 1. Why enable read-only

> Increase the maximum number of people that can be carried in a room and reduce the cost of subscribing to a long connection. (sdk upgrade to latest support)

[Detailed description of read-only mode and interactive mode](/docs/blog/large-class/)

## 2. How to enable read-only

### 2.1 Enable read-only before joining (recommended)

``` typescript
     const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    isWritable: false, // Write {isWritable: false} in the parameter of jionRoom method, good performance
                    ...
                    },
```

### 2.2 Open (or close) read-only after joining

``` typescript
     const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    ...
                    },
    room.setWritable(false); // Write {isWritable: false} in the parameter of jionRoom method, flexible
```

## 3. Notes

When read-only is turned on, all member methods and member properties under the `room` object that need to interact with the server will lose their effect. If they are called in read-only mode, an error will be reported. In order to facilitate customer integration and reduce interference by error, we provide a unique error level adjustment API in read-only mode.

``` typescript
  const room = await whiteWebSdk.joinRoom({
                    uuid: uuid,
                    roomToken: roomToken,
                    rejectWhenReadonlyErrorLevel: RoomErrorLevel.Ignore, // js just use the string "ignore"
                    ...
                    },
```
