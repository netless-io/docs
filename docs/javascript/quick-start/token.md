---
id: js-token
title: Room authentication
---

## Safety instructions

> The operations performed in this section should be performed in the developer business server. The request can be found at [Whiteboard basic API](server/api/whiteboard-base.md).

To create a room / get a room, you need to use `sdkToken` to interact with the` SDK` backend server.
`sdkToken` is a credential for the` SDK` back-end server to communicate with the developer's back-end business server. After mastering `sdkToken`, the` SDK` backend server will think that this is an operation performed by the developer. It mainly involves developers' billing and rights management for corresponding resources.

In this chapter, for the convenience of demonstration, the operation of `creating a room` /` getting a specific roomroomToken` is written on the front end. In actual business, in order to prevent someone from decompiling client code or capturing packages and obtaining `SDKToken`, please do not expose` sdkToken` on any client.

## Create new room and get roomToken

> This network request creates a room API for the server, more details can be viewed[Whiteboard basic API](server/api/whiteboard-base.md#create-whiteboard-room)

```javascript
var sdkToken = "Read [Prerequisites] to get token";
var url = 'https://cloudcapiv4.herewhite.com/room?token=' + sdkToken;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name: "房间名称",
        limit: 100, // Limit on the number of rooms
        mode: "persistent",  // Normal room, unable to play back
        // mode: "historied"， // Playback room
    }),
};

// Request to create a room and get sdk backend server response
fetch(url, requestInit).then(function(response) {
    return response.json();
}).then(function(json) {
    console.log(json);
}).catch(function(err) {
    console.error(err);
});
```

## Get RoomToken for a specific room

> This network request is for the server to obtain a specific whiteboard roomToken API, more details can be viewed [Whiteboard basic API](server/api/whiteboard-base.md)

```javascript
var sdkToken = "Read the [Prerequisites] document to get the token";
var uuid = "Read from the business server or URL";
// Note that the path to the room is room / join and the room is created as room
var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}&uuid=${uuid}`;
var requestInit = {
    method: 'POST',
    headers: {
        "content-type": "application/json",
    },
};

fetch(url, requestInit).then(function(response) {
    return response.json();
}).then(function(json) {
    console.log(json);
}).catch(function(err) {
    console.error(err);
});
```