---
id: js-outline
title: Outline
---

This section lists the main content of each page in each document for the convenience of developers.  
Just click on the third-level directory to jump to the corresponding document.

---

## Installation guide

### [sdk integration](../guide/sdk.md)

#### sdk project
1. pure js
2. react-sdk
#### Import method
1. npm
2. import manually
#### TypeScript support
1. `.d.ts` introduce
2. `tsconfig` configuration

### [Changelog](../guide/changelog.md)
* Changelog

### [Open source](../guide/open-source.md)
* Open source demo

### [Quick debug](../guide/debug.md)
1. Room Join Problem -> Joining a Room Online
2. Other debugging

---

## Quick start

### [Condition](../quick-start/precondition.md)
1. Register for an account and get `sdkToken`
### [Room authentication](../quick-start/token.md)
> In a production environment, it should be called on the server side
1. Create room
2. Get room information
### [Real-time room](../quick-start/room.md)
1. Initialization
2. Quit
3. Note
    1. Exception handling
    2. Precautions
4. Online code
### [Replay room](../quick-start/player.md)
5. Replay
6. Stop play
7. Precautions
8. Online code

---

## Initialization parameters

### [SDK parameters](../parameters/sdk.md)
1. Initialize the API
2. Parameter Description

### [Room parameters](../parameters/room.md)
1. Initialize the API
2. JoinRoomParams
3. RoomCallbacks

### [Replay parameters](../parameters/player.md)
1. Initialize the API
2. ReplayRoomParams
3. PlayerCallbacks

---

## Features

### [Tool operation（memberState）](../features/tools.md)
1. Ordinary teaching aids
    1. Type (brush, circle, rectangle)
    2. Detail parameters (color, thickness, text size)
    3. Tool information
    4. Eraser configuration options (optional initialization parameters)
2. Image
    1. Difference between picture and background
    <!-- Image display logic (zoom, black border, fill, etc.) -->
3. Hand tool
    * Initial parameter configuration
4. Disable tool operation
    * Optional initialization parameters

### [Perspective operation](../features/view.md)
1. Whiteboard internal coordinate system
    * Coordinate Transformation API
2. Anchor mode
3. Perspective Mode (Concept Introduction)
    1. Anchor
    2. Audience
    3. freedom
    * Perspective non-code (user active) switching logic
4. Refresh width and height data
    1. When to call (call it after it happens)
5. Adjust perspective center
    1. Animation
    2. Back to original position
    3. Zoom
6. Adjust field of view (visual rectangle)
    1. Animation
    2. Padding ppt example
7. Lock perspective
8. Limited field of view
    1. Limiting the viewing angle range (optional initialization parameters)

### [Page (scene) operation API](../features/scenes.md)
1. Page
    * definition
2. Page management concepts
    1. Table of Contents-Page Grouping
    2. Path-specified page
3. Get current directory / page information
4. Switch pages
    * Note: Reasons for not taking effect
5. Page turning (same directory)
    * Note: the reason for the error
6. Add page
    * Note: Reasons for not taking effect
7. Rename, move pages
8. Delete page
9. Page preview
10. Page screenshot

### [Status monitoring](../features/state.md)
1. Room status
    1. Definition of concept
    2. Type structure
        1. DisplayerState and related structures
        2. roomState
        3. playerState
2. Get status
3. Listening for status changes
    1. Real-time room
    2. Replay room

### [Whiteboard operation](../features/operation.md)
1. Read only：
    1. Prohibition of tool operation
    2. Disable perspective movement / zoom
2. Custom GlobalState
3. Zoom
    1. Disable zoom
    2. User active zoom
    3. API operations
4. Active delay
5. Clear screen (link to page)
    1. Preserved vs. Unpreserved Background (PPT)

### [Custom event](../features/events.md)
1. Send custom events (live room only)
    * Note
2. Listen for custom events
    1. Ordinary frequency
    2. High frequency event
3. Log out of custom listeners

### [Document conversion (word, ppt, pdf, etc.)](../features/document.md)
1. Prerequisites (start configuration in the background)
2. Conversion task-provided by SDK
3. Dynamic ppt API
    1. Animation switching
    2. Custom font

### [Replay function](../features/replay.md)

1. Prerequisite
2. Audio and video support
    1. Audio
    2. Video
    3. Limitation
        * MacOS Safari, iOS, prohibit code to play videos, and workaround
3. Replay status monitoring
4. Active playback
    1. Play
    2. Seek
    3. Pause
    4. Switch observation mode
    5. Abort, cast resources