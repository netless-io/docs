---
id: server-introduction
title: 服务端互动白板应用
---

## 旧版本入口

[v4 旧版本 server api 入口](/docs/server-v4/overview/server-introduction)

## 基本模式

接入 White SDK 并开发一个完整的实时互动白板，你不但需要开发客户端（前端） App，还需要开发一个服务端应用。这个服务端应用，除了承载其他业务之外，还需要管理房间，以及为客户端（前端）App 分发用于鉴权的 Token。

一个完整的实时互动白板应用包括客户端（前端）和后端两个部分。两端彼此配合以实现创建房间、分发 Token、加入房间、参与互动。

### 创建房间并加入房间（泳道图）

![创建房间并加入房间（泳道图）](/img/server-graphics-1.png)

### 加入已存在的房间（泳道图）

![加入已存在的房间（泳道图）](/img/server-graphics-2.png)

## 权限管理

Netless 实时互动白板通过 Room Token 管理权限。你可以通过 Netless 提供的服务端 API 为特定房间生成不同**角色**的 Room Token。Netless 提供的角色，权限从低到高分别为 reader、writer、admin。低级别角色能做的事，高级别角色也能做，但反过来不成立。

### reader 角色

* 仅仅能通过客户端（前端）的 White SDK 以只读模式加入房间。
* 可以通过 [Netless 服务端 API](https://developer.netless.link/server/api-reference/room#huo-qu-fang-jian-xin-xi) 获取该房间信息。
* 可以通过 [Netless 服务端 API](https://developer.netless.link/server/api-reference/room#huo-qu-fang-jian-xin-xi) 获取房间内的场景信息。

### writer 角色

* 可以通过客户端（前端）的 White SDK 以可写或只读模式加入房间。
* 可以通过 [Netless 服务端 API](https://developer.netless.link/server/api-reference/scene#cha-ru-xin-chang-jing) 在房间中插入新场景。
* 可以通过 [Netless 服务端 API](https://developer.netless.link/server/api-reference/scene#chang-jing-tiao-zhuan) 在房间中切换场景。

### admin 角色

* 可以通过 [Netless 服务端 API](https://developer.netless.link/server/api-reference/room#feng-jin-fang-jian) 封禁该房间。

特别的，服务端 API 中，SDK Token 可以当作任意房间的 admin 角色的 Room Token 使用。

你需要根据 Netless 提供的 Room Token 机制，结合业务的用户系统和权限管理，设计你自己的业务逻辑。

## 不写服务端应用可以吗

虽然你可以通过把 SDK Token 写到客户端（前端），并通过前端调用 Netless 服务端 API 以实现完整的业务流程。**但是，我们非常不推荐你这么做**。

如果你决定不写服务端应用，这么以来会有两个明显的问题。

### SDK Token 泄漏

任何基于 Netless 服务端 API 的操作都要由 SDK Token 发起。SDK Token 是公司和团队的重要资产，如果被客户端（前端）持有，别人可以通过反编译、抓包等途径来窃取 SDK Token。SDK Token 一旦泄漏，会带来严重的安全问题。

### 业务逻辑层面的权限管理

Netless 云端不知道你的用户系统，也不知道你的鉴权逻辑。你的用户系统的权限管理需要一个载体，这个载体便是业务服务器。业务服务器需要把你自己设计的鉴权逻辑翻译成 Netless 能理解的 Room Token。
