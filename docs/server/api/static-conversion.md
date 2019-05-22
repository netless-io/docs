---
id: server-static-conversion
title: 文档转图片
---

## 发起静态文档转换任务

`POST /services/static-conversion/tasks?token={{token}}`

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
sourceUrl | boolean | 文档源 url |
targetBucket | string | 文档转换后保存结果的目标 bucket |
targetFolder | string | 文档转换后保存结果的目标文件夹 |

关于静态文档转换：
- 用户需要在 console 控制台中注册自己的存储服务，以保证文档转换后的结果能正确输出
- 目前文档转换后的结果图片只支持 png 格式

接口返回结果：
```json
{
    "code": 200,
    "msg": {
        "taskId": "cc880dd5835b43a4844cbf12b3101xxx"
    }
}
```
该接口返回的 taskid 作为当前任务唯一的 id，可以用于查询当前任务进度与转换结果

**注意：该服务需要在 console 控制台配置存储驱动，请联系客户支持团队**

## 查询静态文档转换任务进度

`GET /services/static-conversion/tasks/{{taskid}}/progress?token={{token}}`

接口返回结果：
```json
{
    "code": 200,
    "msg": {
        "task": {
            "convertStatus": "Finished",  // 转换状态
            "reason": "",   // 失败后消息
            "totalPageSize": 3, // 文档总页数
            "convertedPageSize": 3, // 文档已经转换完成页数
            "convertedPercentage": 67, // 文档转换完成百分比
            "staticConversionFileList": [   // 转换结果信息
                {
                    "width": 2338,  // 当页宽度，单位为像素
                    "height": 1652, // 当页高度，单位为像素
                    "conversionFileUrl": "{{targetfolder}/{{taskid}}/1.png"   // 当页图片在用户指定 bucket 中的相对路径
                },
                {
                    "width": 2338,
                    "height": 1652,
                    "conversionFileUrl": "{{targetfolder}/{{taskid}}/2.png"
                },
                {
                    "width": 2338,
                    "height": 1652,
                    "conversionFileUrl": "converting"   // 该页未转换完成时的标志
                }
            ]
        }
    }
}
```
接口说明：

- 返回转换状态 convertStatus 的枚举值为  
    - Waiting（任务排队中）
    - Converting（任务进行中）
    - NotFound（未找到查询任务）
    - Finished（任务已完成）
    - Fail（任务失败）

- 该接口需要用户轮询以及时获取转换进度和信息，由于转换任务需要一定时间，建议轮询间隔为两秒。
- 由于用户指定了保存结果的 bucket，因此该接口返回的文件 url 为 bucket 中的相对路径，前缀需要用户自行拼接
- 转换结果为有序数组，可以按照返回顺序进行渲染
