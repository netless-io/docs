---
id: server-introduction
title: 简要说明
sidebar_label: 简要说明
---

## 支持业务

sdk 客户端，目前只有对白板进行内容操作的 API，没有对白板房间进行管理的 API。
开发者需要通过 sdk token 与白板

sdk 服务器进行交互，执行创建房间，获取房间一系列信息，以及房间管理操作。 

## 业务服务器和 White 的关系
<div id="eiwrfi" data-type="puml" data-display="block" data-align="left" data-src="https://cdn.nlark.com/__puml/c2e1819cdafcd7c0fa9130187da08aee.svg" data-width="656" data-height="300" data-text="%40startuml%0A%0Aautonumber%0A%0A%E5%AE%A2%E6%88%B7%E4%BA%A7%E5%93%81%20-%3E%20%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%9C%8D%E5%8A%A1%3A%20%E5%88%9B%E5%BB%BA%E7%99%BD%E6%9D%BF%0A%0A%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%9C%8D%E5%8A%A1%20-%3E%20White%E4%BA%91%3A%20%E5%88%9B%E5%BB%BA%E7%99%BD%E6%9D%BF%EF%BC%88createRoom%EF%BC%89%0A%0AWhite%E4%BA%91%20--%3E%20%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%9C%8D%E5%8A%A1%3A%20%E8%BF%94%E5%9B%9ERoomToken%E5%92%8Cuuid%0A%0A%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%9C%8D%E5%8A%A1%20-%3E%20%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%95%B0%E6%8D%AE%E5%BA%93%3A%20%E8%AE%B0%E5%BD%95%E7%99%BD%E6%9D%BFuuid%0A%0A%E5%AE%A2%E6%88%B7%E4%B8%9A%E5%8A%A1%E6%9C%8D%E5%8A%A1%20--%3E%20%E5%AE%A2%E6%88%B7%E4%BA%A7%E5%93%81%3A%20%E8%BF%94%E5%9B%9ERoomToken%E5%92%8Cuuid%0A%0A%E5%AE%A2%E6%88%B7%E4%BA%A7%E5%93%81%20-%3E%20WhiteSDK%3A%20%E5%BB%BA%E7%AB%8B%E8%BF%9E%E6%8E%A5%EF%BC%88joinRoom%EF%BC%89%0A%0AWhiteSDK%20-%3E%20White%E4%BA%91%3A%20%E5%BB%BA%E7%AB%8B%E8%BF%9E%E6%8E%A5%0A%0A%40enduml"><img src="https://sdk.herewhite.com/images/workflow.svg" width="656"/></div>


## 结合 RTC 服务
RTC 供应商一般也会有房间（room）或频道（channel）的概念。White 的一块白板内部称之为 room，room 的 uuid 属性全局唯一，用户可以把 RTC 的房间或频道和 White 的 room 一一对应起来。