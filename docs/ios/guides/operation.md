---
id: ios-operation
title: Whiteboard operation
---

The APIs in this article can be viewed in the `WhiteRoom.h` file.

The room in the sample code in this article is an example of WhiteRoom.

## Insert image

```Objective-C

@interface WhiteRoom : NSObject

/**
1. Use the insertImage API first to insert a placeholder image
 */
- (void)insertImage:(WhiteImageInformation *)imageInfo;

/**
2. Replace content with completeImageUploadWithUuid: src:
 Replace content in placeholder image

 @param uuid insertImage API, the image passed in by imageInfo uuid
 @param src network address of the picture
 */
- (void)completeImageUploadWithUuid:(NSString *)uuid src:(NSString *)src;

/ ** Encapsulate the above two APIs * /
- (void)insertImage:(WhiteImageInformation *)imageInfo src:(NSString *)src;

@end
```

<details><summary> Insert Image API-Need to get image address asynchronously </summary>

1. First create the `WhiteImageInformation` class, configure the image, width and height, and position of the center point, set uuid, and ensure that uuid is unique.
2. Invoke the `insertImage:` method, passing in a `WhiteImageInformation` instance. The whiteboard now generates a placeholder.
3. After the picture is uploaded by other methods or directly obtain the picture address, call
`completeImageUploadWithUuid: src:` method, uuid parameter is the uuid passed by the `insertImage:` method, and src is the network address of the picture.

</details>

<br>
In the v2 version, we have encapsulated the Insert Image API into an API. If the developer already knows the picture information when inserting the picture, he can directly use the encapsulated API

```Objective-C
WhiteImageInformation *info = [[WhiteImageInformation alloc] init];
info.width = 200;
info.height = 300;
info.uuid = @"WhiteImageInformation";
[self.room insertImage:info src:@"https://white-pan.oss-cn-shanghai.aliyuncs.com/101/image/alin-rusu-1239275-unsplash_opt.jpg"];
```

### The difference between inserting a PPT and inserting a picture

Difference | Insert PPT | Insert Picture
--------- | ---------- | ---------
 Results after calling | It will automatically create multiple whiteboard pages, but still remain on the current page (so there is no obvious difference), you need to switch through the page turning API | Generate a placeholder interface, insert a real picture, you need to call `completeImageUploadWithUuid: src` ?, The uuid passed into the placeholder interface, and the? Network address of the picture |
 Move | Can't move, so no position information is needed | Can move, so you need to provide picture size and position information when inserting
 Relationship with the whiteboard page | When ppt is inserted, a new page is created on the whiteboard. The background of this page is the PPT image.

## Image URL replacement

In some cases, we need to sign a picture to ensure that the picture is only used internally.

The replacement API can intercept the image before it is actually inserted into the whiteboard, and modify the address of the last image that was actually inserted. ** This method works for both ppt images and normal insert images. **
During playback, the image address is still the unreplaced address and needs to be signed through this API.

This method is a declaration method in the `WhiteCommonCallbackDelegate` protocol, which is a passive call.

**To enable, please set the `EnableInterrupterAPI` property of` WhiteSdkConfiguration` to YES when initializing the SDK.** When `WhiteSDK` is initialized, use the following method to pass in an instance that implements the protocol

```Objective-C
- (instancetype)initWithWhiteBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config commonCallbackDelegate:(nullable id<WhiteCommonCallbackDelegate>)callback
```

Or when you want to use it, call the `setCommonCallbackDelegate:` method of `whiteSDK` to set it.

## Read-only <span class = "anchor" id = "disableOperations">

> Starting 2.2.0, the API is split into:
Disable user movement, zoom API: `disableCameraTransform` (for details, please refer to [Viewpoint Operation -> Disable Perspective Change](./view.md#disableCameraTransform));
Disable user input API: `disableDeviceInputs` (For details, please refer to [Teaching Tool Use -> Disable Teaching Tool Operation](./tools.md#disableDeviceInputs) API.


```Objective-C
/** Enter read-only mode, do not respond to user gestures */
- (void)disableOperations:(BOOL)readonly;
```

## Zoom

Users can use the two-finger swipe gesture on iOS, and hold the option mouse in the simulator to simulate the zoom operation on the whiteboard.
On the other hand, developers can also zoom using `zoomChange`.

* Code setting scaling

```Objective-C
/**
Zoom out whiteboard
 @param scale scale relative to original size, not relative to current scale
 */
- (void)zoomChange:(CGFloat)scale;
```

* Code to get scale value

```Objective-C
- (void)getZoomScaleWithResult:(void (^) (CGFloat scale))result;
```

## Move

The whiteboard supports two-finger gestures. You can move the whiteboard by panning with two fingers.

Moving using code is currently not supported.

## Background color

> 2.4.0 Added API

Added `backgroudColor` property to the whiteboard, which supports modifying the background color of the whiteboard. This color is locally modified and will not be synchronized to other users.

```Objective-C
@interface WhiteDisplayer: NSObject
/**
 Will be converted to a hexadecimal color value, currently does not support transparency settings, only transparency is passed. This background is the value modified locally by the user and will not be synchronized.
 */
@property (nonatomic, strong) UIColor *backgroundColor;
@end
```

## Transparent user information

> 2.1.0 Added API

Starting from 2.1.0, the SDK allows developers to carry some additional information when joining a room.
sdk, this information will be transparently transmitted to all clients. (Note that this property needs to meet certain constraints, see below for details)

`WhiteRoomConfig` Added` userPayload` property. Allow developers to carry some relevant information.

On other clients, you can query the room `Members` to get the information carried by each user.

> Only if the content of this property satisfies `[NSJSONSerialization isValidJSONObject: @ {@" userPayload ": userPayload}]` is YES. SDK will then pass this data to all clients.

```Objective-C
@interface WhiteRoomConfig : WhiteObject
- (instancetype)initWithUuid:(NSString *)uuid roomToken:(NSString *)roomToken userPayload:(id _Nullable)userPayload;
@end
```

### User avatar display

> 2.0.2 Added API. 2.1.0 has been enhanced and can be delivered in its entirety

1. When `WhiteSDK` is initialized, set the` userCursor` field of `WhiteSdkConfiguartion` to YES.
1. Set the `userPayload` property of` WhiteRoomConfig` to a dictionary. And make sure the `avatar` field is present and the value is the user avatar address.

> 2.0.2 ~ 2.1.0, please configure `memberInfo` of` WhiteRoomConfig`

> User avatar address, it is recommended to use https address, otherwise please enable iOS ATS function.

Related API:

```Objective-C

@interface WhiteSdkConfiguartion ： WhiteObject
/** Display operation user avatar (requires user information when joining the room) */
@property (nonatomic, assign) BOOL userCursor;

@end
```

```Objective-C
@interface WhiteSDK : NSObject
// Join the room API
- (void)joinRoomWithConfig:(WhiteRoomConfig *)config callbacks:(nullable id<WhiteRoomCallbackDelegate>)callbacks completionHandler:(void (^) (BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error))completionHandler;
@end
```


```Objective-C
@interface WhiteRoomConfig : WhiteObject
// Initialize room parameters and pass in user information
- (instancetype)initWithUuid:(NSString *)uuid roomToken:(NSString *)roomToken memberInfo:(WhiteMemberInformation * _Nullable)memberInfo;
// Since 2.1.0, it is recommended to use this API
- (instancetype)initWithUuid:(NSString *)uuid roomToken:(NSString *)roomToken userPayload:(id _Nullable)userPayload;

@end
```

## Active delay

* 1.x does not provide this API, `2.0.3` added API. *

```Objective-C
@interface WhiteRoom : NSObject
## Set whiteboard delay seconds
- (void)setTimeDelay:(NSTimeInterval)delay;
## Get the current active delay time of the whiteboard
@property (nonatomic, assign, readonly) NSTimeInterval delay;
@end
```

Quickly set the whiteboard delay, artificially add a delay to the whiteboard, delay the playback, and meet the needs of audio and video synchronization in the case of HLS.

be careful:

1. This method is only valid for local clients.
2. This method will also affect the custom time, user avatar callback event.
3. The user draws locally and still appears in real time.

## Clear Screen API

* 2.0.1 Added API

```Objective-C
@interface WhiteRoom : NSObject
/**
Clear the current screen content

 @param retainPPT whether to retain ppt
 */
- (void)cleanScene:(BOOL)retainPPT;
@end
```

## Log upload function

> 2.4.1 Added API

Starting from 2.4.1, the SDK will collect the debug logs in the SDK, mainly related to the output when the API is called.

When using `WhiteSdkConfiguration` to initialize the SDK, set the` loggerOptions` property of `WhiteSdkConfiguration`, pass in a dictionary with` disableReportLog`, and define opening and closing in it. YES turns log upload off, NO turns log upload on (default).