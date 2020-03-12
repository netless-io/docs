---
id: token
title: 鉴权信息
---

## sdkToken

1、定义说明
    
   - sdkToken 是注册企业的身份认证，也是使用 Netless 所有服务的前提条件。如果把我们的服务比作一个商场，那么 sdkToken 相当于入驻证明。

2、获取方式
    
   - 如果还未注册企业账户：进入<a target="_blank" href="https://console.herewhite.com">管理控制台</a> 注册账号。
   - 如果已经注册企业账户：
   ![sdkTokenGet](/img/sdkTokenGet.jpg)

3、使用注意点
    
   - 由于 sdkToken 有非常大的权限，建议将其保管在服务端。因为客户端一旦被反编译或者其他黑客手段获取到 sdkToken，可能会导致用户产生一定的费用损失。

## roomToken

1、定义说明

   - roomToken 是进入某个实时房间的凭证，映射到现实生活中可以理解为房门钥匙🗝。
   
2、获取方式

   - 调用[创建白板房间的 Api](../server/api/whiteboard-base.md) 时候可以获取。

## uuid

1、定义说明

   - uuid 是房间的唯一识别符，映射到现实生活中可以理解为房间的门牌号。
   
2、获取方式

  - 调用[创建白板房间的 Api](../server/api/whiteboard-base.md) 时候可以获取。
