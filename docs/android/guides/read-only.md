---
id: android-readonly
title: Big class read-only
---
## 1. Why enable read-only

> Increase the maximum number of people that can be carried in a room and reduce the cost of subscribing to a long connection. (sdk upgrade to latest support)

[Detailed description of read-only mode and interactive mode](/docs/blog/large-class/)

## 2. How to enable read-only

### 2.1 Enable read-only before joining (recommended)

``` Java
     public class RoomParams extends WhiteObject {

     public void setWritable(boolean writable) {
          isWritable = writable;
     }
}
```

### 2.2 Open (or close) read-only after joining

``` Java
     public class Room extends Displayer {

    /**
     * Set read-write mode
     * @param writable is writable
     * @param promise completes the callback and returns the read and write status of the room at the same time
     * @since 2.6.1
     */
    public void setWritable(final boolean writable, final Promise<Boolean> promise) {
        bridge.callHandler("room.setWritable", new Object[]{writable}, new OnReturnValue<String>() {
            @Override
            public void onValue(String result) {
                SDKError sdkError = SDKError.promiseError(result);
                if (sdkError != null) {
                    promise.catchEx(sdkError);
                } else {
                    JsonObject jsonObject = gson.fromJson(result, JsonObject.class);
                    Boolean isWritable = jsonObject.get("isWritable").getAsBoolean();
                    setWritable(isWritable);
                    promise.then(isWritable);
                }
            }
        });
    }
}
```
