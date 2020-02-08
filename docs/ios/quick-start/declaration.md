---
id: ios-declare
title: Overview
---

Through this tutorial, you will be familiar with the life cycle of the whiteboard from creation to end, and event callbacks.

## Process

1. Create an account in the SDK background and integrate the SDK into the iOS project
2. In the iOS project, create a whiteboard instance and initialize the SDK
3. Communicate with the sdk server, use the sdk token to authenticate, create a room to get the room uuid and roomToken, or directly query the room token of the specific room uuid.
4. Invoke sdk to join the room method, passing in uuid and room token.
5. Implement whiteboard room status callback protocol

## Demo

Demo url: [Whiteboard](https://github.com/netless-io/Whiteboard-ios).