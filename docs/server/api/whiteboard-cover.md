---
id: server-whiteboard-cover
title: 获取封面 API
---

获取封面是将白板场景转换为图片的服务。
白板场景在转换为图片后可以用于实现缩略图、房间封面等功能。

关于场景的相关介绍可以参考:  [场景管理](/docs/javascript/guides/js-scenes)

## 准备工作

### 1. 根据 [配置云存储](/docs/blog/add-driver) 文章，在 [console](https://console.herewhite.com) 中配置云存储

### 2. 在管理控制台上开启获取封面服务

1. 进入 [console](https://console.herewhite.com)，点击左侧列表中的 <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg> ，进入应用管理页面。

2. 找到 `获取封面` 进行开通

<details>
<summary>**点击展开：console 中操作示意图**</summary>

* 获取封面服务初始状态
![获取封面服务初始状态](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover0.png)

* 获取封面服务管理页面
![获取封面服务管理页面](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover2.png)

* 关闭获取封面服务
![关闭获取封面服务](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover3.png)

</details>

## 特定场景封面

`POST /handle/rooms/single-snapshot`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | number | 封面宽(px) |
height | number | 封面高(px) |
uuid | string | 白板唯一标识符 |
scenePath（可选） | string | 需要读取封面的场景路径（如果不传则返回当前场景的封面图片） |

**注意：该接口只能使用 room token**

* body 例子

```json
{
  "width": 240,
  "height": 180,
  "scenePath": "/init",
  "uuid": "xxxxxx4e96db4e6cb1ce492157xxxxxx"
}
```

* response

```JSON
{
     "code": 200,
    "msg": {
        "image": {
            "url": "url",   // 封面图片 url
            "key": "key", // 封面图片存放在存储服务中的 key
            "bucket": "bucket", // 封面图片存放在存储服务中的 bucket
            "region": "region"  // 封面图片存放在存储服务中的 region
        }
    }
}
```

## 范围内封面

`POST /handle/rooms/snapshots`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | number | 封面宽(px) |
height | number | 封面高(px) |
uuid | string | 白板唯一标识符 |
page （可选）| number | 返回值进行分页号（默认为 1 ）|
size（可选） | number | 返回列表每一页返回的场景截图数量（默认为5，最大为10）|
scenePath | string | 场景组路径 |

* body 例子

```json
{
    "width": 400,
    "height": 400,
    "uuid": "xxxxxx4e96db4e6cb1ce492157xxxxxx",
    "scenePath": "/",
    "page":1,
    "size": 1
}
```

关于分页的说明如下:

用户一次请求的场景截图数量是有限制的，后台会对指定场景组下的场景列表进行分页，返回用户输入 page 和 size 对应的数据，每一页最多返回 10 条数据。

关于场景路径的说明下:

假设用户有场景列表
* /physics/quantum-mechanics/first-chapter
* /physics/newtonian-mechanics
* /english

那么在用户传入 scenePath = "/physics" 后，该接口只会返回

* /physics/newtonian-mechanics
* /physics/relativity-theory

这两条截图数据，同样，在用户传入 scenePath = "/" 后，该接口只会返回 

* /english 

的截图数据

* response

```JSON
{
    "code": 200,
    "msg": [
        {
            "url": "url1",
            "key": "key1",
            "bucket": "bucket",
            "region": "region"
        },
        {
            "url": "url2",
            "key": "key2",
            "bucket": "bucket",
            "region": "region"
        }
    ]
}
```

**注意：该接口只能输入 room token**
