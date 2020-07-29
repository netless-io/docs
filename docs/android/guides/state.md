---
id: android-state
title: 状态订阅，获取
---

你可以通过如下方式获取当前房间的状态

## 订阅白板页面状态变化

在初始化房间时，传入对应的方法，当房间出现状态变化时，SDK 会主动调用对应方法，通知开发者，房间状态发生变化。

### 1. 房间状态变化

在调用`WhiteSDK`的`joinRoom`方法，`roomCallbacks`参数中，传入实现`RoomCallbacks`接口的实例，或者`AbstractRoomCallbacks`，后者可以覆盖感兴趣的回调方法。

```java
public interface RoomCallbacks {

    /** 房间网络连接状态回调事件 */
    void onPhaseChanged(RoomPhase phase);

    void onBeingAbleToCommitChange(boolean isAbleToCommit);

    /** 白板失去连接回调，附带错误信息 */
    void onDisconnectWithError(Exception e);

    /** 用户被远程服务器踢出房间，附带踢出原因 */
    void onKickedWithReason(String reason);

    /**
     房间中RoomState属性，发生变化时，会触发该回调。
     注意：主动设置的 RoomState，不会触发该回调。
     @param modifyState 发生变化的 RoomState 内容
     */
    void onRoomStateChanged(RoomState modifyState);

    /** 用户错误事件捕获，附带用户 id，以及错误原因 */
    void onCatchErrorWhenAppendFrame(long userId, Exception error);
}
```

### 2. Player 状态变化

调用 WhiteSdk 的`createPlayer`方法，`playerEventListener`参数，传入实现`PlayerEventListener`接口的实例。

```Java
    /**
     * 播放状态切换回调
     */
    void onPhaseChanged(PlayerPhase phase);

    /**
     * 首帧加载回调
     */
    void onLoadFirstFrame();

    /**
     * 分片切换回调，需要了解分片机制。目前无实际用途
     */
    void onSliceChanged(String slice);

    /**
     * 播放中，状态出现变化的回调
     */
    void onPlayerStateChanged(PlayerState modifyState);

    /**
     * 出错暂停
     */
    void onStoppedWithError(SDKError error);

    /**
     * 进度时间变化
     */
    void onScheduleTimeChanged(long time);

    /**
     * 添加帧出错
     */
    void onCatchErrorWhenAppendFrame(SDKError error);
    /**
     * 渲染时，出错
     */
    void onCatchErrorWhenRender(SDKError error);
}
```

## 主动获取状态

主动获取房间状态 API 分为异步 API 与同步 API。  
这里只介绍同步 API，对应异步 API 可以通过同步 API 的注释进行查看，此处不做赘述。

### 1. 房间状态

```java
//目前 globalState 为空，不再有当前 state 内容。
GlobalState globalState = room.getGlobalState();

//获取房间 memberState 状态：教具
MemberState memberState = room.getMemberState();

//获取用户当前视角状态
BroadcastState broadcastState = room.getBroadcastState();

//获取房间成员信息
RoomMember[] roomMembers = room.getRoomMembers();

//获取房间 SceneState 页面信息，具体见 SceneState 类
SceneState sceneState = room.getSceneState();

//获取房间当前场景目录下的所有 Scene 页面信息
Scene scenes = room.getScenes();
```

### 2. Player 状态

```Java
/**
 * 获取房间状态
 * 目前：初始状态为 WhitePlayerPhaseWaitingFirstFrame
 * 当 WhitePlayerPhaseWaitingFirstFrame 时，调用 getPlayerStateWithResult 返回值可能为空。
*/
public PlayerPhase getPhase();

/**
 * 当 phase 状态为 WhitePlayerPhaseWaitingFirstFrame
 * 回调得到的数据是空的
 */
public PlayerState getPlayerState()

/** 
 * 获取播放器信息（当前时长，总时长，开始 UTC 时间戳）
 * 时长单位为毫秒
 */
public void getPlayerTimeInfo(final Promise<PlayerTimeInfo> promise) {
```

## 注意点

主动获取房间状态，实际上就是 SDK 通过前面API 对房间状态变化进行监听API，然后将发生变化的状态，与已经缓存好的状态属性进行合并。以此方便用户调用。

如果在同一代码块中，使用了能够改变房间状态的 API（更换教具，切换页面等操作），此时立刻通过同步 API 进行查看，会发现状态没有发生改变。这是因为需要在下一个主线程循环中，状态才会被合并。此时，请使用异步 API 进行操作。

## 自定义 GlobalState<span class="anchor" id="globalstate">

> 2.4.7 新增 API

实时房间状态中的`globalState`属性，为所有客户公共可读写状态；回放房间状态 `globalState` 为只读属性，修改不会生效。
如果说，自定义事件是同步自定义行为，那么`globalState`就是用来同步自定义状态的。

>2.0 版本一直设置自定义`globalState`状态。`setGlobalState:`API，传入自定义`globalState`子类即可将自定义内容传递给房间中其他用户。

开发者可以调用 `WhiteDisplayerState`中的`setCustomGlobalStateClass`类方法，全局设置自定义`globalState`属性。

```Java
public class WhiteDisplayerState extends WhiteObject {
    /**
     * 设置自定义全局变量类型，设置后，所有 GlobalState 都会转换为该类的实例。
     *
     * @param <T> 类型约束
     * @param classOfT 自定义 GlobalState Class
     * @since 2.4.7
     * example 
     */
    public static <T extends GlobalState> void setCustomGlobalStateClass(Class<T> classOfT);
}
```

示例代码：

```Java
/** 设置自定义全局状态，在后续回调中 GlobalState 直接进行类型转换即可 */
WhiteDisplayerState.setCustomGlobalStateClass(MyGlobalState.class);
```

传入开发者自定义的`GlobalState`子类后，`RoomState`，`PlayerState`在反序列化`globalState`时，都会将该内容自动反序列化为该子类。

>设置好自定义`globalState`后，不需要额外操作。只需要在使用原有 API 时，进行对应类型强制转换即可。