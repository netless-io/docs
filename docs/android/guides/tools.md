---
id: android-tools
title: Tools
---

## 教具

```java
public class MemberState {
    // The current tool. Modifying it will switch tools. The following tools are available:
    // 1. selector
    // 2. pencil tool
    // 3. rectangle tool
    // 4. ellipse tool
    // 5. eraser tool
    // 6. text tool
    private String currentApplianceName;
    // The color of the line, write RGB in an array. It looks like [255, 128, 255].
    private int[] strokeColor;
    // Thickness of lines
    private Double strokeWidth;
    // Text size
    private Double textSize;
    ... setter/getter
}
```

### Switching tools

The White SDK provides a variety of teaching aids. We can change the current tool by modifying `memberState`. For example, to switch the current tool to the Pencil tool, you can use the following code.

```java
MemberState memberState = new MemberState();
memberState.setCurrentApplianceName("pencil");
room.setMemberState(memberState);
```

You can get the name of the tool in the current room through the following code.

```java
room.getMemberState().getCurrentApplianceName();
```

### Tool list

| Name | String | Description |
|: --- |: --- |:: --- |
| Select | selector | select, move, scale |
| Pencil | pencil | draw colored tracks |
| Rectangle | draw a rectangle |
Ellipse | ellipse | draw a perfect circle or ellipse |
| Eraser | eraser | delete track |
| Text | text | edit, enter text |

### Palette

The following code can modify the color of the palette.
```java
MemberState memberState = new MemberState();
memberState.setStrokeColor(new int[]{255, 0, 0});
room.setMemberState(memberState);
```
The color of the palette is represented by writing RGB in an array of the form [255, 0, 0].

You can also get the color of the current palette according to the following code.
```java
room.getMemberState().getStrokeColor();
```
The palette can affect the effects of the pencil, rectangle, oval, and text tools.

## Prohibition of tool operation<span class="anchor" id="disableDeviceInputs">

>2.2.0 New API

You can block teaching aids as follows.

```java
// Prohibition of tool operation
room.disableDeviceInputs(true);
// Recovery tool operation
room.disableDeviceInputs(false);
```