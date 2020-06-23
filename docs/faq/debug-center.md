---
id: debug-center
title: 在线 debug
---

## 介绍

在接入白板过程中，可能会出现各种意外情况，为了方便开发者自己能够低成本调试房间连通性和API 操作等问题。  
我们在 [console](https://console.netless.link/) 中，提供在线调试功能。
在控制台中，点击 <svg viewBox="64 64 896 896" class="" data-icon="code" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 0 0 308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 0 0-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path></svg> 

示意图：

![debug](/img/debug.png)

## 进入调试

输入想要调试房间的 uuid 和 roomToken，进入特定房间。
同时可以在 dev tools 中进行简单的调试。（网页会暴露实时房间的 room 对象）。
