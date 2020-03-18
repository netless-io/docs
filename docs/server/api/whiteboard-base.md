---
id: server-whiteboard-base
title: Whiteboard basics API
---

## Main API

### create whiteboard room

`POST /room`

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
name | string | Whiteboard name|
limit | number | Setting it to 0 is not restricted, it is recommended to set it to 0: the room is not restricted and it is restricted from business.|
mode | string | **v2 version parameters**; Room type: `persistent`,`historied` |

* Room type:

There are two modes of the room: persistent room and replayable room. The room mode must be specified when it is created, and once determined, it cannot be modified. Different modes have the following characteristics:

|    Mode    | Persistent | Replayable |                            description                            |
| :--------: | :------: | :----: | :--------------------------------------------------------: |
| Persistent Room (default)-`persistent` |    ✓     |   ✘   |    Even if the room will be permanent, unless manually deleted by calling the API.     |
| Playable Room-`historied` |    ✓     |   ✓    | Same as "Persistent Room". And everything in the room will be recorded automatically for playback. |

* body example

```json
{
    "name":"Whiteboard name",
    "limit":0,
}
```

* response

```JSON
{
    "code": 200,
    "msg": {
        "room": {
            "id": 650,
            "name": "console-room",
            "limit": 0,
            "teamId": 1,
            "adminId": 1,
            "mode": "persistent",
            "template": "meeting",
            "region": "cn",
            "uuid": "Here is the room uuid",
            "updatedAt": "2019-01-15T09:12:05.974Z",
            "createdAt": "2019-01-15T09:12:05.974Z"
        },
        "hare": "{\"uuid\":\"uuid\",\"teamId\":\"1\",\"mode\":\"persistent\",\"region\":\"cn\",\"isBan\":false,\"beginTimestamp\":1547543526200,\"endTimestamp\":1547543526200,\"endFrameId\":0,\"usersMaxCount\":100,\"survivalDuration\":30000,\"chunkFramesCount\":700,\"snapshotIdInterval\":80}",
        "roomToken": "Here is the room roomToken",
        "code": 201
    }
}
```

### Get specific whiteboard room Token

`GET /room/{{uuid}}/roomtoken`

* header parameter

Field | Type | Description |
-|-|-|
token | string | {{token}} |

* query parameter

Field | Type | Description |
-|-|-|
uuid | string | Whiteboard Unique Identifier |

In the response of this request, in the msg field, the required roomToken field can be obtained.

<details>
    <summary> ** Click to view: get the roomtoken interface in the old version ** </summary>

`POST /room/join?uuid={{uuid}}`

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* query parameter

Field | Type | Description |
--  | -- | -- |
uuid | string | Whiteboard unique identifier |

In the response of this request, in the msg field, the required roomToken field can be obtained.

New and old version interfaces are valid and consistent at the same time, only the urls are different
</details>

## Whiteboard information

### Get whiteboard list

`GET /room?offset={{offset}}&limit={{limit}}`

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* query parameter

Field | Type | Description |
--  | -- | -- |
offset | number | Find the whiteboard (counting from 1) |
limit | number | Get the number of whiteboards each time |

### Get specific whiteboard details

`GET /room/id?uuid={{uuid}}`

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* query parameter

Field | Type | Description |
--  | -- | -- |
uuid | string | Whiteboard unique identifier |

* response

```JSON
{
    "code": 200,
    "msg": {
        "id": 11600,
        "teamId": 1,
        "adminId": 1,
        "uuid": "Here is uuid",
        "name": "unnamed",
        "limit": 0,
        "current": 0,
        "enable": true,
        "playable": false,
        "videoready": false,
        "mode": null,
        "region": "cn",
        "template": null,
        "createdAt": "2018-08-20T14:57:13.000Z",
        "updatedAt": "2018-08-26T05:56:36.000Z"
    }
}
```

### Get the number of specific whiteboard pages

`GET /room/scenes/count?roomuuid={{uuid}}`

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* query parameter

Field | Type | Description |
--  | -- | -- |
roomuuid | string | Whiteboard unique identifier |

## Whiteboard management

### Disable and restore whiteboard

`POST /banRoom`

After using this API, all users will be kicked out of the room, and the room join operation cannot be performed in the client SDK. The disabled whiteboard can be played back.

* header parameter

Field | Type | Description |
--  | -- | -- |
token | string | {{token}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
ban | boolean | true to disable; false to restore |
uuid | string | Whiteboard unique identifier |
