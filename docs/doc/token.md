---
id: token
title: 应用与权限
---

## sdkToken

1、定义说明

* sdkToken 是注册企业的身份认证，也是使用 Netless 所有服务的前提条件。如果把我们的服务比作一个商场，那么 sdkToken 相当于入驻证明。

2、获取方式

* 如果还未注册企业账户：进入[管理控制台](https://console.netless.link/) 注册账号。
* 如果已经注册企业账户，请在管理控制台的个人中心打开密钥管理，右侧展示的是 sdkToken。

3、使用注意点

* 由于 sdkToken 有非常大的权限，建议将其保管在服务端。因为客户端一旦被反编译或者其他黑客手段获取到 sdkToken，可能会导致用户产生一定的费用损失。

## roomToken

1、定义说明

* roomToken 是进入某个实时房间的凭证，映射到现实生活中可以理解为房门钥匙🗝。

2、获取方式

* 调用[生成 Room Token 的服务端 API](https://developer.netless.link/docs/server/api/server-token/#post-%E7%94%9F%E6%88%90-room-token)可以获取。

## uuid

1、定义说明

* uuid 是房间的唯一识别符，映射到现实生活中可以理解为房间的门牌号。

2、获取方式

* 调用[创建房间的服务端 API](https://developer.netless.link/docs/server/api/server-room/#post-%E5%88%9B%E5%BB%BA%E6%88%BF%E9%97%B4) 可以获取。
