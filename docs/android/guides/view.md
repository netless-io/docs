---
id: android-view
title: Perspective operation
---

The APIs in this article can be viewed in the `Room` class. The room in the sample code in this article is an example of whiteRoom.

The whiteboard provided by the White SDK is infinitely extended to the Quartet. At the same time, it also allows users to move the whiteboard by mouse wheel, gestures and other methods. Therefore, even on the same page of the same whiteboard, different users may see different content on the screen. In order to meet the needs of all users to watch the same content, this article introduces the concept of "anchor mode".

## Anchor perspective

sdk supports setting a certain person in the room as the anchor (other users will automatically change to `Audience Mode`), and what the user sees on the screen is what all other viewers see.
When the anchor performs zooming and moving of the perspective, other people's screens will also automatically perform zooming and moving to ensure that all visible content on the anchor can be viewed.

**The content displayed by the viewer is more than that of the anchor**

In the anchor mode, all the content that the anchor sees will be synchronized to the audience. However, the screen ratio of the viewer may be inconsistent with that of the anchor. In order to fully display the content of the anchor, zoom adjustment will be performed. Similar to movie playback, in order to maintain the original picture proportion and retain the original content, on some displays, scaling will be performed, and black borders will appear.

## 视角模式 —— 主播，观众，自由（默认）

```Java
public class BroadcastState {
    // The current perspective mode is as follows:
    // 1. "freedom" perspective, the perspective will not follow anyone
    // 2. "follower" follows the perspective and will follow the anchor in the room
    // 3. "broadcaster" perspective of the anchor, the perspective of others in the room will follow me
    private ViewMode mode;

    // Room anchor ID.
    // if the current room has no anchor, it is undefined
    private Long broadcasterId;

   // Anchor information, which can be customized, see the data structure below for details
    private MemberInformation broadcasterInformation;
    ... setter/getter
}

public class MemberInformation {
    // ID
    private Long id;
    // Nick Name
    private String nickName;
    // Avatar URL
    private String avatar;
    ... setter/getter
}
```

### Set perspective mode

* Example: Set the current user's anchor perspective

```java
// anchor mode
// The perspective mode of other people in the room will be automatically modified to follower, and forced to watch your perspective.
// If there is another anchor in the room, the anchor's perspective mode will also be forced to change to follower.
// It's as if you grabbed his / her anchor position.
room.setViewMode(ViewMode.broadcaster);

// free mode
// You can freely zoom and move the perspective.
// Even if there are anchors in the room, the anchor cannot influence your perspective.
room.setViewMode(ViewMode.freedom);

// follow mode
// You will follow the anchor's perspective. Where the anchor is watching, you will follow where you are.
// In this mode, if you zoom in and move the perspective, you will automatically switch back to freedom mode.
room.setViewMode(ViewMode.follower);
```

### Get the current view state

```Java
room.getBroadcastState();
```

The content structure obtained by it is shown in the following figure
```Java
public class BroadcastState {
    private ViewMode mode;
    private Long broadcasterId;
    private MemberInformation broadcasterInformation;
    
    ... getter/setter
}
```

## Adjust perspective

> 2.2.0 added API, 2.3.2 added animation option; playback replay and real-time room room support this API

```Java
public class Displayer {
    // Adjust perspective center
    public void moveCamera(CameraConfig camera);
    // Adjust visual rectangle
    public void moveCameraToContainer(RectangleConfig rectange);
}
```

<span id="moveCamera">
### Adjust perspective center

`moveCamera` API can be used to adjust the view angle. The parameters are optional. The SDK adjusts the center of view and the zoom ratio based on the incoming parameters.

```Java
// View center movement parameter
public class CameraConfig extends WhiteObject {

    public AnimationMode getAnimationMode() {
        return animationMode;
    }
    // Default continuous animation, can be set to switch instantly
    public void setAnimationMode(AnimationMode animationMode) {
        this.animationMode = animationMode;
    }

    private AnimationMode animationMode;

    public Double getCenterX() {
        return centerX;
    }
    
    // Optional parameter, if not filled, it will not change
    public void setCenterX(Double centerX) {
        this.centerX = centerX;
    }

    public Double getCenterY() {
        return centerY;
    }

    // Optional parameter, if not filled, it will not change
    public void setCenterY(Double centerY) {
        this.centerY = centerY;
    }

    public Double getScale() {
        return scale;
    }

    // Optional parameter, if not filled, it will not change, instead of zoomScale
    public void setScale(Double scale) {
        this.scale = scale;
    }

    private Double centerX;
    private Double centerY;
    private Double scale;
}
```

<span id="moveCameraToContain">
### Adjust visual rectangle

In addition to adjusting the perspective center, the SDK also provides an API for adjusting the visual rectangle.

> The visual rectangle indicates the area your viewing angle must accommodate. After you set the visual rectangle, the angle of view will automatically adjust to just show the range represented by the visual rectangle.

```Java
public class RectangleConfig extends WhiteObject {
    private Double originX;
    private Double originY;
    private Double width;
    private Double height;

    public RectangleConfig(Double width, Double height, AnimationMode mode) {
        this(width, height);
        this.animationMode = mode;
    }

    // Center point is initial position
    public RectangleConfig(Double width, Double height) {
        this.width = width;
        this.height = height;
        this.originX = - width / 2.0d;
        this.originY = - height / 2.0d;
    }

    public RectangleConfig(Double originX, Double originY, Double width, Double height) {
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
    }

    public RectangleConfig(Double originX, Double originY, Double width, Double height, AnimationMode mode) {
        this(originX, originY, width, height);
        this.animationMode = mode;
    }

    public Double getOriginX() {
        return originX;
    }

    public void setOriginX(Double originX) {
        this.originX = originX;
    }

    public Double getOriginY() {
        return originY;
    }

    public void setOriginY(Double originY) {
        this.originY = originY;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public AnimationMode getAnimationMode() {
        return animationMode;
    }

    public void setAnimationMode(AnimationMode animationMode) {
        this.animationMode = animationMode;
    }

    private AnimationMode animationMode;
}
```

## ppt fills the current screen

>2.4.22

```Java
// displayer.java
// room player use for public

/**
* In the form of continuous animation, the ppt is proportionally scaled to ensure that everything in the ppt is inside the container.
* @since 2.4.22
*/
public void scalePptToFit() {
    bridge.callHandler("displayer.scalePptToFit", new Object[]{});
}

/**
* Scale the ppt equally to ensure that everything in the ppt is inside the container.
* @param mode Animation behavior when zooming
* @since 2.4.28
*/
public void scalePptToFit(AnimationMode mode) {

```

## Prohibit changes in perspective<span class="anchro" id="disableCameraTransform">

>2.2.0 new API

Developers can use the following methods to prevent users from manually adjusting the viewing angle (using the mouse wheel to zoom, touchpad gesture movement, zoom, mobile two-finger operation).

```Java
// Prevent users from actively changing their vision
room.disableCameraTransform(true);
// Restore user vision change permissions
room.disableCameraTransform(false);
```

## Related documents

[Anchor one-to-many service implementation](/docs/blog/blog-broadcast)
