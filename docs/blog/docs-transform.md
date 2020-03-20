---
id: docs-transform
title: How to use docs-transform
---

## Why use document conversion

The lesson plans we usually use are made with ppt or word and are usually saved in common formats such as ppt, pptx, word, pdf. These formats cannot
It is displayed directly in the netless SDK, so it needs to be converted to a more general format.

## 1. How to choose which document replacement service to use

Our service provides two conversion services, namely: document to picture & document to web. So how should customers choose which service to use?

-Select document to picture: no strong interaction is needed, courseware is just an outline for the teacher's lecture.
-Select document to web page: You need to keep the details of the sequence and animation of the content in the courseware.

## 2. What to pay attention to when using these two services

- [Document to picture considerations](/docs/server/api/server-static-conversion/#文档转图片注意事项)
- [Document to Web Precautions](/docs/server/api/server-dynamic-conversion/#文档转网页不支持的功能列表)

## 3. Design Architecture for Fast Access Test

![client_transform](/img/client_transform_en.png)

- Advantage: Start transcoding service without setting up server
- Disadvantages: Many teachers upload documents temporarily, and may need to open more concurrent (QPS) to meet the needs of fast transcoding, high cost.

Recommendation: When testing, you can use this solution to experience the transcoding effect first, and replace the mature solution before going online.

## 4. Designed architecture for mature solutions

### 4.1 Overall Architecture Diagram

![server_transform](/img/server_transform_en.png)

### 4.2 Schematic diagram of data after transcoding

![scene_manger](/img/scene_manger_en.png)

- Advantages:
  - One transcoding can be used repeatedly
  - Docking with Document Center for easy management
  - Complete transcoding in advance, eliminating temporary transcoding time
  - Save on purchasing QPS

- Cons
  - Requires server intervention
  - Transcoding data needs to be stored in its own database

Suggestion: Change this structure before going online, otherwise please purchase sufficient QPS. So as not to affect the business.
