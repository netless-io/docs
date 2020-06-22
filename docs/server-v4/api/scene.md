---
id: server-scene
title: 场景
---


## `GET` 获取场景地址列表

```bash
https://shunt-api.netless.link/v5/rooms/:uuid/scenes
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token 或 Room Token（只读以上权限） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

#### Query Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| sceneDir | `optional` | `string` | 返回哪个场景组下的场景列表（不填则返回所有场景）|

### <span style="color: #5b908e">Response</span>

#### 200:OK

创建截图成功

```json
   [
        "/init",
        "/6f026653989b4439b32a6899e7d32fed",
        "/b3a423f8caaa4ff688c0e395431776a5"
    ]
```

## `POST` 插入新场景

```bash
    https://shunt-api.netless.link/v5/rooms/:uuid/scenes
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token 或 Room Token（可写权限以上） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| scenes | `required` | `array` | 由 Scene 组成的数组，标明要插入的场景的数据结构。 |
| path | `required` | `string` | 新场景应该插入到那个场景组之中 |

### <span style="color: #5b908e">Response</span>

#### 201: Created

```json
    {}
```

#### 场景类型

```ts
    type Scene = {
        name: string; // 场景名
        ppt?: {
            src: string; // 背景图片的 URL 地址
            width: number; // 背景图片的宽
            height: number; // 背景图片的高
        };
    };
```

## `PATCH` 场景跳转

```bash
https://shunt-api.netless.link/v5/rooms/:uuid/scene-state
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token 或 Room Token（可写以上权限） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 房间的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| scenePath | `required` | `string` | 换到的场景地址 |

### <span style="color: #5b908e">Response</span>

#### 201: Created

创建成功、返回房间描述对象。

```json
    {
    "currentScenePath": [
        "/init"
    ]
}
```
