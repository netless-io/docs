---
id: android-replay
title: 回放
---

>创建房间时，需要设置为可回放房间。由于回放房间会占用更多资源，需要开发者主动设置。  
具体请在 [服务器文档](/docs/server/api/server-whiteboard-base) 中查看 创建白板 API。

## 快速开始

```Java
Intent intent = getIntent();
final String uuid = intent.getStringExtra("uuid");
final String m3u8 = intent.getStringExtra("m3u8");
final String roomToken = intent.getStringExtra("roomToken");

whiteBroadView = (WhiteBroadView) findViewById(R.id.playWhite);
WhiteSdk whiteSdk = new WhiteSdk(
        whiteBroadView,
        PlayActivity.this,
        new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1));
// beta13 增加 roomToken 要求
PlayerConfiguration playerConfiguration = new PlayerConfiguration(uuid, roomToken);
// 2.0.0-beta15 开始 Android 时间单位统一为毫秒。
// 开始时间戳，持续时间，由之前的秒，修正为毫秒。

// 目前，持续时间，只有在传入了开始时间戳时，才有效
// playerConfiguration.setDuration(3L);
// playerConfiguration.setBeginTimestamp(1559966276L);
// 传入音频地址时，Player 会自动与音视频播放做同步，保证同时播放，当一方缓冲时，会暂停。
playerConfiguration.setAudioUrl(m3u8);

whiteSdk.createPlayer(playerConfiguration, new AbstractPlayerEventListener() {
    // 以下为房间状态回调，可以查看 [状态管理] 文档
    @Override
    public void onPhaseChanged(PlayerPhase phase) {
        showToast(gson.toJson(phase));
    }

    @Override
    public void onLoadFirstFrame() {
        showToast("onLoadFirstFrame");
    }

    @Override
    public void onSliceChanged(String slice) {
        showToast(slice);
    }

    @Override
    public void onPlayerStateChanged(PlayerState modifyState) {
        showToast(gson.toJson(modifyState));
    }

    @Override
    public void onStoppedWithError(SDKError error) {
        showToast(error.getJsStack());
    }

    @Override
    public void onScheduleTimeChanged(long time) {
        showToast(time);
    }

    @Override
    public void onCatchErrorWhenAppendFrame(SDKError error) {
        showToast(error.getJsStack());
    }

    @Override
    public void onCatchErrorWhenRender(SDKError error) {
        showToast(error.getJsStack());
    }
}, new Promise<Player>() {
    @Override
    public void then(Player player) {
        player.play();
    }

    @Override
    public void catchEx(SDKError t) {
        Logger.error("create player error, ", t);
    }
});
```

* 以上代码，可以在 [white-demo-android](https://github.com/duty-os/white-demo-android) Demo 中的 PlayActivity 中查看。

## 视频支持

2.4.23 开始，sdk 提供`PlayerSyncManager`类，支持同步白板与视频播放器的状态。

* 开发者需要做的：

1. 在`whitePlayer`的`onPhaseChanged(PlayerPhase phase)`回调中，将`whitePlayer`的状态通过`playerSyncManager`的`updateWhitePlayerPhase`方法传递给`playerSyncManager`。
1. 在视频播放器中，实现`nativePlayer`接口。并且在视频播放器，进入缓冲，结束缓冲时，及时调用`playerSyncManager`的`updateNativePhase`，根据视频播放器的状态，传入合适的`NativePlayerPhase`。
1. 使用`PlayerSyncManager`的`play`,`pause`方法。

## 相关类与 API

### PlayerConfiguration

用于初始化 Player，传入特定的参数，通过设置 beginTimestamp，来确定开始回放的 UTC 时间。设置 duration，来确定持续时间。

```Java
public class PlayerConfiguration extends WhiteObject {
    private String room;//房间 uuid
    private String roomToken;// 房间 roomToken
    private String slice;//分片 id，暂时无需了解
    private Long beginTimestamp;//开始时间戳——2.0.0-beta15 开始，为毫秒；之前为秒
    private Long duration;//持续时间——2.0.0-beta15 开始，为毫秒；之前为秒

    /*
    音频地址，暂不支持视频。
    Player 会自动与音视频播放做同步，保证同时播放，当一方缓冲时，会暂停。
    */
    private String audioUrl;

    public PlayerConfiguration(String room, String roomToken) {
        this.room = room;
        this.roomToken = roomToken;
    }

    // 以下省略 setter getter 方法
}
```

>目前：持续时间只有在传入了开始 UTC 时间戳的时候，才生效。

>音频地址，暂不支持视频。Player 会自动与音频播放做同步，保证同时播放，当一方缓冲时，会一起暂停。

### Player

```Java
public void play()
public void pause()
//stop 后，player 资源会被释放。需要重新创建WhitePlayer实例，才可以重新播放
public void stop()
//跳转至特定时间，开始时间为 0，单位毫秒
public void seekToScheduleTime(long beginTime)
//设置查看模式
public void setObserverMode(PlayerObserverMode mode)
/**
* 获取房间状态
* 目前：初始状态为 WhitePlayerPhaseWaitingFirstFrame
*/
public PlayerPhase getPhase()

//监听自定义事件
public void addMagixEventListener(String eventName, EventListener eventListener)
//移除自定义事件监听
public void removeMagixEventListener(String eventName)

/**
* 当 phase 状态为 WhitePlayerPhaseWaitingFirstFrame
* 回调得到的数据是空的
*/
public PlayerState getPlayerState()
/** 获取播放器信息（当前时长，总时长，开始 UTC 时间戳）单位：毫秒 */
public PlayerTimeInfo getPlayerTimeInfo()
```

### PlayerPhase

表示房间播放状态的枚举值。

```Java
public enum PlayerPhase {
    waitingFirstFrame,  //等待第一帧
    playing,            //播放状态
    pause,              //暂停状态
    stopped,            //停止
    ended,              //播放结束
    buffering,          //缓冲
}
```

### PlayerObserverMode

表示视角模式，跟随模式会跟随主播用户，没有主播时，会跟随最早进入的用户。

```Java
public enum  PlayerObserverMode {
    directory, //跟随模式
    freedom    //自由模式
}
```

### PlayerEventListener

回放房间状态发生改变，会调用在创建 Player 时，传入的 `PlayerEventListener` ，有默认空实现：`AbstractPlayerEventListener` 。

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
}
```

### PlayerState

类似于 `Room` 的 `RoomState` ，储存了回放房间的一些状态。状态变化事件回调，请参考 `PlayerEventListener` 以及 [状态管理](./state.md) 。


```Java
public class PlayerState {
    private GlobalState globalState;
    /**
     * 房间用户状态
     */
    private RoomMember[] roomMembers;

    private SceneState sceneState;
    /**
     * 用户观察状态
     */
    private PlayerObserverMode observerMode;

    // 以下省略 getter 方法，修改该属性中的值，不会对 player 产生影响，所以该类，只有 getter 方法
}
```

### PlayerTimeInfo

该类记录 Player 相关时间记录信息

```Java
public class PlayerTimeInfo {


    private long scheduleTime;
    private long timeDuration;
    private int framesCount;
    private long beginTimestamp;

    /**
     * 当前时间进度（毫秒）
     */
    public long getScheduleTime() {
        return scheduleTime;
    }
    /**
     * 总时长(毫秒）
     */
    public long getTimeDuration() {
        return timeDuration;
    }

    public int getFramesCount() {
        return framesCount;
    }

    /**
     * 开始时间，UTC 时间戳（毫秒）
     */
    public long getBeginTimestamp() {
        return beginTimestamp;
    }
}

```