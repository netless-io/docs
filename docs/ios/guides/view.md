---
id: ios-view
title: Perspective operation
---

The APIs in this article can be viewed in the `WhiteRoom` class. The room in the sample code in this article is an example of whiteRoom.

The whiteboard provided by the White SDK is infinitely extended to the Quartet. At the same time, it also allows users to move the whiteboard by mouse wheel, gestures and other methods. Therefore, even on the same page of the same whiteboard, different users may see different content on the screen. In order to meet the needs of all users to watch the same content, this article introduces the concept of "anchor mode".

## Anchor perspective

sdk supports setting a certain person in the room as the anchor (other users will automatically change to `Audience Mode`), and what the user sees on the screen is what all other viewers see.
When the anchor performs zooming and moving of the perspective, other people's screens will also automatically perform zooming and moving to ensure that all visible content on the anchor can be viewed.

* The content displayed by the viewer is more than that of the anchor

In the anchor mode, all the content that the anchor sees will be synchronized to the audience. However, the screen ratio of the viewer may be inconsistent with that of the anchor. In order to fully display the content of the anchor, zoom adjustment will be performed. Similar to movie playback, in order to maintain the original picture proportion and retain the original content, on some displays, scaling will be performed, and black borders will appear.

## Perspective mode-anchor, audience, free (default)

```Objective-C
typedef NS_ENUM(NSInteger, WhiteViewMode) {
    // free mode
    // The user can freely zoom and move the perspective.
    // Even if there are anchors in the room, the anchor cannot influence the user's perspective.
    WhiteViewModeFreedom,
    // follow mode
    // The user will follow the anchor's perspective. Where the anchor is watching, the user follows.
    // In this mode, if the user zooms or moves the camera, it will automatically switch back to freedom mode.
    WhiteViewModeFollower,
    // anchor mode
    // The perspective mode of other people in the room will be automatically changed to follower, and the user's perspective is forced to be viewed.
    // If there is another anchor in the room, the anchor's perspective mode will also be forced to change to follower.
    WhiteViewModeBroadcaster,
};

// The following classes are only used in the fireRoomStateChanged: callback event.
@interface WhiteBroadcastState: WhiteObject
// View mode
@property (nonatomic, assign) WhiteViewMode viewMode;
@property (nonatomic, assign) NSInteger broadcasterId;
@property (nonatomic, strong) WhiteMemberInformation *broadcasterInformation;
@end

```

### Set perspective mode

* Example: Set the current user's anchor perspective

```Objective-C
// Just pass in the enumeration value
[whiteRoom setViewMode: WhiteViewModeBroadcaster];
```

### Get the current perspective state

```Objective-C
[self.room getBroadcastStateWithResult:^(WhiteBroadcastState *state) {
    NSLog(@"%@", [state jsonString]);
}];
```

## Perspective center synchronization

The screen sizes of different users in the same room may be different, which will cause their whiteboards to have different sizes. In fact, other users in the room will align the center of the whiteboard with the anchor's whiteboard (note that the screen size of the anchor and other users may not be the same).

We need to set the size of the whiteboard in the following way so that the anchor can synchronize its perspective center.

```Objective-C
[room refreshViewSize];
```

The size should be the same as the actual size of the whiteboard in the product (generally the size of the browser page or application screen). If the user resizes the window, the size of the whiteboard changes. This method should be called again to refresh the size.

## Adjust perspective

> 2.2.0 added API, 2.2.2 added animation option; playback replay and real-time room room support this API
```Objective-C
@interface WhiteDisplayer
// Adjust perspective center
- (void)moveCamera:(WhiteCameraConfig *)camera;
// Adjust visual rectangle
- (void)moveCameraToContainer:(WhiteRectangleConfig *)rectange;
@end
```

<span id="moveCamera">
### Adjust visual rectangle

`moveCamera` API can be used to adjust the view angle. The parameters are optional. The SDK adjusts the center of view and the zoom ratio based on the incoming parameters.

```Objective-C
@interface WhiteCameraConfig : WhiteObject
@property (nonatomic, strong, nullable) NSNumber *centerX;
@property (nonatomic, strong, nullable) NSNumber *centerY;
/** Zoom ratio, formerly zoomScale is deprecated */
@property (nonatomic, strong, nullable) NSNumber *scale;
/**
AnimationMode defaults to AnimationModeContinuous,
 All other attributes are optional and require NSNumber
 */
@property (nonatomic, assign) AnimationMode animationMode;

@end
```

<span id="moveCameraToContain">
### Adjust visual rectangle

In addition to adjusting the perspective center, the SDK also provides an API for adjusting the visual rectangle.

> The visual rectangle indicates the area your viewing angle must accommodate. After you set the visual rectangle, the angle of view will automatically adjust to just show the range represented by the visual rectangle.

```Objective-C
@interface WhiteRectangleConfig : WhiteObject

- (instancetype)initWithInitialPosition:(CGFloat)width height:(CGFloat)height;
/** Move to the initial position and scale based on width and height */
- (instancetype)initWithInitialPosition:(CGFloat)width height:(CGFloat)height animation:(AnimationMode)mode;

/** The internal coordinates of the whiteboard, with the center point as the initial point, here is originX: - width / 2，originY: -height /2 */
- (instancetype)initWithOriginX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height;
- (instancetype)initWithOriginX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height animation:(AnimationMode)mode;

@property (nonatomic, assign) CGFloat originX;
@property (nonatomic, assign) CGFloat originY;
@property (nonatomic, assign) CGFloat width;
@property (nonatomic, assign) CGFloat height;
@property (nonatomic, assign) AnimationMode animationMode;

@end
```

## ppt fills the current screen

> [Whiteboard](https://github.com/netless-io/Whiteboard-iOS) Open source version 2.5.1 adds API

```Objective-C
/**
 Fill the screen with ppt proportionally (see UIViewContentModeScaleAspectFit).
 This operation is a one-time operation and does not continue to lock.
 If the current page does not have ppt, no scaling will occur.
 @param mode Animation parameters, continuous animation, or instant switching
 */
- (void)scalePptToFit:(WhiteAnimationMode)mode;
```

## Disable perspective changes <span class = "anchro" id = "disableCameraTransform">

> 2.2.0 Added API

Developers can use the following methods to prevent users from manually adjusting the viewing angle (using the mouse wheel to zoom, touchpad gesture movement, zoom, mobile two-finger operation).

```Objective-C
// Forbid users from actively changing their vision
[room disableCameraTransform: YES];
// Restore user's vision change permissions
[room disableCameraTransform: NO];
```

> You still adjust the angle of view through the program; users can still perform output operations such as strokes.


## Related documents

[Anchor one-to-many service implementation](/docs/blog/blog-broadcast)