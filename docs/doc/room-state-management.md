---
id: room-state-management
title: 实时房间状态管理
---

## 房间的状态

房间状态变化图如下。

![房间状态变化图](/img/room-phase-graphics.png)

其中，房间状态描述如下。

| 房间名 | 描述 |
| :--- | :--- |
| Connecting | 正在连接房间 |
| Connected | 连接成功，只有此时，实时互动才能正常工作 |
| Disconnecting | 正在离开房间 |
| Reconnecting | 正在重新连接房间 |
| Disconnected | 已离开房间 |

其中，改变房间状态的事件描述如下。

| 事件名 | 描述 |
| :--- | :--- |
| join room | 加入房间，由用户主动调用来触发 |
| fail | 连接房间失败，具体原因需要根据抛出的错误描述信息来确定 |
| success | 成功加入房间 |
| leave room | 离开房间，由用户主动调用来触发 |
| disconnect | 由于网络原因断开连接，这会触发断线重连流程 |
| connected | 断线重连成功，重新进入房间 |
| catch error | 实时房间发生错误，这个错误无法忽视和处理，必须离开房间 |

在前端 / 客户端，随时可以通过如下代码获取当前的房间状态。

```javascript
var phase = room.phase;
```

也可以在加入房间时，添加监听器，以监听房间状态变化。

```javascript
import { RoomPhase } from "white-web-sdk";

var joinRoomParams = {
    uuid: uuid,
    roomToken: roomToken,
};
whiteWebSdk.joinRoom(joinRoomParams, {
    onPhaseChanged: function(phase) {
        // 获取房间状态，根据房间状态执行业务代码
        switch (phase) {
            case RoomPhase.Connecting: {
                break;
            }
            case RoomPhase.Connected: {
                break;
            }
            case RoomPhase.Reconnecting: {
                break;
            }
            case RoomPhase.Disconnecting: {
                break;
            }
            case RoomPhase.Disconnected: {
                break;
            }
        }
    },
});
```

## 不可写状态

除了 Connected 状态外，其他状态都是不可写状态。这些状态意味着此时房间既没有准备好接收房间里其他人发出的信令，也没有准备好发送信令。此时，设备操作会被自动禁止。任何修改房间状态的操作都会报错。

因此，不写状态下，这些操作都是被禁止的。

* 修改 Global State
* 修改 Member State
* 修改 View State
* 插入图片
* 插入 Plugin
* 插入、修改、删除场景
* 翻页 PPT
* 发送自定义事件

## 因为异常流程离开房间

实时房间可能因为各种异常情况，不得不中断服务。为了保障你的应用程序的稳定性，在设计业务逻辑之初，就应该把异常流程考虑在呢。

你可以在加入房间时，通过添加监听器，来处理异常流程。

```javascript
var joinRoomParams = {
    uuid: roomUUID,
    roomToken: roomToken,
};

whiteWebSdk.joinRoom(joinRoomParams, {

    onDisconnectWithError: function(err) {
        // 房间因为错误，和服务端断开连接
    },

    onKickedWithReason: function(err) {
        // 用户被踢出房间
    },
});
```

## 主动离开房间

如果不再使用白板了，就应该离开房间。Netless 互动白板**不会**自动离开房间。出于如下理由，我们不应该遗漏「离开房间」操作。

* 不离开房间的话，浏览器将维持与 Netless 服务器的长连接。这将消耗前端用户设备的包括网络带宽在内的各种资源。
* Netless 会对没有离开房间的用户继续收费。维持不必要的长连接将导致你所在的团队或公司产生不必要的开支。

```javascript
room.disconnect().then(function() {
    // 成功离开房间
}).catch(function(err) {
    // 离开房间失败，获得报错 err
});
```

> 对于前端，如果用户直接关闭浏览器，或关闭当前网页 Tab，会自动释放房间，无需担心。
