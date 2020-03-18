---
id: js-sdk
title: SDK install
---

## SDK

1. [white-web-sdk](https://www.npmjs.com/package/white-web-sdk)
    * Recommended for non-React framework development
1. [white-react-sdk](https://www.npmjs.com/package/white-react-sdk)
    * React framework development (depending on white-web-sdk, no need to repeat installation)

`white-web-sdk` is the same as `white-react-sdk` version, and it is published at the same time every time.

## How to install

### 1. Package management tool integration

<!--DOCUSAURUS_CODE_TABS-->
<!--Develop with js sdk-->

Add dependency:

```shell
# yarn
yarn add white-web-sdk
# npm
npm install white-web-sdk --save
```

Code：

```javascript
import "white-web-sdk/style/index.css";
import {WhiteWebSdk} from 'white-web-sdk';
```

<!--Developing with react-sdk-->
Add dependency:

```shell
# yarn
yarn add white-react-sdk
# npm
npm install white-react-sdk --save
```

Code：

```javascript
import * as React from "react";
import "white-web-sdk/style/index.css";
import {Room, RoomPhase, RoomWhiteboard, WhiteWebSdk} from "white-react-sdk";
````

<!--END_DOCUSAURUS_CODE_TABS-->

### 2. script tag integration

```html
<link rel="stylesheet" href="https://sdk.herewhite.com/white-web-sdk/2.7.0.css">
<script src="https://sdk.herewhite.com/white-web-sdk/2.7.0.js"></script>
<script>
    //Global variables WhiteWebSdk
    let sdk = new WhiteWebSdk();
</script>
```

## TypeScript support

When using `TypeScript`, add the following configuration to the project `tsconfig.json` to get syntax tips.

```json
{
    "compilerOptions": {
        "skipLibCheck": true,
        "paths": {
            "*" : ["node_modules/white-web-sdk/types/*"]
        }
    }
}
```

## Recommended reading

1. [Open source](./open-source.md)
2. [Quick Start-Prerequisites](../quick-start/precondition.md)
3. [Quick Start-Authentication](../quick-start/token.md)
4. [Quick start-sdk](./quick-start/sdk.md)
