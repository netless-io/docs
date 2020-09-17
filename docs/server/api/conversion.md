---
id: server-conversion
title: PPT 转换
---
# 转换 API 使用说明

调用转换服务需要涉及三个 api 和两个 token，以下是使用流程说明：

1.使用 sdktoken 调用 [发起文档转换](/docs/server/api/server-conversion/#post-发起文档转换) api，发起文档转换任务并得到 taskuuid

2.使用 sdktoken 和 taskuuid 调用 [生成 Task Token](/docs/server/api/server-token/#post-生成-task-token) api，得到 tasktoken

3.使用 tasktoken 和 taskuuid 调用 [查询任务转换进度](/docs/server/api/server-conversion/#get-查询任务转换进度) api，查询任务进度

由于 sdktoken 的权限过大，我们不建议将 sdktoken 暴露到前端，建议使用 sdktoken 签出 tasktoken，将 tasktoken 传到前端使用，只有拥有 tasktoken 的用户才能查询对应的任务进度。

发起转换以及签出 tasktoken 建议都在后端进行

> 在调用以下 api 之前，请确保您已经在 console 平台上开通了 `文档转网页` 或是 `文档转图片` 服务，否则 api 将会返回错误码 403 : service not enable

## `POST` 发起文档转换

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
| preview | `optional` | `boolean` | 是否需要生成预览图，默认为 false |
| scale | `optional` | `number` | 图片缩放比例，取值 0.1 到 3 之间的范围，默认为 1.2 |
| outputFormat | `optional` | `string` | 输出图片格式，默认为 png，可选参数为 png/jpg/jpeg |

> 注意：只有动态文档转换支持预览图功能，即 type == "dynamic" 时，同时生成预览图需要消耗较长时间，请谨慎选择

> 注意：只有静态文档转换支持缩放功能，即 type == "static" 时，不传为默认值。该值会改变生成的图片大小

> 注意：只有静态文档转换支持自定义输出格式，即 type == "static" 时，不传为 png，jpg 与 jpeg 输出格式都为 jpeg

### <span style="color: #5b908e">Response</span>

#### 201: Created

```json
    {
        "uuid": "2fa009xxxxxxxxxxxxxxxxxca93da2ad",  // task uuid
        "type": "dynamic",  // task 类型，枚举：dynamic, static
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

#### 200: Ok

```json
 {
    "uuid": "2fa009xxxxxxxxxxxxxxxxxca93da2ad",  // task uuid
    "type": "dynamic",  // task 类型，枚举：dynamic, static
    "status": "Waiting",  // task 状态，枚举：Waiting, Converting, Finished, Fail
    "failedReason": "",  // 任务失败后的原因
    "progress": {
        "totalPageSize": 10,  // 转换文档总页数
        "convertedPageSize": 3,  // 已经转换完成的页数
        "convertedPercentage": 30,  // 转换进度百分比
        "convertedFileList": [{  // 转换结果列表
            "width": 1024,  // 当页跨度
            "height": 960,  // 当页高度
            "conversionFileUrl": "xxxx://xxxx.xxx.xx/xxxx.xxx", // 转换结果文件地址
            "preview": "xxxx://xxxx.xxx.xx/xxxx.xxx", // 预览图地址，当发起转换时 body 参数 preview 为 true 且 type 为 dynamic 时该字段才会存在
        },{...}],
        "currentStep": "Extracting" // 当前转换任务步骤，只有 type == dynamic 时才有该字段
    }
}
```

> 由于动态转换步骤较多，我们添加了当前步骤字段，用于表示任务进度，可枚举值有 "Extracting"(资源提取) | "Packaging"(资源打包) | "GeneratingPreview"(生成预览图) | "MediaTranscode"(媒体转码)