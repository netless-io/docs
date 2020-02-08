---
id: ios-changelog
title: Version history
---

## `Whiteboard` Imprint

-Based on `White-SDK-iOS`, organize structure and open source.
Open source version, the version is iteratively increased based on the old version number.

> Migration: Change `import <White-SDK-iOS / WhiteSDK.h>` to `import <Whiteboard / Whiteboard.h>`.
## [2.5.8] - 2019-02-03
- Fix image replacement API
- Add preheater function to use the fastest resources
- Added double-speed playback API (see WhitePlayer `playbackSpeed` property and CombinePlayer` playbackSpeed` property)
## [2.5.7] - 2019-01-13
- Fixed the problem that users who [support plug-in system] cannot connect
## [2.5.6] - 2019-01-07
- Updated audio and video plugins
- Increased backward compatibility possibilities
- `Picture blocking function is temporarily unavailable and will be restored in subsequent versions`
## [2.5.5]-2019-12-31
- Optimized audio and video plugins
- Provide multiple routing options (WhiteSdkConfiguration routeBackup attribute)
## [2.5.4]-2019-12-26
- Optimized `CombinePlayer`
- Optimized audio and video plugins
## [2.5.3]-2019-12-25
- Provide the function of displaying video and audio plug-in (internal test function)
## [2.5.2]-2019-12-20
- Support dynamic ppt click animation
- Added ppt API (Displayer scalePptToFit)
## [2.5.1]-2019-12-16
- Fixed the issue that the new version `refreshViewSize` is invalid
### [2.5.0]-2019-12-14
- Added `NativeReplayer` module, which supports to use the system` AVPlayer` to play videos while playing back whiteboard content.
- Native calling code is open source
- Provide FOV Limit API

## `White-SDK-iOS` Release History
### [2.4.20]-2019-12-17
- Fixed refreshViewSize invalidation introduced in 2.4.15
### [2.4.19]-2019-12-10
- Optimize disconnection reconnection logic
- Optimized iOS audio playback
### [2.4.18]-2019-11-27
- Compatible with iOS 9
### [2.4.17]-2019-11-18
- Compatible with 32-bit CPU (pre-iPhone 5s devices)
- Fixed drawing problem caused by disableCameraTransform
### [2.4.16]-2019-11-08
- Color only supports integer
### [2.4.15]-2019-11-04
- Eraser, add the option to prohibit erasing pictures (initialize room parameter configuration)
- Fixed the problem that some incoming parameters do not take effect during SDK initialization
- Extract the methods shared by Player and Room, and migrate them into Displayer as the parent instance methods (refreshViewSize, convertToPointInWorld, addMagixEventListener, addHighFrequencyEventListener, removeMagixEventListener)
### [2.4.14]-2019-10-29
- Added refreshViewSize API for playback
- Fixed the problem of fast forward in the first frame during playback
- Fixed the problem of text truncation caused by text teaching aids using different fonts on different ends
### [2.4.13]-2019-10-28
-[2.4.12] Fixed an issue that caused iOS 9 to crash
### [2.4.12]-2019-10-25
- Added high frequency custom event API
- Optimize some synchronization issues
### [2.4.11]-2019-10-14
- Compatible with Xcode10
### [2.4.10]-2019-09-20
- Optimize text layout
- Fixed the perspective switching behavior when switching between horizontal and vertical screens
- Text function adapted to iOS 13
### [2.4.9]-2019-09-11
- Optimize weak network connection
- More options when entering live room (prohibited operation, close Bezier, etc.)
- Fixed room background color API
### [2.4.8]-2019-08-30
- Optimize screenshot effect
### [2.4.7]-2019-08-24
- Fixed the problem of invalid image replacement API during playback
- Fixed the problem that PlayerPhase status change callback is not timely during audio and video playback
- Optimize audio and video playback effect, support repeated initialization
- Optimized playback synchronization to get status API
- Fixed the type of anchor status information, when there is no anchor, the corresponding information is empty
- Fixed the problem of no callback when actively disconnecting
- Fixed two disconnection callbacks when disconnecting callbacks
- Fixed an issue where two fingers moved abnormally at the maximum zoom ratio
- Updated code comments, added more nullable comments, optimized support for swift
- Demo adds some new API call examples
### [2.4.6]-2019-08-06
- Fixed the problem that the user cannot see the screen of the host immediately after joining the whiteboard in some cases
### [2.4.4]-2019-08-02
- Optimize reconnection logic
### [2.4.1]-2019-07-31
- Fixed the problem that the full keyboard cannot pop up when editing text teaching aids again
- Add error log upload function
- Provide interface to close log upload function (open by default)
- Optimize disconnection and reconnect function
### [2.4.0]-2019-07-25
- Added API for real-time room synchronization and playback of room status
- When acquiring online members, you can simultaneously obtain the tool status of each user, as well as transparent user information
- Support for synchronizing custom global status
- Support to modify the background color of the whiteboard locally (not synchronized to other remote ends)
### [2.3.4]-2019-07-17
- Adapt to server-side dynamic PPT, dynamic ppt customers please upgrade
### [2.3.3]-2019-07-12
- Adapt server-side dynamic conversion new API
### [2.3.2]-2019-07-06
#### Add
- Support Alibaba Cloud cross-domain images
### [2.3.0]-2019-07-04
#### Add
- Added scene preview screenshot API
- Added scene cover screenshot API
- Added use of index to switch scene API

### [2.2.2]-2019-07-02
#### Fix
- Fixed the issue that playback command fails when called in swift environment
### [2.2.0]-2019-07-01
#### Add
- Add document conversion API, support font link in custom dynamic PPT during initialization
- Add dynamic PPT control API
- Added perspective control API

### [2.1.3]-2019-06-24
#### Fix
- Restore read-only API (separated into two APIs later)

### [2.1.2]-2019-06-24
#### Fix
- Compatible with older versions of static ppt playback

### [2.1.0]-2019-06-22
#### <span style = "color: red"> Compatibility changes </ span>
Compatible with previous versions of the API, but cannot interconnect with lower versions to enter the same room.
It can be interconnected with the official version of Android 2.0.0 and the official version of web 2.0.0. It cannot be interconnected with the versions starting with Android 2.0.0-beta and web 2.0.0-beta.

You can play back rooms starting from 2.0.0, but you cannot enter rooms before 2.1.0.

> Customers accessing before 2019.06.24, when upgrading to this version, please contact the SDK team to confirm that the server is pointing to the version.
> For more content, please check [2.0.0 official release] (/ blog / 2019/06/22 / release-note)
#### Fix
- Fixed the problem that the whiteboard was shifted after the keyboard disappeared when the text writing position was covered by the soft keyboard.
- Add display version function

### [2.0.5]-2019-06-16
#### Fix
- User avatar is not scaled correctly
- Text teaching tool, keyboard cannot pop up. (Developers currently need to manually manage keyboard jitter issues in WhiteboardView)

### [2.0.4]-2019-06-03
#### Add
- Added custom event support for playback
#### Fix
- Fixed 2.0.3-ppt error when multiple people enter the room

### [2.0.3-ppt]-2019-06-01
- Support connection with web terminal with dynamic ppt version
- Fix pencil jitter in 2.0.0-ppt
- Fixed replay support in 2.0.0-ppt
- Restore default user avatar support

### [2.0.0-ppt]-2019-05-19
#### Add
- Support connection with web terminal with dynamic ppt version

### [2.0.3]-2019-04-12
#### Add
- Provide custom implementation of user avatar callback parameters
- Provide delay API

### [2.0.2]-2019-04-03
#### Add
- Add user information input interface
- Add user avatar function
- Add whiteboard external coordinates to whiteboard internal coordinates

### [2.0.1]-2019-03-13
#### Add
- Provide clear screen API (package API, not new API), provide test code
- Fixed seek issue for Player

### [2.0.0]-2019-03-10
#### Compatibility changes
Major version updates, partly incompatible with past versions of the API. Unable to interconnect with version 1.0.
#### Add
- Added playback API and provides examples of playback API
- Add test case code, most APIs can refer to test cases
#### Change
- Modify the PPT page turning API and modify the sample code