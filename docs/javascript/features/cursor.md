---
id: js-cursor
title: Cursor position sync
---

## Effect

> When operating on one whiteboard, you can synchronize the mouse position to another whiteboard. The effect is as follows:

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/cursor_adapter.mp4">
</video>

## Install the cursor-adapter library

``` bash
npm install @netless/cursor-adapter -save

or

yarn add @netless/cursor-adapter
```

## Install

```tsx
    // 1. import lib
    import {UserCursor} from "@netless/cursor-adapter";
    // 2. new cursor obj
    const cursor = new UserCursor();
    const room = await whiteWebSdk.joinRoom({
            uuid: uuid,
            roomToken: roomToken,
            // 3. assignment
            cursorAdapter: cursor,
            userPayload: {
                userId: userId,
                name: userName,
                  // 4. If you want the mouse to have the user's avatar, the avatar key can be passed into the network address
                avatar: userAvatarUrl,
                identity: identity,
            }},
            {
            onRoomStateChanged: modifyState => {
                if (modifyState.roomMembers) {
                    // 6、After the status of the members in the room changes, the roomMembers status needs to be updated.
                    cursor.setColorAndAppliance(modifyState.roomMembers);
                }
            },
        });
    // 5、After the room object is instantiated, it is passed into roomMembers as soon as possible
    cursor.setColorAndAppliance(room.state.roomMembers);
```
