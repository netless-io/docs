---
id: js-room
title: 房间参数
---

`room`与`player`实际上，都是内部`displayer`的子类。`TypeScript`签名中，以`///Displayer.d.ts`开头的方法签名，`room`和`player`均可使用。

我们将用户实时使用，并对外同步的房间，称为 **实时房间**（`对应类为 room`）；

## 初始化 API

### TypeScript 方法签名

```typescript
//WhiteWebSdk.d.ts
public joinRoom(params: JoinRoomParams, callbacks: RoomCallbacks = {}): Promise<Room>
```

### 示例代码

```js
whiteWebSdk.joinRoom({
    uuid: json.msg.room.uuid,
    roomToken: json.msg.roomToken,
},
// callback 本身为可选参数，可不传。
{
    onRoomStateChanged: modifyState => {
        console.log(modifyState);
    },
    onPhaseChanged: phase => {
        console.log(phase);
    }
).then(function(room) {
    //实时房间实例
    window.room = room;
}).catch(function(err) {
    //初始化房间失败
    console.log(e);
})
```

## JoinRoomParams 参数说明：

### TypeScript 签名

```typescript
export type JoinRoomParams = {
    readonly uuid: string;
    readonly roomToken: string;
    readonly userPayload?: any;
    readonly isWritable?: boolean;
    readonly disableDeviceInputs?: boolean;
    readonly disableBezier?: boolean;
    readonly cursorAdapter?: CursorAdapter;
    readonly cameraBound?: CameraBound;
    readonly disableEraseImage?: boolean;
    readonly disableOperations?: boolean;
};
```

>除`uuid`,`roomToken`外，其他均为可选参数。右侧目录中加粗字段，为常用设置。

### **uuid**(必须): string

```js
房间表示，同一个房间的人，可以进行互动。
```

### **roomToken**(必须): string

```js
房间鉴权信息。
```

### **userPayload**: 用户信息

```
可以为任意内容，会在 room.state.roomMembers 中体现。
SDK 会将其作为用户的信息，完整传递，不作处理。
```

### **isWritable**: 只读模式 / 可写模式

```
是否以可写模式进入房间（否则为只读模式）。
可写模式进入房间后，可以急性：操作教具、修改房间相关状态等一切将自己的信息同步给房间其他人的操作。
只读模式进入房间后，仅仅只能接收其他人同步的信息，不能操作教具、修改房间状态。
以只读模式进入房间的人无法被其他人察觉，也无法出现在房间成员列表中。
默认是值是 true
```

### cursorAdapter: 鼠标光标显示

```typescript
//处理用户信息(`userPayload`)与用户头像div之间的映射关系。
//需要实现该接口
export interface CursorAdapter {
    createCursor(memberId: number): CursorDescription & {readonly reactNode?: any};
    onAddedCursor?(cursor: Cursor): void;
    onRemovedCursor?(cursor: Cursor): void;
}

//头像
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

//头像描述
export type CursorDescription = {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
};
```

>该参数配合`userPayload`可以显示用户鼠标所在位置。

你可以使用如下代码自定义鼠标光标。

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
        // 其中 iconURL、color 应该由用户自定义到 payload 中
        var payload = roomMember.payload;
        var cursorElement = createCursorElement(payload.iconURL, payload.color);
        cursor.divElement.append(cursorElement);
        break;
      }
    }
  },
  onRemovedCursor: function(cursor) {
    // 清理工作
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
    // userPayload 可以根据业务自行自定义
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
缩放范围限制，可以同时限制最大最小缩放比例，以及移动等范围，并且与白板页面中背景图相关联。
```

### disableBezier: 贝塞尔优化开关

```js
默认`false`，类型:`boolean`；默认打开贝塞尔优化。
```

### **disableDeviceInputs**(默认`false`): 禁用教具

```js
默认`false`，类型:`boolean`；默认启用教具。
可以通过`room.disableDeviceInputs`进行获取，修改。
```

### **disableOperations**: 禁止操作

```js
默认`false`，类型:`boolean`；默认允许操作。
禁止用户所有操作，包括教具操作，以及手势缩放，移动。
可以通过`room.disableOperations`进行获取，修改。
```

### **disableEraseImage**: 禁止擦除图片

```js
是否禁止橡皮擦删除所有图片。默认`false`，即允许橡皮擦删除图片（无法擦除背景图）。
可以通过`room.disableEraseImage`进行获取，修改。
```

## RoomCallbacks 参数说明

### TypeScript 签名

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

>`callbacks`本身为可选参数，其所有回调方法，也是可选。只有出现对应事件时，才会回调对应的方法。

>右侧目录中加粗字段，为推荐实现。

### **onPhaseChanged**

```typescript

export enum RoomPhase {
    //正在连接
    Connecting = "connecting",
    //已连接服务器
    Connected = "connected",
    //正在重连
    Reconnecting = "reconnecting",
    //正在断开连接
    Disconnecting = "disconnecting",
    //连接中断
    Disconnected = "disconnected",
}

房间连接状态发生改变时，sdk 会回调该 API。具体状态为以上字符串。

仅当房间处于`connected`状态时，房间接受用户教具操作。为了用户体验，推荐对连接中状态进行处理。
```

### **onRoomStateChanged**

```js
房间状态发生改变时，会回调该 API。
该回调返回的`RoomState`只包含发生变化的房间状态字段。
```

>请阅读[状态监听](../features/state.md)文档，了解更多内容。

### onDisconnectWithError

```js
由于错误，导致中断连接
```

### onKickedWithReason

```js
被服务器主动踢房间
```

### willInterceptKeyboardEvent

```js
鼠标事件回调。
是否拦截键盘输入事件，返回`true`表示拦截键盘输入事件，sdk 将不做处理。
```

### onKeyDown

```js
键盘按下事件回调
```

### onKeyUp

```js
键盘抬起事件回调
```

### **onHandToolActive**

```js
抓手工具激活/取消回调
```

### **onPPTLoadProgress**

* TypeScript 签名
```typescript
(uuid: string, progress: number) => void;
```

```js
ppt 预加载缓存回调，uuid 为 ppt 转换时的 taskId，progress 为 0~1 之间的两位小数。
```

>只有在初始化 SDK 时，`preloadDynamicPPT`，设置为 true 时，该回调才有用。

### **onPPTMediaPlay**

* TypeScript 签名
```typescript
(shapeId: string, type: "video" | "audio") => void;
```

```js
ppt 内的媒体文件播放时的回调，其中 shapeId 代表媒体在 ppt 中当前页面的唯一 id
```

### **onPPTMediaPause**

* TypeScript 签名
```typescript
(shapeId: string, type: "video" | "audio") => void;
```

```js
ppt 内的媒体文件停止时的回调，其中 shapeId 代表媒体在 ppt 中当前页面的唯一 id
```

### **onPPTMediaPlayError**

* TypeScript 签名
```typescript
(shapeId: string, type: "video" | "audio", error: Error) => void;
```

```js
ppt 内的媒体文件在调用 play() 时的错误回调，其中 shapeId 代表媒体在 ppt 中当前页面的唯一 id
```

>由于在实际应用中经常会出现中途加入的用户需要自动播放媒体文件的场景，这时候当用户没有与网页进行交互时调用 play() 方法会报 NotAllowedError，这种场景需要用户自行处理

## 推荐阅读

1. [教具操作](../features/tools.md)
1. [视角操作](../features/view.md)
1. [页面管理](../features/scenes.md)
1. [状态监听](../features/state.md)
1. [白板操作](../features/operation.md)