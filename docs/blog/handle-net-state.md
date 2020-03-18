---
id: handle-net-state
title: Network exception handling
---

> The long connection service has higher requirements on the network quality. When using the netless whiteboard, you must deal with network abnormal conditions.

## Callback provided by netless when the network is abnormal

``` ts
const room = whiteWebSdk.joinRoom({
                uuid: uuid,
                roomToken: roomToken,
                {
                    onPhaseChanged: phase => {
                        console.log(`room ${"uuid"} changed: ${phase}`);
                        // When the connection status of the whiteboard changes, the phase may change to the following states
                        // Connecting = "connecting",
                        // Connected = "connected",
                        // Reconnecting = "reconnecting",
                        // Disconnecting = "disconnecting",
                        // Disconnected = "disconnected",
                    },
                });
```

## Principles for handling network exceptions

1. The member methods and member properties of room cannot be operated in the disconnected state.

    ``` ts
    phase === "connected" // It is the state that the room is connected to the server, and the other four states must be stationary.
    ```

2. Code case

    ``` ts
        // This member method cannot be called
        room.setViewMode(ViewMode.Broadcaster);
        // This member property cannot be assigned
        room.disableCameraTransform = false;
    ```

3. Error cases

    ![error](/img/error.png)
