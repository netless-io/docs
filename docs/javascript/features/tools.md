---
id: js-tools
title: Tools
---

The `room` variables in this chapter are examples of whiteboard rooms.

## Ordinary tools

In the `state` of` room`, the `memberState` attribute exists (you can read [State Management](./state.md) for more` state` information).
Common teaching aids can be described by `memberState`.

### MemberState structure

```typescript
type MemberState = {
    // Name of current teaching aid
    currentApplianceName: string;
    // The current teaching aid color is an array of integers, which respectively represent [R, G, B] and an integer ranging from 0 to 255.
    // This value affects all common teaching aids
    strokeColor: Color;
    // Current teaching aid thickness, default 4
    strokeWidth: number;
    // Text aid font size, default 16px
    textSize: number;
};
```

### Kind

| name | string | description |
| --- | ------ | --- |
| Selector | `selector` | Select, you can select one or more graphics, and move, zoom, delete (del key) |
| Pencil (default) | `pencil` | Draw colored tracks |
| Rectangle | `rectangle` | Draw a rectangle or square (shift key)|
| Ellipse | `ellipse` | Draw an ellipse or a perfect circle (shift key)|
| Eraser | `eraser` | Delete track |
| Text | `text` | Edit, enter text|

### Adjust teaching aids (kind, color, thickness, size)

```javascript
// Modify the teaching aids, just pass in the fields you want to modify
room.setMemberState({
    currentApplianceName: "pencil",
    strokeColor: [255, 0, 0],
    strokeWidth: 4,
    textSize: 14,
});
```

### Inquiry about teaching aids

You can access the contents of `memberState` by the following methods.
```js
const memberState = room.state.memberState;
const appliance = room.state.memberState.currentApplianceName;
//...Other teaching aid details
```

### Eraser erase picture configuration

Eraser can be configured additionally, whether it can erase pictures:

1. During initialization, configure according to the `disableEraseImage` field in [Initialization Parameters-Room Parameters] (../ parameters / room.md # disableeraseimage):` Whether you can erase the picture (default can be) `
2. Set the `room.disableEraseImage` property.

## Picture (Internet address)

`sdk` supports inserting network pictures into the current whiteboard page (if you need local pictures, please handle the upload yourself to get the network picture logic).

### Typescript signature:

```typescript
type ImageInformation = {
    // The unique identifier of the image. This uuid is used to ensure that completeImageUpload updates the correct insertImage address.
    uuid: string;
    // The coordinates of the center of the picture in the internal coordinate system of the whiteboard. The center far point is the center when the whiteboard is initialized
    centerX: number;
    centerY: number;
    // The width and height you want to display, which is the width and height before the whiteboard is not scaled
    width: number;
    height: number;
};

// Insert picture placeholder
public insertImage(imageInfo: ImageInformation): void;
// Image url replacement
public completeImageUpload(uuid: string, src: string): void;
```

### Sample code

1. Call the `insertImage` method to ensure that the` uuid` string is unique and configure the image position (size, center position) information.
Then through the server or local upload to the cloud storage warehouse, get the network address of the picture information to be inserted, and call method 2 to pass in the picture network address.

```JavaScript
// Method 1 Insert picture placeholder information
// Use uuid to ensure that completeImageUpload updates the same image address
room.insertImage({
    uuid: uuid, 
    centerX: x, 
    centerY: y, 
    width: imageFile.width, 
    height: imageFile.height
});
// Method 2 Pass in the picture placeholder uuid and the picture network address.
room.completeImageUpload(uuid, imageUrl)
```

### The difference between `picture teaching aid` and` ppt background map`

Difference| Insert background image `putScenes` | `insertImage` and `completeImageUpload`
---------|----------|---------
 Relationship to the page | Create a blank page with a background image | An image is inserted in the current page, and the front and back are determined according to the drawing relationship |
 Position | Center | Layout in the internal system of the whiteboard according to the position information of the `insertImage` input parameter|
 eraser | Cannot be altered | It can be altered by default. It can be changed by modifying the `disableEraseImage` property of` room` or by configuring the `disableEraseImage` parameter during initialization. |

## Hand tool

### Shortcut settings
Please read the `handToolKey` field description in [Initialization Parameters-SDK Parameters](../parameters/sdk.md#handToolKey).

### Activate / deactivate callback
When the grabber tool is activated, the onHandToolActive method of callbacks in [Initialization Parameters-Room Parameters](../parameters/room.md#disableeraseimage) will be called back.

## Disable tool<span class="anchor" id="disableDeviceInputs">

>2.2.0 Add API

Modify the `disableDeviceInputs` property of` room` or configure the `disableDeviceInputs` parameter during initialization.

```javascript
// Prohibition of teaching aid operation
room.disableDeviceInputs = true;
// Resume teaching aid operation
room.disableDeviceInputs = false;

sdk.joinRoom({uuid: "uuid", roomToken: "roomToken", disableDeviceInputs: true})
.then(function(room) {
    //room operate
});
```