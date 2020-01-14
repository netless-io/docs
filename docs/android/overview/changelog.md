---
id: android-changelog
title: Version history
---

>[The latest version list -> automatic release updates](https://jitpack.io/#duty-os/white-sdk-android)
### [2.4.28] - 2019-12-31
- Updated audio and video plugins
- Repair section
- Fixed `scalePptToFit` with parameter not working
### [2.4.27] - 2019-12-26
- Add audio and video plugin support
### [2.4.26] - 2019-12-26
- Fixed `PlayerSyncManager`
### [2.4.24] - 2019-12-25
- Provide source code and comment content
- Fixed `PlayerSyncManager` problem
### [2.4.23] - 2019-12-23
- Added CombinePlayer module to provide `PlayerSyncManager` to synchronize client and video player and whiteboard playback playback status.
    * For specific use, see playback documentation.
    * For details, see the NativeMediaPlayer class provided by [Android-Demo](./android-open-source).
### [2.4.22] - 2019-12-20
- Optimize reconnection logic
- Support dynamic ppt click animation
- Provide ppt screen-to-screen API `scalePptToFit`
### [2.4.21] - 2019-11-24
- Fix Android 4.4 support issues
### [2.4.20] - 2019-11-19
- Fix some text stage issues in Android
### [2.4.19] - 2019-11-13
- Fix drawing problem caused by disableCameraTransform
### [2.4.18] - 2019-11-05
- Eraser, add the option of forbidden to erase pictures
### [2.4.17] - 2019-11-04
- Fixed the problem that some incoming parameters do not take effect during SDK initialization
- Extract the methods shared by Player and Room, and migrate them into Displayer as the parent instance method（refreshViewSize, convertToPointInWorld, addMagixEventListener, addHighFrequencyEventListener, removeMagixEventListener）
### [2.4.16] - 2019-10-29
- Playback added refreshViewSize API
- Fixed an issue where the first frame was fast forwarded during playback
- Fixed text truncation caused by text teaching aids using different fonts on different ends
### [2.4.15] - 2019-10-25
- Add high frequency custom event API
- Optimize some synchronization problems
## [2.4.14] - 2019-09-20
- Optimize the vision processing logic when screen size is switched
## [2.4.13] - 2019-09-09
- Restore image replacement API
- Switch scene API, provide success and failure callback
- Remove asynchronous API Deprecate warning
- Set scene path API, add success and failure callbacks
## [2.4.11] - 2019-08-30
- Optimized Android 4.4 display
- Optimize screenshot effect
- ObserverId in room, which represents the id of the current user inside the whiteboard
## [2.4.10] - 2019-08-25
- Compatible with Android 4.4
- Fixed the problem of invalid image replacement API during playback
- Fixed the problem that PlayerPhase status change callback is not timely during audio and video playback
- Optimize audio and video playback effect, support repeated initialization
- Optimized playback synchronization to get status API
- Fixed the type of anchor status information, when there is no anchor, the corresponding information is empty
- Fixed the problem of no callback when actively disconnecting
- Fixed an issue where two fingers moved abnormally at the maximum zoom ratio
## [2.4.8] - 2019-08-16
- Support custom global status
- Room member list (RoomMember) adds user information, user tool status content
- Viewing angle (BroadcastState), increase the information of the anchor user; fix the issue that the anchor id is 0 when there is no anchor
- Fixed `component` field type error in Scene class
- Fixed whiteboard class names and provide forward compatibility
- Remove some invalid classes and fields
## [2.4.6] - 2019-08-06
- Fixed the problem that the user cannot see the screen of the host immediately after joining the whiteboard in some cases
### [2.4.4] - 2019-08-02
- Optimize reconnection logic
### [2.4.3] - 2019-08-01
- Fix perspective lock API
### [2.4.2] - 2019-08-01
- Add error log upload function
- Provide interface to close log upload function (open by default)
### [2.4.1] - 2019-07-25
- Expanded eraser response range
- Optimize reconnection logic
- Added local background color support for whiteboard
- Optimize disconnection and reconnect function
### [2.4.0] - 2019-07-18
- Get status API, add synchronous interface
### [2.3.5] - 2019-07-17
- Adapt to server-side dynamic PPT, dynamic ppt customers please upgrade

### [2.3.4] - 2019-07-12
- Adapt server-side dynamic conversion new API

### [2.3.2] - 2019-07-09
- Updated the view movement, visual rectangle movement API parameter types
- Optimize dynamic PPT

### [2.3.0] - 2019-07-04
- Added screenshot API
- Added API to switch scenes based on index

### [2.2.1] - 2019-07-04
- Fix PPT conversion tool initialization error

### [2.2.0] - 2019-07-02
- Add PPT conversion support
- Add dynamic PPT control API
- Add perspective movement, perspective adjustment API

### [2.0.4] - 2019-06-24
- Restore read-only API (separated into two APIs later)
### [2.0.3] - 2019-06-24
- Compatible with older versions of static ppt playback

### [2.0.0] - 2019-06-23

#### Compatibility changes
Compatible with previous versions of the API, but cannot interconnect with lower versions to enter the same room.
It can be interconnected with the official version of iOS 2.1.0, web 2.0.0, and cannot be interconnected with versions lower than iOS 2.1.0, and versions starting with web 2.0.0-beta.

> For customers connected before 2019.06.24, when upgrading to this version, please contact the SDK team to confirm that the server is pointing to the version.
> For more details, please see [2.0.0 official release](/docs/android/guides/android-v2migration)