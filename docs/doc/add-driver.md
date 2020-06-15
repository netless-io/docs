---
id: add-driver
title: 配置云存储
---

## 一、目的说明

> 我们将三方的存储服务称为 Storage Driver，下面我们要详细说明的是如何配置 Storage Driver.

在使用 netless 的白板或者 pptx 转网页等功能的时候难免会涉及到各种富媒体资源的同步，面对这种业务场景，我们采取的策略是将数据传到云存储，然后将云存储的地址同步给房间中的所有用户。因此我们要引入云存储的 Drive 来满足这个场景。

当用户指定了 Storage Driver 后，相关资源会存储到 Storage Driver 关联的存储服务中，用户目前可以自定义配置阿里云或者七牛云的 Storage Driver。

当然 netless 也提供了一个默认的 Storage Driver 供用户使用，当使用了这个 Storage Driver 后，相关的资源将由 netless 代为保管。

>目前，动态 ppt 不支持使用第三方云存储，只能存在 netless 默认的 storage driver 中。第三方云存储支持，正在开发中。

## 二、添加 Storage Drive 的方法

在用户登录进入 [netless后台登陆界面](https://console.netless.link)后，可以左侧菜单栏的“个人中心”里找到入口
![个人菜单入口](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/driverEnter.png?x-oss-process=image/resize,w_350)

之后点击右上角的“新建云存储”按钮，选择需要的云存储进行添加即可
![driver 管理页面](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/addDriver.png)

已经创建好的 Storage Driver 可以在这个页面进行管理，通过卡片右上的按钮可以进行编辑或删除等操作
![driver 编辑](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/storageManage.png)

> 请注意，当用户选择使用七牛云的存储服务时，需要额外配置一个外链域名的字段，否则 netless 将无法访问该存储服务内的资源.

七牛外链字段获取位置如图：

![qiniu url](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/qiniuStorageUrl.png)

对应字段如图：

![qiniu url](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/qiniuStorage.png?x-oss-process=image/resize,w_400)

