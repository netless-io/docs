---
id: docs-transform
title: 如何高效使用文档转换功能
---

## 为什么要用文档转换

我们通常使用的教案都是用 ppt 或者 word 制作的，通常保存为 ppt、pptx、word、pdf 等常用格式。这些格式无法
直接在 netless 的 sdk 中展示出来，所以需要转为更加通用的格式。

## 1. 如何选择使用哪种文档装换服务

我们的服务提供了两种转化服务，分别是： 文档转图片 & 文档转网页。那么客户应该怎么选择使用哪种服务呢。

- 选择文档转图片：不需要强交互，课件只是作为老师讲课的提纲。
- 选择文档转网页：需要保留课件中内容出现的先后顺序、动画等细节。

## 2. 使用这两种服务需要注意什么问题

- [文档转图片注意事项](/docs/server/overview/server-static-conversion/#文档转图片注意事项)
- [文档转网页注意事项](/docs/server/overview/server-dynamic-conversion/#文档转网页不支持的功能列表)

## 3. 快速接入测试的设计架构

![client_transform](/img/client_transform.png)

- 优点：不用架设服务器就可以启动转码服务
- 缺点：老师很多临时上传文档，可能需要开较多的并发（QPS）才能满足快速转码的需求，费用高。

建议：测试的时候可以先用此方案体验转码效果，上线前替换成熟方案。

## 4. 成熟方案的设计架构

### 4.1 整体架构图

![server_transform](/img/server_transform.png)

### 4.2 取用转码后数据示意图

![scene_manger](/img/scene_manger.png)

- 优点：
  - 一次转码可以反复使用
  - 和文档中心对接便于管理
  - 预先转码完成，省去临时转码时间
  - 节省购买 QPS 费用

- 缺点
  - 需要服务端介入
  - 转码数据需要存储于自己的数据库

建议：正式上线前改完此架构，否则请购买充足的 QPS。以免影响业务。
