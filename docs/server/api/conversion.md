---
id: server-conversion
title: PPT 转换
---

## `POST` 发起文档转换

> 在调用以下 api 之前，请确保您已经在 console 平台上开通了 `文档转网页` 或是 `文档转图片` 服务

```bash
https://shunt-api.netless.link/v5/services/conversion/tasks
```

当请求中的 type 为 dynamic 时将调用 文档转网页（动态文档转换）服务，当 type 为 static 时将调用 文档转图片（静态文档转换）服务，请确保调用时对应服务已开通，否则 api 将会报错

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  SDK Token（只读以上权限） |

#### Body Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| resource | `required` | `string` | 转换任务源文件 url |
| type | `required` | `string` | 转换任务类型，枚举：dynamic, static |

### <span style="color: #5b908e">Response</span>

#### 200:OK

```json
    {
        "uuid": "2fa009xxxxxxxxxxxxxxxxxca93da2ad",  // task uuid
        "type": "static",  // task 类型，枚举：dynamic, static
        "status": "Waiting"  // task 状态，枚举：Waiting, Converting, Finished, Fail
    }
```

## `GET` 查询任务转换进度

```bash
    https://shunt-api.netless.link/v5/services/conversion/tasks/:uuid
```

### <span style="color: #5b908e">Request</span>

#### Headers

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| token |`required` | `string` |  Task Token |

#### Path Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| uuid | `required` | `string` | Task uuid |

#### Query Parameters

| Key | 是否必填 | 类型 | 备注 |
| --- | --- | --- | --- |
| type | `required` | `string` | 转换任务类型，枚举：dynamic, static |

### <span style="color: #5b908e">Response</span>

#### 201: Created

```json
 {
    "uuid": "2fa009xxxxxxxxxxxxxxxxxca93da2ad",  // task uuid
    "type": "static",  // task 类型，枚举：dynamic, static
    "status": "Waiting",  // task 状态，枚举：Waiting, Converting, Finished, Fail
    "failedReason": "",  // 任务失败后的原因
    "progress": {
        "totalPageSize": 10,  // 转换文档总页数
        "convertedPageSize": 3,  // 已经转换完成的页数
        "convertedPercentage": 30,  // 转换进度百分比
        "convertedFileList": [{  // 转换结果列表
            "width": 1024,  // 当页跨度
            "height": 960,  // 当页高度
            "conversionFileUrl": "xxxx://xxxx.xxx.xx/xxxx.xxx" // 转换结果文件地址
        },{...}]
    }
}
```
