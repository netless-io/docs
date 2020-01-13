---
id: js-room
title: Room parameters
---

`room` and` player` are actually subclasses of the internal `displayer`. In the `TypeScript` signature, the method signatures starting with` /// Displayer.d.ts` can be used in both `room` and` player`.

We call the room that users use in real time and synchronize with the outside, called **real-time room** (`corresponding class is room`)

## Initialize the API

### TypeScript signature

```typescript
//WhiteWebSdk.d.ts
public joinRoom(params: JoinRoomParams, callbacks: RoomCallbacks = {}): Promise<Room>
```

### Sample code

```js
whiteWebSdk.joinRoom({
    uuid: json.msg.room.uuid,
    roomToken: json.msg.roomToken,
}, 
// callback itself is an optional parameter and may not be passed.
{
    onRoomStateChanged: modifyState => {
        console.log(modifyState);
    },
    onPhaseChanged: phase => {
        console.log(phase);
    }
).then(function(room) {
    // Real-time room example
    window.room = room;
}).catch(function(err) {
    // Initializing the room failed
    console.log(e);
})
```

## JoinRoomParams parameter Description:

### TypeScript signature

```typescript
export type JoinRoomParams = {
    readonly uuid: string;
    readonly roomToken: string;
    readonly userPayload?: any;
    readonly disableDeviceInputs?: boolean;
    readonly disableBezier?: boolean;
    readonly cursorAdapter?: CursorAdapter;
    readonly cameraBound?: CameraBound;
    readonly disableEraseImage?: boolean;
    readonly disableOperations?: boolean;
};
```

> Except for `uuid` and` roomToken`, all other parameters are optional. Bold fields in the directory on the right are commonly used settings.

### **uuid**(require): string

```js
The room indicates that people in the same room can interact.
```

### **roomToken**(require): string

```js
Room authentication information.
```

### **userPayload**: User Info

```
It can be anything and it will be reflected in room.state.roomMembers.
The SDK will pass it as the user's information completely without processing.
```

### cursorAdapter: Mouse cursor display

```typescript
// Handle the mapping between user information (`userPayload`) and user avatar div.  
// Need to implement this interface
export interface CursorAdapter {
    createCursor(memberId: number): CursorDescription & {readonly reactNode?: any};
    onAddedCursor?(cursor: Cursor): void;
    onRemovedCursor?(cursor: Cursor): void;
}

// Cursor-Avatar
export interface Cursor {
    readonly divElement: HTMLDivElement;
    readonly memberId: number;
    readonly cursorMember: CursorMember;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    onCursorMemberChanged?: (cursorMember: CursorMember) => void;

    setReactNode(reactNode: any): void;
    setCursorDescription(description: Partial<CursorDescription>): void;
}

// Cursor-Avatar description
export type CursorDescription = {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
};
```

> This parameter combined with `userPayload` can display the user's mouse position.

You can use the following code to customize the mouse cursor.

```css
.cursor-box {
  height: 32px;
  width: 32px;
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

```javascript
var roomMembers = [];
var cursorAdapter = {
  createCursor: function(memberId) {
    	 return {x: 16, y: 16, width: 32, height: 32};
  },
  onAddedCursor: function(cursor) {
    for (var i = 0; i < roomMembers.length; i ++) {
      var roomMember = roomMembers[i];
      if (roomMember.memberId === cursor.memberId) {
        // The iconURL and color should be customized by the user into the payload
        var payload = roomMember.payload;
        var cursorElement = createCursorElement(payload.iconURL, payload.color);
        cursor.divElement.append(cursorElement);
        break;
      }
    }
  },
  onRemovedCursor: function(cursor) {
    // Clean up
  },
};

function createCursorElement(iconURL, color) {
  var containerElement = document.createElement("div");
  var iconURLElement = document.createElement("img");
  containerElement.append(iconURLElement);
  containerElement.setAttribute("style", "border-color: " + color + ";");
  containerElement.setAttribute("class", "cursor-box");
  iconURLElement.setAttribute("src", iconURL);
}

whiteWebSdk.joinRoom({
  uuid: "...",
  roomToken: "...",
  cursorAdapter: cursorAdapter,
  userPayload: {
    // userPayload can be customized according to the business
    nickname: "your-nick-name",
    iconURL: "https://your-domain.com/your-path-to-icon.png",
  },
}, {
  onRoomStateChanged: function(modifyState) {
    if (modifyState.roomMembers) {
      roomMembers = modifyState.roomMembers;
    }
  }
});
```

### cameraBound

```js
Limitation of the zoom range, which can simultaneously limit the maximum and minimum zoom ratios, as well as range of movement, and is associated with the background image on the whiteboard page.
```

### disableBezier: Bezier Optimized Switch

```js
Default `false`, type:` boolean`; Bezier optimization is turned on by default.
```

### **disableDeviceInputs**(default`false`): Disable teaching aids

```js
Default `false`, type:` boolean`; teaching aids are enabled by default.
It can be obtained and modified through `room.disableDeviceInputs`.
```

### **disableOperations**: Prohibited operation

```js
Default `false`, type:` boolean`; operation is allowed by default.
All user operations are prohibited, including operation of teaching aids, as well as gesture zooming and moving.
It can be obtained and modified through `room.disableOperations`.
```

### **disableEraseImage**: Prohibit erasing pictures

```js
Whether to prohibit the eraser from deleting all pictures. The default `false`, which allows the eraser to delete the picture (the background picture cannot be erased).
It can be obtained and modified through `room.disableEraseImage`.
```

## RoomCallbacks Parameter Description

### TypeScript signature

```typescript
export type RoomCallbacks = {
    readonly onPhaseChanged?: (phase: RoomPhase) => void;
    readonly onRoomStateChanged?: (modifyState: Partial<RoomState>) => void;
    readonly onDisconnectWithError?: (error: Error) => void;
    readonly onKickedWithReason?: (reason: string) => void;
    readonly willInterceptKeyboardEvent?: (event: KeyboardEvent) => boolean;
    readonly onKeyDown?: (event: KeyboardEvent) => void;
    readonly onKeyUp?: (event: KeyboardEvent) => void;
    readonly onHandToolActive?: (active: boolean) => void;
    readonly onPPTLoadProgress?: (uuid: string, progress: number) => void;
};
```

> `callbacks` itself is an optional parameter, and all its callback methods are also optional. The corresponding method will be called back only when the corresponding event occurs.

> Bold fields in the right directory are recommended implementations.

### **onPhaseChanged**

```typescript

export enum RoomPhase {
    // Connecting
    Connecting = "connecting",
    // Connected server
    Connected = "connected",
    // Reconnecting
    Reconnecting = "reconnecting",
    // Disconnecting
    Disconnecting = "disconnecting",
    // Disconnected
    Disconnected = "disconnected",
}

When the room connection status changes, SDK will call back the API. The specific status is the above string.

Only when the room is in the `connected` state, the room accepts user teaching aid operations. For user experience, it is recommended to handle the status of the connection.
```

### **onRoomStateChanged**

```js
This API is called back when the room status changes.
The `RoomState` returned by this callback contains only the room state fields that have changed.
```

> Please read the [status monitoring](../features/state.md) documentation to learn more.

### onDisconnectWithError

```js
Disconnection due to error
```

### onKickedWithReason

```js
Active kicked by the server
```

### willInterceptKeyboardEvent

```js
Mouse event callback.
Whether to intercept keyboard input events. Returns `true` to intercept keyboard input events. SDK will not process them.
```

### onKeyDown

```js
Keyboard press event callback
```

### onKeyUp

```js
Keyboard up event callback
```

### **onHandToolActive**

```js
Hand tool activation / deactivation callback
```

### **onPPTLoadProgress**

* TypeScript signature
```typescript
(uuid: string, progress: number) => void;
```

```js
ppt preload cache callback, uuid is taskId during ppt conversion, and progress is two decimal places between 0 and 1.
```

> This callback is only useful when the SDK is initialized with `preloadDynamicPPT` set to true

## Recommended reading

1. [Teaching aid operation](../features/tools.md)
1. [Perspective operation](../features/view.md)
1. [Page management](../features/scenes.md)
1. [Status monitoring](../features/state.md)
1. [Whiteboard operation](../features/operation.md)