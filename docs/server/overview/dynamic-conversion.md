---
id: server-dynamic-conversion
title: 文档转网页（动态文档转换）
---

动态文档转换是指将 pptx 格式的文件，转换成网页的服务。

## 文档转网页不支持的功能列表

目前已知无法支持的 pptx 功能如下：

1. 不支持 wps 文件，且 wps 转换为 pptx 后的文件不保证能成功解析
2. 不支持渐变色渲染
3. 不支持文字行末标点超出文本框（会导致自动换行）
4. 不支持艺术字
5. 不支持柱状图之类的图表
6. 不支持通过 SmartArt 功能创建的图形
7. 不支持页面切换时的过渡特效
8. 不支持文字动画及行动画（即文本框中每一行有一个动画）
9. 不支持 emf 或者 wmf 格式的图片
10. 不支持大多数动画特效比如溶解，棋盘等，目前只有淡入淡出特效
11. 如果转换结果字体缺失可以使用 sdk 中的自定义字体功能或者联系我们
12. 不支持文字的纵向排版
13. 不支持视频的裁剪功能
14. 不支持隐藏页的转换

文档转网页正在进行研发迭代，以上列表我们会持续更新

>相对于静态文档转换，动态文档转换，保留了 ppt 文件中的顺序动画，提供切换控制功能。
>动态`ppt`基于`Microsoft Office`规范，不能保证WPS文件能够正确解析。

## 准备工作

### 1. 根据 [配置云存储](/docs/doc/add-driver) 文章，在 [console](https://console.netless.link) 中配置云存储

### 2. 在管理控制台上开启动态文档服务

1. 进入 [console](https://console.netless.link)，点击左侧列表中的，进入应用管理页面。

2. 找到对应的项目，点击配置按钮开通。

## 效果展示

<video style="width: 100%" loop="loop" autoplay="autoplay" id="video">
  <source id="mp4" src="https://white-sdk.oss-cn-beijing.aliyuncs.com/video/netless_pptx.mp4">
</video>
