---
id: visual-rectangle
title: 如何用好视角跟随来让大小屏适配
---

> 老师和学生的会用各种各样不同屏幕尺寸的设备来使用白板，最怕出现的问题是由于屏幕的大小比例不一样，导致相互看到的内容不一样，那么教学就很难进行下去。这篇文章我们会详细说明一下如何通过白板的几个 api 来完成这个设置。

## 什么是视角跟随和视觉矩形

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/visual-rectangle.mp4">
</video>

- 前半段演示中，老师端的怎么移动的时候学生会跟着移动。这个概念就是**视角跟随**。
- 后半段演示中，老师端和学生端虽然比例不一样、大小不一样但是蓝框都能显示完整，因为跟随状态下，学生一定会议最大的程度显示老师端的全部内容。概念就是**视觉矩形**

## 怎么使用这些功能呢

1. 注意理解以下代码

    ``` ts
        room.setViewMode(ViewMode.Follower); // 调用者去跟随设置为 Broadcaster 的用户
        room.setViewMode(ViewMode.Broadcaster); // 调用者让其他用户跟随自己
        room.setViewMode(ViewMode.Freedom); // 调用者不跟随任何人，视角处于自由模式
        room.disableCameraTransform = true // 调用者被禁止移动视角，往往是学生
        room.disableCameraTransform = false // 调用者被允许移动视角，往往是老师
    ```

2. 推荐用法

    ``` ts
        room.setViewMode(ViewMode.Follower); // 学生跟随老师
        room.setViewMode(ViewMode.Broadcaster); // 老师设置为主播
        room.disableCameraTransform = true // 学生禁止 zoom 改变视角
        room.disableCameraTransform = false // 老师允许 zoom 改变视角
    ```

    这样学生就不会跟随老师失败，一直保证白板画面一致
