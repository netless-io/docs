---
id: custom-behavior
title: 自定义行为
---

互动白板的状态同步是基于 Netless 的实时信令同步网络实现的。实际上，你可以把你自己的自定义业务逻辑通过这套信令同步网络广播到全房间。

到此章为止，我们假设你已经将 Netless 互动白板 SDK 安装并引入了项目，并且已经获取到实时房间实例 `room` 对象。如果没有，你可能跳过了之前的章节，强烈建议先阅读[《安装》](https://developer.netless.link/javascript/advanced-tutorial/installation)[《实时房间》](https://developer.netless.link/javascript/advanced-tutorial/realtime-room)。

## 自定义事件

根据你自己的业务逻辑，可以定义自定义事件广播全房间。通过如下代码，可以发送自定事件。

```javascript
var event = "ChatMessage"; // 取一个合适的自定义事件名称
var payload = {...}; // 事件荷载，由事件附带，根据业务逻辑自行设计

room.dispatchMagixEvent(event, payload);
```

通过如下代码，可以接受房间里其他人发送的自定义事件。

```javascript
var event = "ChatMessage"; // 你希望监听的自定义事件名称

room.addMagixEventListener(event, onReceivedChatMessage);

function onReceivedChatMessage(event) {
    console.log(event.payload); // 接收到事，并打印出来
}
```

当不再希望接收某个自定义事件时，可以通过如下代码注销监听。

```javascript
var event = "ChatMessage"; // 你希望注销监听的自定义事件名称
room.removeMagixEventListener(event, onReceivedChatMessage);
```

如果想了解更多，可以继续阅读[《自定义事件》](https://developer.netless.link/documents/client/custom-event)。

## Global State

这是一个类型为字典 object 的全房间共享的全局变量。房间里任何用户都可以读取它，以及监听它的变化，任何互动模式的用户都可以修改它。

通过如下代码读取 Global State。

```javascript
var globalState = room.state.globalState;
```

通过如下代码修改 Global State。

```javascript
room.setGlobalState({
    "my-custom-key": {...},
});
```

通过在加入房间时传入回调函数，可以监听房间的 Global State 值的变化。

```javascript
var joinRoomParams = {
    uuid: uuid,
    roomToken: roomToken,
};
whiteWebSdk.joinRoom(joinRoomParams, {
    onRoomStateChanged: function(modifyState) {
        if (modifyState.globalState) {
            // Global State 发生了变化，读取到变化后的值
            var globalState = modifyState.globalState;
        }
    }
});
```

如果想了解更多，可以继续阅读[《Global State ｜ 房间业务状态管理》](https://developer.netless.link/documents/client/room-business-state-management#global-state)。

## 如何选择

无论自定义事件，还是 Global State，既可以监听它们的变化，也可以在房间引发它们来传递信息。那么，我们设计自定义行为的时候，应该选哪一个呢？

### 自定义行为会有持续影响时，应该选 Global State

举个例子，假如你要设计一个自定义行为：任何加入房间的人，都可以修改 UI 界面的 Logo。

你应该设置一个 Global State 的 key，名叫 `"logoURL"` ，并且允许所有人修改这个值。为了让这个值能和 UI 界面的 Logo 绑定，每个人在加入房间时还要做如下事情。

* 在刚刚加入房间时，立即读取 Global State 的 `"logoURL"` 的值，并以此值初始化 UI 界面的 Logo。
* 监听 `"logoURL"` 的变化。一旦变化了，立即修改 UI 界面的 Logo。

想一想，该需求，能否用自定义事件实现？实际上是不可能的。因为自定义事件是一瞬间的，它无法产生持续影响。想象一下，如果某个用户很晚才加入房间，那么他无法知晓在他尚未加入房间的这段时间内广播过多少自定义事件。该用户甚至无法知晓当前房间的 Logo 应该长成什么样。

### 只关心自定义行为的瞬间反应时，应该选择自定义事件

举个例子，房间内所有成员可以点赞，点赞会让所有人的屏幕上播一段点赞动画。这一行为显然用自定义事件实现是最方便的。我们不关心点赞的结果，因为这只是一段动画，播放完就完了。

倘若有一个用户很晚才加入房间，他其实根本不关系之前播放过多少段点赞动画，他只关心他加入之后，是否还有人继续点赞。
