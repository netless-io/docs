---
id: server-screenshot
title: 截图
---

> 在调用以下 api 之前，请确保您已经在 console 平台上开通了截图服务功能

## `POST` 获取指定场景截图

```bash
https://shunt-api.netless.link/v5/rooms/:uuid/screenshots
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

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| width | `required` | `number` | 获取截图的宽度，单位为像素 |
| height | `required` | `number` | 获取截图的高度，单位为像素 |
| path | `optional` | `string` | 需要截图的场景路径，以“/”开头，如果不传，默认获取"/init"场景的截图 |

### <span style="color: #5b908e">Response</span>

#### 201: Created

创建截图成功

```json
   {
        "url": "http://xxxxxx.com/xxx/xxx.png",
        "key": "xxx/xxx.png",        // 封面图片存放在存储服务中的 key
        "bucket": "your-bucket",     // 封面图片存放在存储服务中的 bucket
        "region": "your-region"      // 封面图片存放在存储服务中的 region
    }
```

## `POST` 获取指定场景路径下的场景截图

```bash
https://shunt-api.netless.link/v5/rooms/:uuid/screenshot-list
```

> 该 api 只会返回假设用户有场景列表:
>
> - /physics/quantum-mechanics/first-chapter
> - /physics/newtonian-mechanics
> - /english
> 那么在用户传入 scenePath = "/physics" 后，该接口只会返回
> - /physics/newtonian-mechanics
> - /physics/relativity-theory
> 这两条截图数据。同样，在用户传入 scenePath = "/" 后，该接口只会返回
> - /english

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token 或 Room Token（只读以上权限） |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | 转换任务的 UUID |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| width | `required` | `number` | 获取截图的宽度，单位为像素 |
| height | `required` | `number` | 获取截图的高度，单位为像素 |
| path | `required` | `string` | 需要截图的场景路径，以“/”开头 |

### <span style="color: #5b908e">Response</span>

#### 201: Created

创建成功、返回房间描述对象。

```json
    [{
    "url": "http://xxxxxx.com/xxx/xxx.png",
    "key": "xxx/xxx.png",        // 封面图片存放在存储服务中的 key
    "bucket": "your-bucket",     // 封面图片存放在存储服务中的 bucket
    "region": "your-region"      // 封面图片存放在存储服务中的 region
    },{
        ...
    }]
```
