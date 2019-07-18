---
id: server-whiteboard-cover
title: 获取封面
---

## 特定页面封面

### v1.0 版本

`POST /handle/room/snapshot?token={{token}}`

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | string | 封面宽 |
height | string | 封面高 |
uuid | string | 白板唯一标识符 |
scene（可选） | number | 白板页面位置（默认当前页） |

### v2.0 版本

`POST /handle/rooms/single-snapshot?roomToken={{roomtoken}}`

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | string | 封面宽 |
height | string | 封面高 |
uuid | string | 白板唯一标识符 |
scenePath（可选） | string | 需要读取封面的路径（默认当前页） |

关于 scene path 的介绍可以参考:  [场景管理](https://developer.herewhite.com/docs/advance/advance-scenes)

**注意：该接口只能输入 room token**

**注意：需要在 console 配置存储驱动，请联系客户支持团队**

## 范围内封面

### v1.0 版本

`POST /handle/room/snapshot/range?token={{token}}`

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | string | 封面宽 |
height | string | 封面高 |
uuid | string | 白板唯一标识符 |
start | number | 截取页面的开始 index |
end | number | 截取页面的结束 index |

**注意：需要在 console 配置存储驱动，请联系客户支持团队**

### v2.0 版本

`POST /handle/rooms/snapshots?roomToken={{roomtoken}}`

* body 参数

字段 | 类型 | 描述 |
--  | -- | -- |
width | string | 封面宽 |
height | string | 封面高 |
uuid | string | 白板唯一标识符 |
page （可选）| number | 返回值进行分页号（默认为 1 ）|
size（可选） | number | 返回列表每一页返回的场景截图数量（默认为5，最大为10）|
scenePath | string | 场景组路径 |

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

**注意：该接口只能输入 room token**

**注意：需要在 console 配置存储驱动，请联系客户支持团队**
