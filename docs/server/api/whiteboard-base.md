---
id: server-whiteboard-base
title: 白板基础 API
---

## 主要 API

### 创建白板

`POST /room`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* body参数

字段 | 类型 | 描述 |
--  | -- | -- |
name | string | 白板名称|
limit | number | 设置为 0 是不限制，推荐使用设置为 0：房间不限制，从业务上去限制。 | 
mode | string | **v2版本参数**；房间类型：`persistent`,`historied` |

* 房间类型：

房间有两种模式：持久化房间、可回放房间。房间模式必须在创建时指定，一旦确定，将不可修改。不同模式，特征如下：

|    模式    | 可持久化 | 可回放 |                            描述                            |
| :--------: | :------: | :----: | :--------------------------------------------------------: |
| 持久化房间（默认）- `persistent` |    ✓     |   ✘   |        即便房间将永久存在，除非调用 API 手动删除。         |
| 可回放房间 - `historied` |    ✓     |   ✓    | 同「持久化房间」。并且房间所有内容将被自动录制，以供回放。 |

* body 例子

```json
{
    "name":"白板名称",
    "limit":0,
    "mode": "persistent"
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
            "uuid": "此处为房间 uuid",
            "updatedAt": "2019-01-15T09:12:05.974Z",
            "createdAt": "2019-01-15T09:12:05.974Z"
        },
        "hare": "{\"uuid\":\"uuid\",\"teamId\":\"1\",\"mode\":\"persistent\",\"region\":\"cn\",\"isBan\":false,\"beginTimestamp\":1547543526200,\"endTimestamp\":1547543526200,\"endFrameId\":0,\"usersMaxCount\":100,\"survivalDuration\":30000,\"chunkFramesCount\":700,\"snapshotIdInterval\":80}",
        "roomToken": "此处为房间 roomToken",
        "code": 201
    }
}
```

### 获取特定白板 room Token

`GET /room/{{uuid}}/roomtoken`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* query 参数

字段 | 类型 | 描述 |
--  | -- | -- |
uuid | string | 白板唯一标识符 |

该请求的 response 中，在 `msg` 字段中，可以获取到需要的 `roomToken` 字段。

<details>
<summary>**点击查看：旧版获取 roomtoken 接口**</summary>
`POST /room/join?uuid={{uuid}}`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* query 参数

字段 | 类型 | 描述 |
--  | -- | -- |
uuid | string | 白板唯一标识符 |

该请求的 response 中，在 `msg` 字段中，可以获取到需要的 `roomToken` 字段。

新旧版本接口同时有效且实现一致，仅 url 不同
</details>

## 白板信息

### 获取白板列表

`GET /room?offset={{offset}}&limit={{limit}}`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* query 参数

字段 | 类型 | 描述 |
--  | -- | -- |
offset | number | 第几块白板开始查找(从1开始计数) |
limit | number | 每次获取白板的个数 |


### 获取特定白板详细信息

`GET /room/id?uuid={{uuid}}`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* query 参数

字段 | 类型 | 描述 |
--  | -- | -- |
uuid | string | 白板唯一标识符 |

* response

```JSON
{
    "code": 200,
    "msg": {
        "id": 11600,
        "teamId": 1,
        "adminId": 1,
        "uuid": "此处为uuid",
        "name": "未命名",
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

### 获取特定白板页数

`GET /room/scenes/count?roomuuid={{uuid}}`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* query 参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomuuid | string | 白板唯一标识符 |

## 白板管理

### 禁用和恢复白板

`POST /banRoom`

使用该 API后，会将所有用户从房间中踢出，并无法在客户端 sdk 中执行加入房间操作。被禁用的白板，可以进行回放操作。

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
token | string | {{token}}|

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
ban | boolean | true为禁用；false为恢复 |
uuid | string | 白板唯一标识符 |