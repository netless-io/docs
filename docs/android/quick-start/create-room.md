---
id: android-create-room
title: Create Room
---

The related code of this article can be viewed in the `DemoAPI`` RoomActivity` class of the [Demo](declaration.md#demo) project.
This part is server logic. In actual development, it should not be implemented on the client.
The client should make a request to the developer's own back-end server to get the content.

## Safety instructions

To create-room / get-room, you need to use sdkToken to interact with the SDK backend server.
The Token is a certificate for the SDK back-end server to communicate with the developer's back-end business server. After mastering this token, the SDK backend server will think that this is an operation performed by the developer.

In the example, for the convenience of demonstration, the operation of creating a room / obtaining a roomToken is written on the client. In actual business, in order to prevent someone from decompiling the client code and obtaining the SDKToken, the token should not be exposed on any client.
The token should be in the developer's business server code or configuration item.

## Create a new room and get RoomToken directly

Make a request to the sdk business server

```Java

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class DemoAPI {

    public void createRoom(String name, int limit, Callback callback) {
        Map<String, Object> roomSpec = new HashMap<>();
        roomSpec.put("name", name);
        roomSpec.put("limit", limit);
        RequestBody body = RequestBody.create(JSON, gson.toJson(roomSpec));
        Request request = new Request.Builder()
                .url(host + "/room?token=" + sdkToken)
                .post(body)
                .build();
        Call call = client.newCall(request);
        call.enqueue(callback);
    }
}

```

From the response from the sdk server, read uuid and roomToken.

```Java

public class RoomActivity {
    demoAPI.createRoom("sdk demo", 100, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                alert("Network request error", e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) {
                try {
                    if (response.code() == 200) {
                        JsonObject room = gson.fromJson(response.body().string(), JsonObject.class);
                        String uuid = room.getAsJsonObject("msg").getAsJsonObject("room").get("uuid").getAsString();
                        String roomToken = room.getAsJsonObject("msg").get("roomToken").getAsString();
                        if (whiteBroadView.getEnv() == Environment.dev) {
                            joinRoom(TEST_UUID, TEST_ROOM_TOKEN);
                        } else {
                            joinRoom(uuid, roomToken);
                        }
                    } else {
                        alert("Network request error", response.body().string());
                    }
                } catch (Throwable e) {
                    alert("Failed to create room", e.toString());
                }
            }
        });
}
```

## Know the room UUID, get the room RoomToken

```Java
public class demoAPI {
    public void getRoomToken(String uuid, Callback callback) {
        Map<String, Object> roomSpec = new HashMap<>();
        RequestBody body = RequestBody.create(JSON, gson.toJson(roomSpec));
        Request request = new Request.Builder()
                .url(host + "/room/join?uuid=" + uuid + "&token=" + sdkToken)
                .post(body)
                .build();
        Call call = client.newCall(request);
        call.enqueue(callback);
    }
}
```

```Java
public class RoomActivity {
    private void getRoomToken(final String uuid) {
        demoAPI.getRoomToken(uuid, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                alert("Failed to get room token request", e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) {
                try {

                    if (response.code() == 200) {
                        JsonObject room = gson.fromJson(response.body().string(), JsonObject.class);
                        String roomToken = room.getAsJsonObject("msg").get("roomToken").getAsString();
                        if (whiteBroadView.getEnv() == Environment.dev) {
                            joinRoom(TEST_UUID, TEST_ROOM_TOKEN);
                        } else {
                            joinRoom(uuid, roomToken);
                        }
                    } else {
                        alert("Failed to get room token request", response.body().string());
                    }
                } catch (Throwable e) {
                    alert("Failed to get room token request", e.toString());
                }
            }
        });
    }
}
```