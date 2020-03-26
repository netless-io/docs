---
id: add-driver
title: Add storage driver
---

## 1. Purpose

> We refer to the storage services of the three parties as the Storage Driver. Below we will explain in detail how to configure the Storage Driver.

When using functions such as netless whiteboard or pptx to web page, it will inevitably involve the synchronization of various rich media resources. Facing this business scenario, our strategy is to transfer data to cloud storage, and then the cloud storage address Sync to all users in the room. So we have to introduce Drive for cloud storage to meet this scenario.

After the user specifies the Storage Driver, the related resources are stored in the storage service associated with the Storage Driver. The user can currently customize the storage driver of Alibaba Cloud or Qiniu Cloud.

Of course, Netless also provides a default Storage Driver for users to use. After using this Storage Driver, the related resources will be stored by Netless.

## 2. the method of adding Storage Drive

After the user logs in to the netless [console](https://console.netless.link), see the figure below
![Personal menu entry](/img/add-driver-1.jpg)

Then click the "New Cloud Storage" button in the upper right corner and select the required cloud storage to add
![driver management page](/img/add-driver-2.jpg)

The created Storage Driver can be managed on this page, and the buttons on the top right of the card can be used to edit or delete.
![driver editor](/img/add-driver-3.jpg)
