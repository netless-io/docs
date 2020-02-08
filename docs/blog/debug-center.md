---
id: blog-debug-center
title: Only debug
---

## 介绍

During the process of connecting to the whiteboard, various unexpected situations may occur. In order to facilitate developers to debug the problems such as room connectivity and API operation at low cost.
We provide online debugging in [console](https://console.herewhite.com/).
In the console, click <svg viewBox="64 64 896 896" class="" data-icon="code" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 0 0 308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 0 0-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path></svg> 

schematic diagram:

![debug](/img/debug.png)

## Enter debugging

Enter the uuid and roomToken of the room you want to debug to enter a specific room.
At the same time, simple debugging can be performed in dev tools. (The web page exposes the room object of the live room).