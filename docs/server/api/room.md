---
id: server-room
title: 房间
---

## `POST` 创建房间

```bash
https://shunt-api.netless.link/v5/rooms
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| name | `optional` | `string` | 房间名字（最长 2048） |
| isRecord | `optional` | `boolean` | 是否开启录制 |
| limit | `optional` | `integer` | 可写人数上限​，若传 0，目前推荐设置为 0 |

### <span style="color: #5b908e">Response</span>

#### 201:Created

创建成功、返回房间描述对象。

```json
    {
        "uuid": "d07bcaf0a17911ea9d7e23232cddf42d",
        "name": "my first room",
        "teamUUID": "177",
        "isRecord": false,
        "isBan": false,
        "limit": 0,
        "createdAt": "2020-05-29T06:58:35.085Z"
    }
```

## `GET` 获取房间信息

```bash
https://shunt-api.netless.link/v5/rooms/: uuid
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token 或 Room Token（只读以上的权限） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

### <span style="color: #5b908e">Response</span>

#### 200:OK

创建成功、返回房间描述对象。

```json
    {
        "uuid": "d07bcaf0a17911ea9d7e23232cddf42d",
        "name": "my first room",
        "teamUUID": "177",
        "isRecord": false,
        "isBan": false,
        "createdAt": "2020-05-29T06:58:35.085Z",
        "limit": 0
    }
```

## `GET` 获取房间列表

```bash
https://shunt-api.netless.link/v5/rooms
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token |

#### Query Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| beginUUID | `optional` | `string` | 列表从哪个房间开始（指定 UUID） |
| limit | `optional` | `interger` | 回列表的最大长度 |

### <span style="color: #5b908e">Response</span>

#### 200:OK

创建成功、返回房间描述对象。

```json
    [
        {
            "uuid": "37875f5089c611eaa629dbb375b5adfc",
            "name": "",
            "teamUUID": "177",
            "isRecord": true,
            "isBan": false,
            "createdAt": "2020-04-29T03:05:01.716Z",
            "limit": 0
        },
        {
            "uuid": "3787fb9089c611eaa629dbb375b5adfc",
            "name": "",
            "teamUUID": "177",
            "isRecord": true,
            "isBan": false,
            "createdAt": "2020-04-29T03:05:01.717Z",
            "limit": 0
        }
    ]
```

## `PATCH` 封禁房间

```bash
https://shunt-api.netless.link/v5/rooms/:uuid
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` | SDK Token、Room Token（admin 以上的权限） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| isBan | `required` | `boolean` | 设置 true 表示封禁，设置 false 表示取消封禁 |

### <span style="color: #5b908e">Response</span>

#### 201:Created

创建成功、返回房间描述对象。

```json
    {
        "uuid": "d07bcaf0a17911ea9d7e23232cddf42d",
        "name": "my first room",
        "teamUUID": "177",
        "isRecord": false,
        "isBan": true,
        "limit": 0,
        "createdAt": "2020-05-29T06:58:35.085Z"
    }
```
