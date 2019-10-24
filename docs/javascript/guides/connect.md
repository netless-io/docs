---
id: js-connect
title: 加入房间
---

获取到房间到 uuid 和 roomToken 后就可以加入指定房间了，加入房间的 API 如下

```javascript
var whiteWebSdk = new WhiteWebSdk({
        // 图片替换 API，可以在插入图片和创建新场景背景图时，替换传入的 url。
        // 如果没有需要，请不要传入，可以减少前端资源开销
        // 使用该 API 后，服务器截屏时，会使用原始图片地址
        urlInterrupter: url => url, // 可选
        preloadDynamicPPT: false, // 可选,是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长
        deviceType: "touch", // 可选, touch or desktop , 默认会根据运行环境进行推断
    });
    return whiteWebSdk.joinRoom({
        // 这里与
        uuid: json.msg.room.uuid,
        roomToken: json.msg.roomToken,
        disableBezier: false, // 可选，禁止铅笔笔迹以贝塞尔曲线的形式展示，默认为 false
    });
```



- preloadDynamicPPT: 可选, 默认是 false。是否预先加载动态 PPT 中的图片，会显著提升用户体验，降低翻页的图片加载时长
- urlInterrupter: 图片替换 API，可以在插入图片和创建新场景背景图时，替换传入的 url
- deviceType: 可选, Touch or Desktop , 默认会根据运行环境进行推断
- handToolKey: 可选, 设置后，用户按住对应按键的同时，按住鼠标，即可移动整个白板。key 为 KeyboardEvent 中的 key 属性。推荐传入空格键(" ")。