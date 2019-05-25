---
id: android-state
title: 状态管理
---

你可以通过如下方式获取当前房间的状态

## 1. 房间状态

```java
//目前 globalState 为空，不再有当前 state 内容。
room.getGlobalState(new Promise<GlobalState>() {
    @Override
    public void then(GlobalState globalState) {}
    @Override
    public void catchEx(Exception e) {}
});
//获取房间 memberState 状态：教具
room.getMemberState(new Promise<MemberState>() {
    @Override
    public void then(MemberState memberState) {}
    @Override
    public void catchEx(Exception e) {}
});
//获取用户当前视角状态
room.getBroadcastState(new Promise<BroadcastState>() {
    @Override
    public void then(BroadcastState broadcastState) {}
    @Override
    public void catchEx(Exception t) {}
});
//获取房间成员信息
room.getRoomMembers(new Promise<RoomMember[]>() {
    @Override
    public void then(RoomMembers RoomMembers[]) {}
    @Override
    public void catchEx(Exception t) {}
});
//获取房间 SceneState 页面信息，具体见 SceneState 类
room.getSceneState(new Promise<SceneState>) {
    @Override
    public void then(SceneState state) {}
    @Override
    public void catchEx(Exception t) {}
}
//获取房间 Scene，所有页面信息
room.getScene(new Promise<SceneState>) {
       @Override
    public void then(SceneState state) {}
    @Override
    public void catchEx(Exception t) {} 
}
```

## 2. Player 状态

```Java
/**
 * 获取房间状态
 * 目前：初始状态为 WhitePlayerPhaseWaitingFirstFrame
 * 当 WhitePlayerPhaseWaitingFirstFrame 时，调用 getPlayerStateWithResult 返回值可能为空。
*/
public void getPhase(final Promise<PlayerPhase> promise) {

/**
 * 当 phase 状态为 WhitePlayerPhaseWaitingFirstFrame
 * 回调得到的数据是空的
 */
public void getPlayerState(final Promise<PlayerState> promise) {

/** 获取播放器信息（当前时长，总市场，开始 UTC 时间戳） */
public void getPlayerTimeInfo(final Promise<PlayerTimeInfo> promise) {
```

# 订阅白板页面状态变化

## 1. 房间状态变化

以上状态，都有可以通过 API 进行改变，为了监听以上状态的变化，需要在使用 `WhiteSDK` 调用 `joinRoom(final RoomParams roomParams, RoomCallbacks roomCallbacks, Promise<Room> roomPromise)` 方法，直接传入 实现 `RoomCallbacks` 接口的实例，或者 使用 `AbstractRoomCallbacks` ，后者可以只覆盖感兴趣的回调方法。

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

## 2. Player 状态变化

调用该方法 `createPlayer(PlayerConfiguration playerConfiguration, PlayerEventListener playerEventListener, Promise<Player> playerPromise)` 直接传入实现 `PlayerEventListener` 接口类。

```Java
public interface PlayerEventListener {
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

    /**
     * 用户头像信息变化
     */
    void onCursorViewsUpdate(UpdateCursor updateCursor);
}
```
