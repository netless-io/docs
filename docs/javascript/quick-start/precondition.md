---
id: js-precondition
title: Precondition
---

This chapter uses pure `HTML` add `JavaScript` text access as an introduction, and uses `es6` syntax for development.
In actual development, `vue` and `react` can be escaped to `es5` after being configured.

This article describes the preparations required before using the whiteboard SDK.

## 1. Get sdkToken

Read [preparation for access](blog/begin-netless.md)，register an account，get sdk token。

## 2. Add SDK to the project

Create `index.html` with the following content:

```HTML
<!DOCTYPE html>
<html>
    <head>
        <!-- The version number can be changed according to the latest version. -->
        <link rel="stylesheet" href="https://sdk.herewhite.com/white-web-sdk/2.7.1.css">
        <script src="https://sdk.herewhite.com/white-web-sdk/2.7.1.js"></script>
        <script>
            // Subsequent implementation code
        </script>
    </head>
    <body>
        <div id="whiteboard" style="width: 100%; height: 100vh;"></div>
    </body>
</html>
```

> For the SDK integration of react project, please refer to [SDK integration](../guide/sdk.md). And add a `<body>` in index.html in the project
```<div id="whiteboard" style="width: 100%; height: 100vh;"></div>``` Elements so we can mount the whiteboard.

## Schematic diagram of the overall process

![quick_start_flow](/img/quick_start_flow.png)

## Recommended reading

1. [Real-time room](./room.md)
1. [Replay room](./player.md)