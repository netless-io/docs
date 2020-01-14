---
id: android-replay
title: Replay
---

> When creating a room, you need to set it as a replayable room. Since the playback room consumes more resources, it needs to be set up by the developer.
For details, please refer to [Server Documentation] (/ docs / server / api / server-whiteboard-base) to create the whiteboard API.

## Quick start

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
// beta13 adds roomToken requirements
PlayerConfiguration playerConfiguration = new PlayerConfiguration (uuid, roomToken);
// 2.0.0-beta15 starting Android time unit is unified to milliseconds.
// Start timestamp, duration, corrected from the previous second to milliseconds.

// Currently, the duration is only valid when the start timestamp is passed in
// playerConfiguration.setDuration (3L);
// playerConfiguration.setBeginTimestamp (1559966276L);
// When an audio address is passed in, the Player will automatically synchronize with the audio and video playback to ensure simultaneous playback, and will pause when one party buffers.
playerConfiguration.setAudioUrl(m3u8);

whiteSdk.createPlayer(playerConfiguration, new AbstractPlayerEventListener() {
    // The following is the room status callback, you can view the [status management] document
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

* The above code can be viewed in PlayActivity in [white-demo-android](https://github.com/duty-os/white-demo-android) Demo.

## Video support

Starting from 2.4.23, SDK provides the `PlayerSyncManager` class, which supports the synchronization of the status of the whiteboard and the video player.

* What developers need to do:

1. In the `onPhaseChanged (PlayerPhase phase)` callback of `whitePlayer`, pass the status of` whitePlayer` to `playerSyncManager` via the` updateWhitePlayerPhase` method of `playerSyncManager`.
2. In the video player, implement the `nativePlayer` interface. And when the video player enters the buffer, when the buffering ends, call the updateNativePhase of playerSyncManager in time, and pass in the appropriate NativePlayerPhase according to the state of the video player.
3. Use the `play`,` pause` methods of `PlayerSyncManager`.

## Related classes and APIs

### PlayerConfiguration

Used to initialize the Player, pass in specific parameters, and set the beginTimestamp to determine the UTC time to start playback. Set duration to determine the duration.

```Java
public class PlayerConfiguration extends WhiteObject {
    private String room; // room uuid
    private String roomToken; // room roomToken
    private String slice; // shard id, no need to know for now
    private Long beginTimestamp; // start timestamp-2.0.0-beta15 start, milliseconds; before, seconds
    private Long duration; // Duration-2.0.0-beta15 start, milliseconds; seconds before

    / *
    Audio address. Video is not supported at this time.
    Player will automatically synchronize with audio and video playback to ensure simultaneous playback. When one party buffers, it will pause.
    * /
    private String audioUrl;

    public PlayerConfiguration (String room, String roomToken) {
        this.room = room;
        this.roomToken = roomToken;
    }

    // setter getter method omitted below
}
```

> Current: Duration takes effect only when the start UTC timestamp is passed in.

> Audio address, video is not supported at this time. Player will automatically synchronize with audio playback to ensure simultaneous playback. When one party buffers, it will pause together.

### Player

```Java
public void play ()
public void pause ()
// stop, the player resource will be released. Need to recreate the WhitePlayer instance before it can be replayed
public void stop ()
// Jump to specific time, start time is 0, unit is millisecond
public void seekToScheduleTime (long beginTime)
// Set viewing mode
public void setObserverMode (PlayerObserverMode mode)
/**
* Get room status
* Currently: Initial state is WhitePlayerPhaseWaitingFirstFrame
*/
public PlayerPhase getPhase ()

// Listen to custom events
public void addMagixEventListener (String eventName, EventListener eventListener)
// Remove custom event listener
public void removeMagixEventListener (String eventName)

/**
* When phase is WhitePlayerPhaseWaitingFirstFrame
* Callback data is empty
*/
public PlayerState getPlayerState ()
/** Get player information (current time, total time, start UTC timestamp) Unit: milliseconds */
public PlayerTimeInfo getPlayerTimeInfo ()
```

### PlayerPhase

An enumerated value representing the playback status of the room.

```Java
public enum PlayerPhase {
    waitingFirstFrame, // waiting for the first frame
    playing, // playing status
    pause, // Pause status
    stopped, // stop
    ended, // Ended
    buffering, // buffering
}
```

### PlayerObserverMode

Represents the perspective mode. The follow mode will follow the anchor user. When there is no anchor, it will follow the earliest user.

```Java
public enum  PlayerObserverMode {
    directory, // Follow the pattern
    freedom // free mode
}
```

### PlayerEventListener

When the state of the playback room changes, the `PlayerEventListener` that is passed in when the Player is created will have a default empty implementation: `AbstractPlayerEventListener`.

```Java
public interface PlayerEventListener {
    /**
     * Playback status switching callback
     */
    void onPhaseChanged (PlayerPhase phase);

    /**
     * First frame loading callback
     */
    void onLoadFirstFrame ();

    /**
     * Shard switching callback requires understanding of the sharding mechanism. No actual use
     */
    void onSliceChanged (String slice);

    /**
     * Callback when the status changes during playback
     */
    void onPlayerStateChanged (PlayerState modifyState);

    /**
     * Pause on error
     */
    void onStoppedWithError (SDKError error);

    /**
     * Progress time changes
     */
    void onScheduleTimeChanged (long time);

    /**
     * Error adding frame
     */
    void onCatchErrorWhenAppendFrame (SDKError error);
    /**
     * Error during rendering
     */
    void onCatchErrorWhenRender (SDKError error);
}
```

### PlayerState

Similar to `RoomState`,` RoomState` stores some states of the playback room. State change event callback, please refer to `PlayerEventListener` and [State Management](./state.md).

```Java
public class PlayerState {
    private GlobalState globalState;
    /**
     * Room user status
     */
    private RoomMember [] roomMembers;

    private SceneState sceneState;
    /**
     * User observation status
     */
    private PlayerObserverMode observerMode;

    // The getter method is omitted below. Modifying the value of this property will not affect the player, so this class has only the getter method
}
```

### PlayerTimeInfo

This type of record Player related time record information

```Java
public class PlayerTimeInfo {


    private long scheduleTime;
    private long timeDuration;
    private int framesCount;
    private long beginTimestamp;

    /**
     * Current time progress (ms)
     */
    public long getScheduleTime () {
        return scheduleTime;
    }
    /**
     * Total duration (ms)
     */
    public long getTimeDuration () {
        return timeDuration;
    }

    public int getFramesCount () {
        return framesCount;
    }

    /**
     * Start time, UTC timestamp (ms)
     */
    public long getBeginTimestamp () {
        return beginTimestamp;
    }
}

```