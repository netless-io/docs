---
id: android-operation
title: Whiteboard operation
---

## Insert picture

Related API:

```Java
public void insertImage(ImageInformation imageInfo);
public void completeImageUpload(String uuid, String url);
```

1. First create the ImageInformation class, configure the image, width and height, and position of the center point, set the uuid, and ensure that the uuid is unique.
2. Invoke the `insertImage:` method, passing in an `ImageInformation` instance. The whiteboard now generates a placeholder.
3. The network where pictures are uploaded through other methods or directly obtained through other methods. After obtaining the picture address, call
`completeImageUpload` method, uuid parameter is uuid passed by` insertImage: `method, src is the actual image network address.

### The difference between inserting a PPT and inserting a picture

Difference | Insert PPT | Insert picture
---------|----------|---------
 Results after calling | Will automatically create multiple whiteboard pages, but still remain on the current page (so there is no obvious difference), you need to switch through the page turning API | To generate a placeholder interface, insert a real picture, you need to call `completeImageUploadWithUuid: src:`, pass in the uuid of the placeholder interface, and the network address of the picture |
 Mobile | Can't move, no location needed | Can be moved, so when inserting, you need to provide picture size and location information
 Relationship with whiteboard pages | When the PPT is inserted, a new page is created on the whiteboard, and the background of this page is the PPT picture | Is part of the current whiteboard page, multiple pictures can be added to the same page

## Image URL replacement

In some cases, we need to sign a picture to ensure that the picture is only used internally.

The replacement API can intercept the image before it is actually inserted into the whiteboard, and modify the address of the last image that was actually inserted. **This method works for both ppt images and normal insert images.**
During playback, the image address is still the unreplaced address and needs to be signed through this API.

```Java
WhiteSdkConfiguration sdkConfig = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
// You must set the replacement when sdk is initialized
sdkConfig.setHasUrlInterrupterAPI(true);

// Initialize a class that implements the UrlInterrupter interface as the WhiteSDK initialization parameter.
UrlInterrupterObject interrupter = new UrlInterrupterObject()
WhiteSdk whiteSdk = new WhiteSdk(whiteBroadView PlayActivity.this, interrupter);
```

> This method works for both ppt insertion and image insertion APIs.

> This API is frequently called during rendering. If there is no need, this method is not needed.

## Read Only<span class="anchor" id="disableOperations">

> Starting with 2.2.0, the API is split into:

Disable user movement, zoom API: `disableCameraTransform` (for details, please refer to [Viewpoint Operation-Disable Viewpoint Change](./view.md#disableCameraTransform));
Disable user input API: `disableDeviceInputs` (For details, please refer to [Tool use-Disable tool operation](./tools.md#disableDeviceInputs) API.

You can disable the user to operate the whiteboard through `room.disableOperations (true)`.

You can restore the user's ability to operate the whiteboard through `room.disableOperations (false)`.

## Zoom

On the one hand, you can zoom in and out of the whiteboard using gestures (two-finger gestures on iOS and Android, two-finger gestures on mac os, and the middle mouse wheel on windows). On the other hand, you can zoom the whiteboard with zoomChange.

```java
room.zoomChange(10);
```

## Background color

The background color of the whiteboard itself is transparent. To set the background color, you only need to set the backgroundColor for WhiteboardView.

## Transparent user information

> 2.0.0 official version new API

Starting from 2.0.0, the SDK allows developers to carry some additional information when joining a room.
> This field will be converted to a value in JSON, so you need to satisfy the JSON constraints on JSON elements.

On other clients, you can query the room `Members` to get the information carried by each user.

### User avatar display

> New in version 2.0.0-beta7. 2.0.0 official version with enhanced functions.

1. When initializing the SDK, set userCursor in WhiteSdkConfiguration to true.
2. When adding a room, pass in the `RoomParams`` userPayload` field, and ensure that the `avatar` field exists.

```Java
WhiteSdkConfiguration sdkConfiguration = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1, true);
sdkConfiguration.setUserCursor(true);
```

```Java
HashMap<String, String> payload = new HashMap<>();
payload.put("avatar", "https://example.com/user.png");
RoomParams roomParams = new RoomParams("uuid", "roomToken", payload);
```

> 2.0.0-beta7 version, you can configure the `MemberInformation` field.

## Active delay

**1.x does not provide this API, `2.0.0-beta8` added API.**

```Java
//Room.java
//Set delay seconds
public void setTimeDelay(Integer timeDelay)
//Get the local client, the number of seconds of automatic delay
public Integer getTimeDelay()
```

Quickly set the whiteboard delay, artificially add a delay to the whiteboard, delay the playback, and meet the needs of audio and video synchronization in the case of HLS.

Note:

1. The parameter unit is second.
2. This method works only for local clients.
3. This method will also affect the custom time, the user avatar callback event.
4. The user draws locally and still appears in real time.

## Clean API

* 2.0.0-beta10 And subsequent versions

```Java
/**
Clear the current screen content

 @param retainPPT Whether to keep ppt
 */
public void cleanScene(boolean retainPpt)
```

## Log upload function

> 2.4.2 New API

Starting from 2.4.2, the SDK will collect the debug logs in the SDK, mainly related to the output when the API is called.

When using `WhiteSdkConfiguration` to initialize the SDK, configure the` LoggerOptions` option in `WhiteSdkConfiguration`, call the` SetDisableReportLog` method of `LoggerOptions`, set to true, and then initialize the WhiteSDK to close the upload content.