---
id: android-state
title: State management
---

You can get the status of the current room as follows

## 1. Room status

```java
// Currently globalState is empty, there is no current state content.
GlobalState globalState = room.getGlobalState ();

// Get room memberState status: teaching aids
MemberState memberState = room.getMemberState ();

// Get the current perspective of the user
BroadcastState broadcastState = room.getBroadcastState ();

// Get room member information
RoomMember [] roomMembers = room.getRoomMembers ();

// Get the SceneState page information, see SceneState class for details
SceneState sceneState = room.getSceneState ();

// Get all Scene page information under the current scene directory of the room
Scene scenes = room.getScenes ();
```

## 2. Player state

```Java
/**
 * Get room status
 * Currently: Initial state is WhitePlayerPhaseWaitingFirstFrame
 * When WhitePlayerPhaseWaitingFirstFrame, the return value of calling getPlayerStateWithResult may be empty.
*/
public PlayerPhase getPhase();

/**
 * When phase is WhitePlayerPhaseWaitingFirstFrame
 * Callback data is empty
 */
public PlayerState getPlayerState()

/** 
 * Get player information (current time, total time, start UTC timestamp)
 * Duration in milliseconds
 */
public void getPlayerTimeInfo(final Promise<PlayerTimeInfo> promise) {
```

# Subscribe to whiteboard page status changes

## 1. Room status change

The above states can be changed through the API. In order to listen to the above state changes, you need to call `joinRoom (final RoomParams roomParams, RoomCallbacks roomCallbacks, Promise <Room> roomPromise)` method using `WhiteSDK` and directly pass in to implement` RoomCallbacks` An instance of the interface, or use AbstractRoomCallbacks, which can override only callback methods of interest.

```java
public interface RoomCallbacks {

    /** Room network connection status callback event */
    void onPhaseChanged (RoomPhase phase);

    void onBeingAbleToCommitChange (boolean isAbleToCommit);

    /** Whiteboard loses connection callback with error message */
    void onDisconnectWithError (Exception e);

    /** The user was kicked out of the room by the remote server with a kick out reason */
    void onKickedWithReason (String reason);

    /**
     The RoomState property in the room will trigger this callback when it changes.
     Note: The RoomState that is actively set will not trigger this callback.
     @param modifyState RoomState content changed
     */
    void onRoomStateChanged (RoomState modifyState);

    /** User error event capture with user id and error cause */
    void onCatchErrorWhenAppendFrame (long userId, Exception error);
}
```

## 2. Player state change

Call this method `createPlayer(PlayerConfiguration playerConfiguration, PlayerEventListener playerEventListener, Promise<Player> playerPromise)` and pass it directly to the `PlayerEventListener` interface class.

```Java
public interface PlayerEventListener {
    /**
     * Playback status switching callback
     */
    void onPhaseChanged(PlayerPhase phase);

    /**
     * First frame loading callback
     */
    void onLoadFirstFrame();

    /**
     * Shard switching callback requires understanding of the sharding mechanism. No actual use
     */
    void onSliceChanged(String slice);

    /**
     * Callback during status change
     */
    void onPlayerStateChanged(PlayerState modifyState);

    /**
     * Pause on error
     */
    void onStoppedWithError(SDKError error);

    /**
     * Progress time change
     */
    void onScheduleTimeChanged(long time);

    /**
     * Error adding frames
     */
    void onCatchErrorWhenAppendFrame(SDKError error);
    /**
     * Error while rendering
     */
    void onCatchErrorWhenRender(SDKError error);
}
```

## Custom GlobalState <span class = "anchor" id = "globalstate">

> 2.4.7 New API

The globalState property in the real-time room state is a common read-write state for all customers; the playback room state globalState is a read-only property, and the modification will not take effect.
If the custom event is a synchronous custom behavior, then `globalState` is used to synchronize the custom state.

> 2.0 version always set custom `globalState` state. `setGlobalState:` API. Pass the custom `globalState` subclass to pass the custom content to other users in the room.

Developers can call the `setCustomGlobalStateClass` class method in` WhiteDisplayerState` to set the custom `globalState` property globally.

```Java
public class WhiteDisplayerState extends WhiteObject {
    /**
     * Set a custom global variable type. Once set, all GlobalStates will be converted to instances of this class.
     *
     * @param <T> Type constraint
     * @param classOfT Custom GlobalState Class
     * @since 2.4.7
     * example 
     */
    public static <T extends GlobalState> void setCustomGlobalStateClass(Class<T> classOfT);
}
```

Sample code:

```Java
/** Set a custom global state. GlobalState can be directly type converted in subsequent callbacks. */
WhiteDisplayerState.setCustomGlobalStateClass(MyGlobalState.class);
```

After passing in the developer-defined `GlobalState` subclass,` RoomState` and `PlayerState` will deserialize the content into this subclass automatically when deserializing` globalState`.

> After setting the custom `globalState`, no additional operations are required. You only need to cast the corresponding type when using the original API.