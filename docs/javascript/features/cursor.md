---
id: js-cursor
title: 鼠标位置同步
---

## 效果

> 在一个白板上操作时，可以同步鼠标位置到另一个白板上。效果如下：

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/cursor_adapter.mp4">
</video>

## 安装 cursor-adapter 库

``` bash
npm install @netless/cursor-adapter -save

或者

yarn add @netless/cursor-adapter
```

## 接入

```tsx
    // 1、引入对应的库
    import {UserCursor} from "@netless/cursor-adapter";
    // 2、new 出 UserCursor 对象赋值给 cursor
    const cursor = new UserCursor();
    const room = await whiteWebSdk.joinRoom({
            uuid: uuid,
            roomToken: roomToken,
            // 3、joinRoom 方法中传入 cursor 对象
            cursorAdapter: cursor,
            userPayload: {
                userId: userId,
                name: userName,
                  // 3、如果想鼠标的样子有用户的头像，avatar key 可以传入网络地址
                avatar: userAvatarUrl,
                identity: identity,
            }},
            {
            onRoomStateChanged: modifyState => {
                if (modifyState.roomMembers) {
                    // 5、房间中的成员状态发生变化后，需要更新 roomMembers 状态。
                    cursor.setColorAndAppliance(modifyState.roomMembers);
                }
            },
        });
    // 4、room 对象实例化后，第一时间传入 roomMembers
    cursor.setColorAndAppliance(room.state.roomMembers);
```
