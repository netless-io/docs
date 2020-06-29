---
id: js-react
title: React
---

本章介绍使用 React 以及相关工具接入 White SDK，并开发一个互动白板应用。阅读本章前，你需要对 JavaScript 和 React 有基本了解。

> 在此之前，你需要在 Netless 的管理控制台注册一个企业账号，并创建一个应用。然后获取此应用中的 `App Identifier` 和，并生成此应用的 `SDK Token`。

## 准备工作

你可以阅读[《应用与权限》](https://developer.netless.link/documents/guan-li-kong-zhi-tai/applications-and-authority)来了解具体操作。成功之后，你会获得如下内容。

```text
# App Identifier:
-_-AcIBWEeqEdX1jHT9ZPg/i25mN7NEhbum6g

# SDK Token:
NETLESSSDK_YWs9UU9JSkJobEZfYlBPLXdNeSZub25jZT0xNTg3MDkyMzUxMTQ0MDAmcm9sZT0wJnNpZz1mYmUzOTI3MjhkZmVhNTc4MzllZTdhNWQ3N2RhZjdjNjkyZmUwNzk1Y2M2MGFhMzE1Y2YxZDY1YmMxODkxNmRi
```

这段内容只是举个例子。你需要亲自操作获取自己的内容。

## 启动项目

我们将使用 `create-react-app` 这个库启动一个 React 项目。打开 Terminal，切换到合适的文件夹中，执行如下命令。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```bash
# npm init <initializer> 在 npm 6+ 中可用
$ npm init react-app my-board
```

<!--npx-->

```bash
# npx 来自 npm 5.2+ 或更高版本
$ npx create-react-app my-board
```

<!--yarn-->

```bash
# yarn create 在 Yarn 0.25+ 中可用
$ yarn create react-app my-board
```

<!--END_DOCUSAURUS_CODE_TABS-->

执行完毕后，会在当前目录中创建一个名为 `my-board` 的目录。在该目录中，它将生成初始项目结构并安装依赖项：

```text
my-board
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
```

## 安装

进入到 `my-board` 文件夹中，在 Terminal 中执行如下命令。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```bash
npm install white-react-sdk
```

<!--yarn-->

```bash
yarn add white-react-sdk
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 实现互动白板应用

用编辑器打开 `my-board/src/App.js` 文件，在该文件中加入更多代码，直到写完互动白板应用的全部业务逻辑代码。

> 记得将下列代码的第 9 行和第 11 行替换成你提前准备好的内容

```javascript
import './App.css';

import React from 'react';
import { WhiteWebSdk, RoomWhiteboard } from "white-react-sdk";

class App extends React.Component {

    static sdkToken = "阅读《应用与权限》获取 SDK Token";
    static whiteWebSdk = new WhiteWebSdk({
        appIdentifier: "阅读《应用与权限》获取 AppIdentifier",
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var self = this;
        var roomUUID = "";

        this.createRoom().then(function(roomJSON) {
            // 房间创建成功，获取描述房间内容的 roomJSON
            roomUUID = roomJSON.uuid;
            return self.createRoomToken(roomUUID);

        }).then(function (roomToken) {
            // 房间的 roomToken 已签出
            return App.whiteWebSdk.joinRoom({
                uuid: roomUUID,
                roomToken: roomToken,
            });
        }).then(function(room) {
            self.setState({room: room});

        }).catch(function(err) {
            // 创建房间失败
            console.error(err);
        });
    }

    createRoom() {
        var url = "https://shunt-api.netless.link/v5/rooms";
        var requestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "token": App.sdkToken,
            },
        };
        return window.fetch(url, requestInit).then(function(response) {
            return response.json();
        });
    }

    createRoomToken(roomUUID) {
        var url = "https://shunt-api.netless.link/v5/tokens/rooms/" + roomUUID;
        var requestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "token": App.sdkToken,
            },
            body: JSON.stringify({
                "lifespan": 0, // 表明 Room Token 永不失效
                "role": "admin", // 表明 Room Token 有 Admin 的权限
            }),
        };
        return window.fetch(url, requestInit).then(function(response) {
            return response.json();
        });
    }

    render() {
        var whiteboardView = null;

        // 创建并加入房间是一个异步操作。
        // 如果 this.state.room 还没准备好，则不显示白板。
        if (this.state.room) {
            whiteboardView = (
                <RoomWhiteboard room={this.state.room}
                                style={{
                                    width: "100%",
                                    height: "100vh",
                                }}/>
            );
        }
        return (
            <div className="App">
                {whiteboardView}
            </div>
        );
    }
}

export default App;
```

## 运行

在 `my-board` 文件夹下打开 Terminal，执行如下命令启动 React 应用。

<!--DOCUSAURUS_CODE_TABS-->
<!--npm-->

```bash
npm start
```

<!--yarn-->

```bash
yarn start
```

<!--END_DOCUSAURUS_CODE_TABS-->

当应用启动成功后，会自动打开浏览器，并访问 `http://localhost:3000` 这个网页。如果浏览器没有自动打开这个网页，你也可以手动打开浏览器访问这个地址。一切顺利的画，你将看到一个空白页面。用鼠标在该页面上写写画画，若一切顺利，可以看到笔迹。

![js-native](/img/js-native-view.png)
