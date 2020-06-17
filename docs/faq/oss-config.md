---
id: oss-config
title: 阿里云 oss 快速配置
---

## 一、目的说明

我们发现客户在调试过程发现可以经常报跨域错误，或者上传失败。我们这边提供一种快速可以让上传图片和文档资料可以快速使用的 oss 调试方法。**产品脱离测试期后，一定注意需要更改成安全级别更高的配置。**

## 二、配置步骤

1. 允许公共读写

    ![read-write](/img/read-write.png)

2. 跨域设置

    ![cross-domain](/img/cross-domain.png)