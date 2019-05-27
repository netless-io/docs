---
id: js-create-room
title: 创建并加入房间
---


本文相关代码，可以在 [Demo](declaration.md#demo) 项目的 `WhiteUtils` 类中查看。

## 1. 安全须知

创建房间/获取房间，需要使用 sdkToken，与 SDK 后端服务器，进行交互。
该 Token，是 SDK 后端服务器，与开发者后端业务服务器通讯的凭证。掌握了这个 Token，SDK 后端服务器就会认为，这是开发者进行的操作。

Example 中，为了演示方便，将创建房间/获取房间 roomToken 操作写在了客户端中，实际业务中，为了防止有人反编译客户端代码，获取 SDKToken，不应该在任何客户端暴露该 Token。
该 Token，应该在开发者的业务服务器代码，或者配置项中。

## 2. 创建新房间，并直接获取 RoomToken

**创建者常用流程**

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
    var sdkToken = "请在 https://console.herewhite.com 中注册，获取 token";
    
    var url = 'https://cloudcapiv4.herewhite.com/room?token=' + sdkToken;
    var requestInit = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            name: '我的第一个 White 房间',
            limit: 100, // 房间人数限制
        }),
    };
    
    
    // 请求创建房间
    fetch(url, requestInit)
        .then(function(response) {
            // Step1: 服务器返回房间唯一标识 uuid 和 进入房间的秘钥 roomToken
            return response.json();
        })
        .then(function(json) {
            // Step2: 加入房间
            return jionRoom(json)
        })
        .then(function(room) {
            // Step3: 加入成功后想白板绑定到指定的 dom 中
            bind(room)
        }).catch(function(err) {
            console.log(err);
        } );
    
    // 加入房间
    function jionRoom (json) {
        // 初始化 SDK，并且调用其成员方法 joinRoom
        var whiteWebSdk = new WhiteWebSdk();
        return whiteWebSdk.joinRoom({
            uuid: json.msg.room.uuid,
            roomToken: json.msg.roomToken,
        });
    }
        
    // 将白板绑定在一个元素上
        
    function bind (room) {
        room.bindHtmlElement(document.getElementById('whiteboard'));
    }

```
<!--TSX/React-->


```tsx
import * as React from "react";
export default class Whiteboard extends React.Component<{}, {}> {
    public constructor(props: {}) {
        super(props);
    }
   	public async componentDidMount(): Promise<void> {
        await this.startJoinRoom();
    }
  	private createRoom = async (): Promise<void> => {
      
    }
    private startJoinRoom = async (): Promise<void> => {
      
    }
    public render(): React.ReactNode {
        return (
            <div>
            </div>
        );
    }
}
    
```

<!--END_DOCUSAURUS_CODE_TABS-->


## 已知房间 UUID，获取房间 RoomToken

**加入者常用流程**

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```javascript
    var sdkToken = "请在 https://console.herewhite.com 中注册，获取 token";
    var uuid = "从业务服务器或者 url 地址中读取";
		// 注意加入房间的 path 为 `room/join` 而创建房间的为 `room`
    var url = `https://cloudcapiv4.herewhite.com/room/join?token=${sdkToken}?uuid=${uuid}`;
    var requestInit = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
    };
    
    
    // 请求加入房间
    fetch(url, requestInit)
        .then(function(response) {
            // Step1: 服务器返回进入房间的秘钥 roomToken
            return response.json();
        })
        .then(function(json) {
            // Step2: 加入房间
            return jionRoom(json)
        })
        .then(function(room) {
            // Step3: 加入成功后想白板绑定到指定的 dom 中
            bind(room)
        }).catch(function(err) {
            console.log(err);
        } );
    
    // 加入房间
    function jionRoom (json) {
        // 初始化 SDK，并且调用其成员方法 joinRoom
        var whiteWebSdk = new WhiteWebSdk();
        return whiteWebSdk.joinRoom({
            uuid: uuid,
            roomToken: json.msg.roomToken,
        });
    }
        
    // 将白板绑定在一个元素上
    function bind (room) {
        room.bindHtmlElement(document.getElementById('whiteboard'));
    }


```
<!--React-->


```jsx
    
```

<!--END_DOCUSAURUS_CODE_TABS-->
