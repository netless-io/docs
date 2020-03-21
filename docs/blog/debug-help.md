---
id: debug-help
title: Debug help
---

> We added and detailed client error logs in the version after `2.6.3`, to help customers locate problems.

## debug suggestions

If there is a problem with the customer later, we need to get the information quickly

1. `uuid` is the unique identification number of the whiteboard room, which helps us to lock the room and view the report log.
2. `roomToken`, our remote entry certificate for room debugging. (Note that `roomToken` is not the`sdkToken` returned in the management console, it was returned when the room was created)
3. You can add `userId` to`userPayload`, and the report log can be accurate to your user ID (supported after SDK upgrade to version 2.6.3)

    ``` typescript
        const room = await whiteWebSdk.joinRoom({
                            uuid: uuid,
                            roomToken: roomToken,
                            userPayload: {
                                userId: userId, // The userId to help locate the problem is written here
                            }},
    ```

4. If there are a lot of network requests in the beginning of the loading, you can consider that these requests all show a case, such as: the chat room is being established, and the whiteboard is being established. In this way, once it is stuck, it is clear which request is going to handle the failure.
