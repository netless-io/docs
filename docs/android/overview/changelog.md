---
id: android-changelog
title: 版本历史
---

>[最新版本列表——发版自动更新](https://jitpack.io/#duty-os/white-sdk-android)
## [2.10.0] - 2020-10-10
- 同步更新 web sdk 至 2.10.1 版本（无断代更新内容）
- 支持显示web 端通过 iframe 插件（`@netless/iframe-bridge`）插入的 iframe 插件，类似音视频插件，native 无需进行修改，只需要更新至 2.10.0 版本即可
## [2.9.21] - 2020-09-23
- 同步 web sdk 至 2.9.17
- RoomCallbacks 移除 `onBeingAbleToCommitChange`，新增 `onCanUndoStepsUpdate` `onCanRedoStepsUpdate`，具体见源码注释
- 更新头像教具显示组件，修复没有传入 userPayload 时，无法显示的问题
## [2.9.20] - 2020-09-15
- 切换头像显示组件UI，web 端可以切换至`@netless/cursor-tool`即可保持一致，新组件支持`cursorName`，`avatar`字段。
## [2.9.19] - 2020-09-10
- 同步 web sdk 至 2.9.16
## [2.9.18] - 2020-09-03
- 同步 web sdk 至 2.9.15
## [2.9.17] - 2020-08-19
- 同步 web sdk 至 2.9.14
- 支持应用层接管 ppt 音视频播放（具体见 AudioMixerBridge 以及 demo 仓库中 demo-rtc 分支）
## [2.9.16] - 2020-07-31
- 修复 Android 7.1 至 Android 8.1 下，无法显示笔画的问题（使用 svg 兼容模式）
- 修复 room.phase 状态错误，必须使用 `room.getPhase` 异步 API 才能获取正确状态的问题
## [2.9.14] - 2020-07-22
- 同步 web SDK 至 2.9.12
- 修复以下情况时，webView 中 SDK 初始化/启动失败，没有任何通知的问题。回调通知在 `CommonCallbacks`新增`sdkSetupFail:`方法中；更多具体内容，见源码注释。
    1. 当传入非法 AppIdentifier
    2. 当获取用户配置信息失败时（例如无网络）
- 修复 webView 中 SDK 初始化失败，导致加入房间，回放房间 API 一直没有回调的问题。
- 弃用`UrlInterrupter`拦截 API，统一迁入`CommonCallbacks`(仍支持)
- `WhiteSdk`新增`WhiteSdk(WhiteboardView bridge, Context context, WhiteSdkConfiguration whiteSdkConfiguration, CommonCallbacks commonCallbacks)`建议使用该初始化方法，直接配置 `CommonCallbacks`，否则可能遗漏部分回调。

## [2.9.13] - 2020-07-16
- 同步 web SDK 至 2.9.11
- 增加动态 ppt 音视频播放暂停通知
- 默认切换至 canvas 渲染引擎，性能兼容性更好

## [2.9.12] - 2020-07-07
- 同步 web SDK 至 2.9.10
- 优化截图 API

## [2.9.11] - 2020-07-07
- 同步 web SDK 至 2.9.9
- 修复 native 端动态 PPT 翻页后媒体仍然在播放的 bug

## [2.9.10] - 2020-07-03
- 优化音视频插件

## [2.9.9] - 2020-07-02
- 优化音视频插件，修复 native 进入房间时，正在播放的音视频进度不一致

## [2.9.8] - 2020-07-01
- 修复动态 PPT 字体重复下载导致的内存占用过多的问题

## [2.9.7] - 2020-06-30
- 修复 CameraBound 初始化时，minScale，maxScale 配置错误问题

## [2.9.6] - 2020-06-30
- 同步更新 white-web-sdk 至 2.9.7
- 提高 canvas 引擎兼容性

## [2.9.5] - 2020-06-30
- 修复在 WebView Debug 模式下时，动态 ppt 播放音视频崩溃的问题

## [2.9.4] - 2020-06-24
- 同步更新 white-web-sdk 至 2.9.4 版本
- 修复`ContentModeConfig`中`scale`为 0 时，实际为 1 的问题

## [2.9.3] - 2020-06-23
- 同步更新 white-web-sdk 至 2.9.3 版本
- 新增`抓手`，`激光笔`教（见`com.herewhite.sdk.domain.Appliance`）
- 橡皮教具`disableEraseImage`属性，支持中途切换（见Room `disableEraseImage:`API）
- Room 新增`撤销`，`取消撤销`（开启该功能前，请先阅读`disableSerialization`介绍）
- Room 提供`复制`，`粘贴`，`副本`，`删除` API，可以对选中的内容，执行上述操作（见`Room`执行操作 API 部分）
- RoomParams 弃用`disableOperations`，新增`disableCameraTransform` API，与`disableDeviceInputs`搭配，可以起到同样效果。
## [2.9.2] - 2020-06-13

- 修复 userPayload 显示问题，保持与 web 端一致的显示逻辑。

## [2.9.0] - 2020-06-10

- 优化底层渲染系统，画笔教具渲染引擎，默认为`Canvas`，`svg`为兼容模式。
- `MemberState`新增`直线`，`箭头`教具，具体可以查看`com.herewhite.sdk.domain.Appliance`文件。
- `PlayerConfiguration`的`audioUrl`属性更改为`mediaURL`，效果不变。
- `WhiteSdkConfiguration`：
    1. 删除`zoomMinScale`,`zoomMaxScale`属性。限制视野需求，请阅读`WhiteRoomConfig`,`WhiterPlayerConfig`以及`WhiteCameraBound`相关类和 API。
    2. 删除`sdkStrategyConfig`属性内容。
    3. `debug`属性更改为`log`属性，效果不变。
    4. `hasUrlInterrupterAPI`字段，更改为`enableInterrupterAPI`。setter 与 getter 更改为`setEnableInterrupterAPI`与`isEnableInterrupterAPI`。
    5. 新增`disableDeviceInputs`配置。
- 移除`com.herewhite.sdk.Utils.PreFetcher`，SDK 采用更智能的链路选择，`PreFetcher`类的预热结果对 SDK 不再有效果。
- `WhiteCameraBound`增加初始化方法，方便使用`zoomMinScale`，`zoomMaxScale`用户的用户进行迁移。
- `ImageInformation`类，预埋`locked`字段。
- 移除 room 的`setViewSize(int width, int height)`方法

## [2.8.1] - 2020-05-22

- 修复`预热器`数据造成的 sdk 连接失败问题。2.8.0 开始，不再需要预热功能。

## [2.8.0] - 2020-05-14

- <span style="color:red;">不兼容改动</span>：SDK 初始化参数，新增必填项：`APP identitier`，获取方式，请查看 [APP identifier](/docs/faq/app-identifier/)一栏
- 开放画笔渲染引擎选项，新增 canvas 渲染模式（需要主动选择）
- 修复`isWritable=false`用户无法跟随新主播的问题

## [2.7.7] - 2020-04-29

- 加入房间，回放 API，兼容重复调用（房间，回放实例会以最后一次成功回调为准）

## [2.7.6] - 2020-04-21

- 优化 PlayerSyncManger 线程调用

## [2.7.5] - 2020-04-16

- 优化音频插件显示
- 优化动态 ppt 音频播放问题

## [2.7.4] - 2020-04-13

- 优化音频插件显示

## [2.7.3] - 2020-04-12

- 优化音视频
- 增加获取房间内所有场景的 API（见 Displayer getEntireScenes)

## [2.7.2] - 2020-03-25

- 优化预热器连接速度

## [2.7.1] - 2020-03-22

- 优化了建连速度
- 修复了 canvas 模式下若干显示错误
- 兼容非音视频系统用户，但鉴权速度较慢

## [2.7.0] - 2020-03-18

- 优化底层显示
- 优化动态 ppt
- 注意：该版本目前有一定兼容问题，接入自定义音视频插件系统的用户，可以升级（2020 年开始接入的用户，均为该版本）；未接入音视频插件的用户请勿升级。如不清楚版本，可以询问服务团队。

## [2.6.5] - 2020-03-12

- 部分 promise API 允许传入 null
- 修复加入房间时，可能出现的空指针问题

## [2.6.4] - 2020-03-03

- 优化只读模式
- 优化动态 ppt 音视频
- 新增`getScenePathType`API（见 Displayer `getScenePathType:`方法）
- 部分类，增加带参数初始化方法
- 恢复支持 Android 4.4 支持
- 优化只读模式

## [2.6.3] - 2020-02-24

- 优化连接性，以及日志上报逻辑

## [2.6.2] - 2020-02-23

- 优化只读模式
- 修复回放时，后半段时间回调`step`失效的问题
- 修复`throwError`回调丢失信息的问题

## [2.6.1] - 2020-02-20

- 添加回放时间进度回调频率 API（详情见 PlayerConfiguration`step`属性）
- 添加重连等待时长 API（详见 RoomParams`timeout`属性）
- 添加`writable`只读模式（详情见 RoomParams`writable`属性，以及 Room `setWritable:`方法）
- 修复部分情况下，清屏 API 失效的情况

## [2.6.0] - 2020-02-18

- 优化加入房间API，修复部分情况下，加入房间不回调的问题

## [2.5.7] - 2020-02-11

- 修复显示用户头像时，教具显示不正确问题

## [2.5.4] - 2020-02-04

- 修复 VIVO x7 Android 5.0 下的闪退问题
- 初始化 SDK 时，添加服务器配置信息接口

## [2.5.3] - 2020-02-04

- 修复图片拦截 API
- 增加预热器功能，提前选取就进资源
- 增加白板倍率播放 API

## [2.5.1] - 2020-01-13

- 修复【支持插件系统】的用户，出现无法连接的问题

## [2.5.0] - 2020-01-07

- 优化音视频插件
- 增加向后兼容可能性
- `图片拦截功能暂时不可用，将在后续版本恢复`

## [2.4.28] - 2019-12-31

- 更新音视频插件
- 修复部分
- 修复带参数的 `scalePptToFit` 无效问题

## [2.4.27] - 2019-12-26

- 添加音视频插件支持

## [2.4.26] - 2019-12-26

- 修复 `PlayerSyncManager`

## [2.4.24] - 2019-12-25

- 提供源码以及注释内容
- 修复 `PlayerSyncManager` 问题

## [2.4.23] - 2019-12-23

- 增加 CombinePlayer 模块，提供 `PlayerSyncManager` 同步客户端音视频播放器与白板回放播放状态。
  - 具体使用，见回放文档。
  - 具体见[Android-Demo](./android-open-source)提供的 NativeMediaPlayer 类。

## [2.4.22] - 2019-12-20

- 优化重连逻辑
- 支持动态 ppt 点击动画
- 提供 ppt 铺满屏幕 API `scalePptToFit`

## [2.4.21] - 2019-11-24

- 修复 Android 4.4 支持问题

## [2.4.20] - 2019-11-19

- 修复 Android 部分文字阶段问题

## [2.4.19] - 2019-11-13

- 修复 disableCameraTransform 导致的绘制问题

## [2.4.18] - 2019-11-05

- 橡皮擦教具，增加禁止擦除图片选项（初始化房间参数配置）

## [2.4.17] - 2019-11-04

- 修复 SDK 初始化时，部分传入参数不生效的问题
- 提取 Player 与 Room 共有方法，迁移进 Displayer 作为父类实例方法（refreshViewSize, convertToPointInWorld, addMagixEventListener, addHighFrequencyEventListener, removeMagixEventListener）

## [2.4.16] - 2019-10-29

- 回放增加 refreshViewSize API
- 修复了回放时首帧存在快进的问题
- 修复了文字教具在不同端使用不同字体时，造成的文字截断问题

## [2.4.15] - 2019-10-25

- 增加高频自定义事件 API
- 优化部分同步问题

## [2.4.14] - 2019-09-20

- 优化屏幕大小切换时视野处理逻辑

## [2.4.13] - 2019-09-09

- 恢复图片替换 API
- 切换场景 API，提供成功失败回调
- 移除异步 API Deprecate 警告
- 设置场景路径 API，增加成功失败回调

## [2.4.11] - 2019-08-30

- 优化 Android 4.4 显示
- 优化截图效果
- room 中 ObserverId，表示当前用户在白板内部的 id

## [2.4.10] - 2019-08-25

- 兼容 Android 4.4
- 修复回放时，图片替换 API 失效问题
- 修复带音视频回放时，PlayerPhase 状态变化回调不及时问题
- 优化带音视频回放效果，支持重复初始化
- 优化回放同步获取状态 API
- 修正主播状态信息类型，无主播时，对应信息为空
- 修复主动断连时，无回调问题
- 修复处于最大缩放比例时，双指移动异常的问题

## [2.4.8] - 2019-08-16

- 支持自定义全局状态
- 房间成员列表（RoomMember）增加用户信息，用户教具状态内容
- 视角状态（BroadcastState），增加主播用户信息；修正无主播时，主播id 为 0 的问题
- 修正 Scene 类中，`component` 字段类型错误
- 修正白板类名，并提供向前兼容
- 移除部分无效类与字段

## [2.4.6] - 2019-08-06

- 修复部分情况下，用户加入白板，无法立刻看到主播端画面的问题

## [2.4.4] - 2019-08-02

- 优化重连逻辑

## [2.4.3] - 2019-08-01

- 修复视角锁定 API

## [2.4.2] - 2019-08-01

- 增加错误日志上传功能
- 提供关闭日志上传功能接口（默认打开）

## [2.4.1] - 2019-07-25

- 扩大橡皮擦响应范围
- 优化重连逻辑
- 增加白板本地背景色支持
- 优化断线重连功能

## [2.4.0] - 2019-07-18

- 获取状态 API，增加同步接口

## [2.3.5] - 2019-07-17

- 适配服务器端动态 PPT，动态 ppt 客户请升级

## [2.3.4] - 2019-07-12

- 适配服务器端动态转换新 API

## [2.3.2] - 2019-07-09

- 更新视角移动，视觉矩形移动 API参数类型
- 优化动态 PPT

## [2.3.0] - 2019-07-04

- 增加截图 API
- 增加根据 index 切换场景 API

## [2.2.1] - 2019-07-04

- 修复 PPT 转换工具初始化错误

## [2.2.0] - 2019-07-02

- 添加 PPT 转换支持
- 添加动态 PPT 控制API
- 添加视角移动，视角调整 API

## [2.0.4] - 2019-06-24

- 恢复只读 API（后续将拆分为两个 API）

## [2.0.3] - 2019-06-24

- 兼容旧版本静态 ppt 回放

## [2.0.0] - 2019-06-23

### 兼容性变化

与之前版本 API 兼容，但是无法与低版本互连，进入同一房间。
可以与 iOS 2.1.0，web 2.0.0 正式版互连，无法与 iOS 2.1.0 以下版本，以及 web 2.0.0-beta 开头的版本互连。

>2019.06.24 前接入的客户，在升级至该版本时，请联系 SDK 团队，确认服务器指向版本。  
>更多内容，请查看 [2.0.0正式版发布](/docs/android/guides/android-v2migration)
