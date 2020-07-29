---
id: android-create-room
title: 创建房间/获取房间信息
---

本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `demoAPI` `RoomActivity` 类中查看。
该部分为服务器逻辑，实际开发中，不应该在客户端实现。
客户端应该向开发者自己的后端服务器进行请求，获取内容。

>此处文档使用的新用户的 sdkToken，以 NETLESS 开头，无法使用`v4`API，需要根据 [server](/docs/server/overview/server-introduction) 在服务器端进行创建。

## 安全须知

创建房间/获取房间，需要使用 sdkToken，与 SDK 后端服务器，进行交互。
该 Token，是 SDK 后端服务器，与开发者后端业务服务器通讯的凭证。掌握了这个 Token，SDK 后端服务器就会认为，这是开发者进行的操作。

Example 中，为了演示方便，将创建房间/获取房间 roomToken 操作写在了客户端中，实际业务中，为了防止有人反编译客户端代码，获取 SDKToken，不应该在任何客户端暴露该 Token。
该 Token，应该在开发者的业务服务器代码，或者配置项中。

## 创建新房间，并直接获取 RoomToken

向 sdk 业务服务器，进行请求

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

从 sdk 服务器的响应中，读取 uuid 和 roomToken。

```Java

public class RoomActivity {
    demoAPI.createRoom("sdk demo", 100, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                alert("网络请求错误", e.toString());
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
                        alert("网络请求错误", response.body().string());
                    }
                } catch (Throwable e) {
                    alert("创建房间失败", e.toString());
                }
            }
        });
}
```

## 已知房间 UUID，获取房间 RoomToken

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
                alert("获取房间 token 请求失败", e.toString());
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
                        alert("获取房间 token 失败", response.body().string());
                    }
                } catch (Throwable e) {
                    alert("获取房间 token 失败", e.toString());
                }
            }
        });
    }
}
```