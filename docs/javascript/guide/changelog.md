---
id: js-changelog
title: Version history
---

## 2.7.1 - 2020-03-21

> - Optimized the connection speed
> - Dynamic PPT fixes incorrect line breaks in iOS
> - Repair

## 2.7.0-2020-03-17

> - Optimized writing performance in canvas mode
> - Fixed the problem that Safari cannot render images in canvas mode
> - Fixed the problem that some users cannot hear sound when playing dynamic PPT with animated audio
> - Fixed an issue where dynamic PPT conversion fails when the audio is an empty string
> - Fixed flickering issue during dynamic PPT audio playback
> - Fixed the problem that the cursor is still the default cursor when entering the room

## 2.6.4-2020-03-02

> - Fixed the problem that the text does not specify the font size
> - Fixed issue with sidebar playing audio
> - Fixed replay issue when media switching pages
> - Fixed the issue that the media in the group cannot be played

## 2.6.3-2020-02-23

> - Added: `` rejectWhenReadonlyErrorLevel ''
> - Fixed the issue that the room cannot be accessed in read-only mode after setting ``disableBezier: true``

## 2.6.2-2020-02-22

> - Fixed the bug that when the room has an anchor, the size of the whiteboard is changed and the visual rectangle cannot be tracked

## 2.6.1-2020-02-21

> - Fixed: Modifying room status in custom event callback will report an error
> - Fixed several issues with viewing angles in read-only mode
> - Added cursor adapter onMovedCursor callback method

## 2.6.0-2020-02-18

> - Added Canvas rendering mode (beta version, disabled by default)
> - Added read-only mode for live rooms
> - Fixed several bugs

## 2.5.10-2020-02-13

> - Added callback for dynamic PPT video play / stop events

## 2.5.9-2020-02-10

> - Optimize the compatibility of dynamic PPT for earlier versions of iOS
> - Fixed several bugs

## 2.5.8-2020-02-03

> - Fixed a bug that caused a large number of invalid requests when the client's sudden network quality deteriorated suddenly.
> - Fixed a bug where * .d.ts files were not available
> - Fixed a bug where closing WebSocket may report an error in the console

## 2.5.7-2020-01-22

> - When the client enters an abnormality due to a network problem, it will automatically reconnect to restore the normal state.

## 2.5.6-2020-01-18

> - Fixed: Before onLoadFirstFrame was called back, some methods of Player could not be called and some members could not be modified

## 2.5.5-2020-01-17

> - Added DNS warm-up function
> - Added the function of player double speed playback
> - Fixed `` urlInterrupter '' not working
> - Fixed some abnormal behavior of the gripper tool

## 2.5.4 - 2020-01-11

> - New: API to get all scenes of a room
> - New: API to determine if a specific address is a scene or a scene group
> - Fix: After typing beyond the screen boundary, the viewing angle will be wrong

## 2.3.19 - 2019-12-26

> - Fixed the problem that some text could not be found when rendering

## 2.3.18 - 2019-12-20

> - Support mobile ppt click animation
> - Add proportional scaling ppt to full screen API (scalePptToFit)

## 2.3.17 - 2019-12-07

> - Dynamic ppt support hyperlink jump

## 2.3.16 - 2019-12-03

> - Fixed several bugs

## 2.3.15 - 2019-11-18

> - Dynamic ppt supports click animation

## 2.3.12 - 2019-11-02

> - Optimized the loading process of dynamic PPT and optimized rendering performance
> - Can Eraser Erasing Pictures

## 2.3.11 - 2019-10-28

> - Fixed an issue where the first frame was fast forwarded during playback
> - Fixed text truncation caused by text teaching aids using different fonts on different ends
> - Fixed the problem of misaligned graphics editing points on Surface devices
> - Optimized the scene preview API to support situations where width and height are not passed in

## 2.3.9 - 2019-10-21

> - Dynamic PPT fixes some text typesetting bugs

## 2.3.6 - 2019-09-30

> - Dynamic PPT optimizes rendering engine to improve rendering reduction

## 2.3.5 - 2019-09-24

> - Fixed style issues with dynamic PPTs
> - Optimized the performance of dynamic PPT
> - Added gripper tool
> - Optimized performance

## 2.3.4 - 2019-09-20

> - Optimized dynamic PPT text layout
> - Optimized mouse event processing logic

## 2.3.3 - 2019-09-16

> - Dynamic PPT supports text superscript and subscript, modify some pictures can not render
> - Fixed issue with perspective conversion when modifying window size

## 2.3.1 - 2019-09-09

> - Fixed issue with perspective conversion when modifying window size

## 2.3.0 - 2019-09-04

> - Support for whiteboard to add borders
> - Optimized the experience under the weak net
> - Fixed several defects of the player

## 2.2.14 - 2019-08-29

> - Fixed a bug where screenshots were incomplete on specific devices
> - Optimize handwriting effect
> - Fixed several defects of the rectangle tool
> - Dynamic PPT provides preload function

## 2.2.13 - 2019-08-24

> - Optimized the experience under the weak net
> - Support for prohibiting handwriting Bezier
> - Fixed several defects of dynamic PPT

## 2.2.12 - 2019-08-15

> - Fixed several defects of dynamic PPT

## 2.2.11 - 2019-08-06

> - Fixed bug: When there is a host in the room, the whiteboard of the new user cannot see anything
> - Fixed whiteboard layout defects
> - Compatible with whiteboard misalignment under vue start-kit

## 2.2.10 - 2019-08-02

> - Optimized the reconnection logic

## 2.2.9 - 2019-07-30

> - Fixed a bug where certain people could not join the room when they entered the room at the same time

## 2.2.8 - 2019-07-25

> - Fixed broken link reconnection bug on Windows

## 2.2.7 - 2019-07-23

> - Fixed the bug that cannot be disconnected and reconnected
> - Optimized the mobile rubber tool experience
> - Fixed several defects in dynamic PPT typography

## 2.2.6 - 2019-07-17

> - Fixed some defects on dynamic PPT typography rendering
> - Fixed bug where sometimes teaching aids could not be found when joining the room

## 2.2.5 - 2019-07-12

> - Fixed a bug that could fail to initialize the perspective
> - Dynamic PPT fixes some text typesetting defects

## 2.2.4 - 2019-07-06

> - Dynamic PPT supports multimedia playback
> - Dynamic PPT supports more animations
> - Dynamic PPT fixes some graphics rendering defects

## 2.2.2 - 2019-07-01

> - Support to select the animation mode to adjust the viewing angle
> - Support for rendering scene snapshots

## 2.2.1 - 2019-06-29

> - Supports active viewing angle adjustment
> - Support for custom font files for dynamic PPT
> - Support forbidden lens and device input

## 2.0.3 - 2019-06-24

> - Fix: PPT size error during playback of beta recordings
> - Fix: Preview display area does not change with screen scale

## 2.0.0 - 2019-06-23

The official version is basically the same as the previous beta version, and the API is basically the same.
However, it cannot be interconnected with an earlier SDK. Connect with Android 2.0.0 official version and iOS 2.1.0 version.

> For customers connected before 2019.06.24, when upgrading to this version, please contact the SDK team to confirm that the server is pointing to the version.
> Read more [2.0.0 official release](blog/2019/06/22/release-note.md)

# Expired version

## 2.5.3-2020-01-07 (expired)

> - Fixed `plugin.attributes` sometimes returning empty objects
> - Fixed the problem that some 2.3.x SDK playback videos cannot be played

## 2.5.2-2020-01-04 (expired)

> - Updated plugin functionality

## 2.5.1-2020-01-01 (expired)

> - Support automatic upgrade
> - Open beta features
