---
id: android-join-room
title: 加入房间
---

在完成创建房间/获取特定房间 RoomToken 操作，拿到房间 UUID 与房间 RoomToken 后，开发者可以调用 `WhiteSDK` `joinRoom` 相关的 API。

>本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `RoomActivity` 中查看。

## 加入房间 && 状态回调

在执行 `joinRoom` API 时，除了 uuid 与 roomToken，还可以传入一个 `AbstractRoomCallbacks` 实例。

```Java
public class RoomActivity {
    private void joinRoom(String uuid, String roomToken) {

        logRoomInfo("room uuid: " + uuid + "roomToken" + roomToken);

        whiteSdk.joinRoom(new RoomParams(uuid, roomToken), new AbstractRoomCallbacks() {
            @Override
            public void onPhaseChanged(RoomPhase phase) {
                showToast(phase.name());
            }

            @Override
            public void onRoomStateChanged(RoomState modifyState) {
                logRoomInfo(gson.toJson(modifyState));
            }
        }, new Promise<Room>() {
            @Override
            public void then(Room wRoom) {
                logRoomInfo("join in room success");
                room = wRoom;
            }

            @Override
            public void catchEx(SDKError t) {
                showToast(t.getMessage());
            }
        });
    }
}
```