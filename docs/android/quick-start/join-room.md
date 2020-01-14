---
id: android-join-room
title: Join room
---

After completing the operation of creating a room / obtaining a RoomToken for a specific room, and getting the room UUID and room RoomToken, the developer can call `WhiteSDK`` joinRoom` related APIs.

The related code in this article can be viewed in the `RoomActivity` of the [Demo](declaration.md#demo) project.

## Join Room && Status Callback

When executing the `joinRoom` API, in addition to uuid and roomToken, an instance of AbstractRoomCallbacks can also be passed in.

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