---
id: server-whiteboard-scenes
title: 场景管理 API
---

## 插入新的场景

场景是个相对抽象的概念，可以是一页 PPT 也可以是一页空白白板，具体可以参考 [场景管理](/docs/javascript/guides/js-scenes)

`POST /rooms/{{uuid}}/scenes`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
basePath | string | 基础文件夹 |
startIndex | number | 插入到当前文件的第几页之后, 0 是插入到第一页之前，1 是第一页和第二页之间，以此类推 |
scenes | scene 数组 | 插入进去一组 scene ，可能对应一组 PPT |

* scene 定义

字段 | 类型 | 描述 |
--  | -- | -- |
name | string | 基础文件夹 |
ppt (可选) | ``` {width: number, height: number, src: string} ```| ppt 的宽、高、路径（路径可以是以 https:// 开头的图片地址，也可以是以 pptx:// 协议开头的动态 ppt 地址） |

* body 样例

``` json
{
	"basePath": "/dir",
	"startIndex": 0,
	"scenes": [
        {
            "name": "ppt1",
            "ppt": {
                "width": 1024,
                "height": 768,
                "src": "https://white-pan.oss-cn-shanghai.aliyuncs.com/101/image/Rectangle.png"
            }
        },
        {
            "name": "ppt2",
            "ppt": {
                "width": 1024,
                "height": 768,
                "src": "https://white-pan.oss-cn-shanghai.aliyuncs.com/101/image/alin-rusu-1239275-unsplash_opt.jpg"
            }
        }
    ]
}
```

**注意：该接口只能输入 room token**

## 更新场景路径

场景可以进行切换，体现在 PPT 上可以实现翻页的效果。

`PUT /rooms/{{uuid}}/scenepath`

* header参数

字段 | 类型 | 描述 |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
path | string | 场景路径 |

* body 样例

``` json
{
	"path": "dir/ppt1"
}
```

**注意：该接口只能输入 room token**
