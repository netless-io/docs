---
id: optimization
title: 优化改动
---

> Netless 为了提高建连的成功率提高建连的速度，在后端 api 层做了一些改动和优化，并且在充分考虑兼容的情况下去除了一些冗余的返回字段。具体请对照下面的内容确认是否对自己的业务有影响。

 ![optimization](/img/optimization.jpg)

## 1.核心改动

如果您 `uuid` 从 `msg.room.uuid`，获取 `roomToken` 从 `msg.roomToken` 中获取，并且没有依赖其他字段，也没有创建房间后的返回值做严格的类型限制。本次升级对您的服务没有任何影响，无需改动。

如果您 `uuid` 从 `msg.hare.uuid`，获取 `roomToken` 从 `msg.roomToken` 中获取，并且没有依赖其他字段，也没有创建房间后的返回值做严格的类型限制。本次升级对您的服务没有任何影响，建议 `msg.hare.uuid` 改为 `msg.room.uuid`。

## 2.创建房间 POST /room （关键）

response JSON 结构变化：

- msg.room.id 被删除
- msg.room.teamId 类型由 number 变为 string
- msg.room.template 永远返回 null
- msg.room.appIdentifier 被删除
- msg.room.appVersion 被删除
- msg.room.akkoVersion 被删除
- msg.hare.appIdentifier 被删除
- msg.hare.appVersion 被删除
- msg.hare.akkoVersion 被删除
- msg.hare.akkoHash 被删除
- msg.hare.usersMaxCount 用 msg.room.limit 代替
- msg.hare.survivalDuration 被删除
- msg.hare.isBan 被删除

## 3.获取房间列表 GET /room

参数变化：

- offset 不再起作用，不论输入什么值，都视为 0
- 新增 beginUUID 代替 offset。beginUUID 类型为 string，为第一个 room 的 uuid。

response JSON 结构变化：

- msg.rooms[i].id 被删除
- msg.rooms[i].teamId 类型由 number 变为 string
- msg.rooms[i].template 永远返回 null
- msg.rooms[i].appIdentifier 被删除
- msg.rooms[i].appVersion 被删除
- msg.rooms[i].akkoVersion 被删除

## 3.获取房间信息 GET /room/id?uuid={{room-uuid}}

response JSON 结构变化：

- msg.id 被删除
- msg.teamId 类型由 number 变为 string
- msg.template 永远返回 null
- msg.appIdentifier 被删除
- msg.appVersion 被删除
- msg.akkoVersion 被删除
