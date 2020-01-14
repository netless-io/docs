---
id: ios-tools
title: Tools
---

The SDK provides a variety of tools, such as selectors, pencils, text, circle tools, and rectangle tools.
The display form of these functions is related to the interaction design and visual style of the specific web application itself. Therefore, these UI components are not provided directly on the whiteboard. You need to make the whiteboard use these functions by calling the program.

The APIs in this article can be viewed in the `WhiteRoom` class. The room in the sample code in this article is an example of whiteRoom.

##  Tools

```Objective-C

//WhiteMemberState.h

typedef NSString * WhiteApplianceNameKey;

extern WhiteApplianceNameKey const AppliancePencil;
extern WhiteApplianceNameKey const ApplianceSelector;
extern WhiteApplianceNameKey const ApplianceText;
extern WhiteApplianceNameKey const ApplianceEllipse;
extern WhiteApplianceNameKey const ApplianceRectangle;
extern WhiteApplianceNameKey const ApplianceEraser;

@interface WhiteMemberState : WhiteObject
/** Tool, initial tool is "pencil", no default value */
@property (nonatomic, copy) WhiteApplianceNameKey currentApplianceName;
/** Pass in RGB in the format [@(0-255),@(0-255),@(0-255)] */
@property (nonatomic, copy) NSArray<NSNumber *> *strokeColor;
/** Brush thickness */
@property (nonatomic, strong) NSNumber *strokeWidth;
@property (nonatomic, strong) NSNumber *textSize;
@end

```

### Tool

| Name | Objective-C Constants | Description |
|: --- |: --- |:: --- |
| Select | ApplianceSelector | Select, Move, Scale |
| Pencil | AppliancePencil | Draw Colored Tracks |
| Rectangle | ApplianceRectangle | Draw Rectangle |
Ellipse | ApplianceEllipse | Draw a Perfect Circle or Ellipse |
| Eraser | ApplianceEraser | Delete Track |
| Text | ApplianceText | Edit, Enter Text |

### Switching tools

The White SDK provides a variety of teaching aids. We can set the current tool by generating a `WhiteMemberState` instance.

* Example: We set the current tool as the Pencil tool:

```Objective-C
WhiteMemberState *memberState = [[WhiteMemberState alloc] init];
//In the initial state of the whiteboard, the tool defaults to pencil
memberState.currentApplianceName = AppliancePencil;
[whiteRoom setMemberState:memberState];
```

> Because of iOS webview limitation, the keyboard cannot pop up before 2.0.5. You can turn off webview internal restrictions according to the [support webview keyboard](https://stackoverflow.com/questions/32449870/programmatically-focus-on-a-form-in-a-webview-wkwebview) article.

> When the text tool frame is within the range covered by the soft keyboard, the iOS system will automatically scroll to scroll, but when the soft keyboard disappears, it will not automatically reply. You can call `whiteboardView.scrollView.contentOffset = CGPointZero` yourself.
> 2.1.0 Handled keyboard events inside whiteboardView and resumed. If you want to handle the situation yourself, you can set the disableKeyboardHandler of whiteboardView to YES.

### Set color and thickness of tool

`WhiteMemberState` has other attributes:

```Objective-C
@interface WhiteMemberState : WhiteObject
/** The RGB format is [@(0-255),@(0-255),@(0-255)] * /
@property (nonatomic, copy) NSArray<NSNumber *> *strokeColor;
/** Brush thickness */
@property (nonatomic, strong) NSNumber *strokeWidth;
@property (nonatomic, strong) NSNumber *textSize;
```

1. `strokeColor` property, you can adjust the color of teaching aids. This attribute can affect the color of pencils, rectangles, ellipses, and text tools.
2. `strokeWidth` property, you can adjust the thickness of the teaching aids. This attribute can affect the color of pencils, rectangles, ellipses, and tools.

### Get current teaching aids
```Objective-C
[room getMemberStateWithResult:^(WhiteMemberState *state) {
    NSLog(@"%@", [state jsonString]);
}];
```

## Forbidden tool operation <span class = "anchor" id = "disableDeviceInputs">

> 2.2.0 Added API

You can block teaching aids as follows.

```Objective-C
// Prohibit tool operation
[room disableDeviceInputs:YES];
// Recovery tool operation
[room disableDeviceInputs:NO];
```