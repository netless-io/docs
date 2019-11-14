---
id: js-room
title: 房间参数
---

## 初始化 API

### TypeScript 方法签名

```typescript
//WhiteWebSdk.d.ts
joinRoom(params: JoinRoomParams, callbacks: RoomCallbacks = {}): Promise<Room>
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

### cursorAdapter: 头像显示

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
    //TODO:后续推出
    //readonly onPPTLoadProgress?: (uuid: string, progress: number) => void;
};
```

>`callbacks`本身为可选参数，其中所有方法也是可选。

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

>请阅读[状态管理]文档，了解更多关于房间状态管理实现。

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
是否拦截键盘输入事件，返回`true`表示拦截键盘输入事件。
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

### TODO:**onPPTLoadProgress**

>即将推出
```js
动态 ppt 加载事件进度
```