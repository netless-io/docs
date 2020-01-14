---
id: server-whiteboard-scenes
title: Scene management API
---

## Insert new scene

Scene is a relatively abstract concept, which can be a page of PPT or a blank whiteboard. For details, please refer to [Scene Management](/docs/javascript/guides/js-scenes)

`POST /rooms/{{uuid}}/scenes`

* Header parameter

Field | Type | Description |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
basePath | string | base folder |
startIndex | number | After the first few pages of the current file, 0 is inserted before the first page, 1 is between the first and second pages, and so on |
scenes | scene array | Inserted into a set of scenes, which may correspond to a set of PPT |

* scene definition

Field | Type | Description |
--  | -- | -- |
name | string | base folder |
ppt (optional) | ``` {width: number, height: number, src: string} ```| ppt width, height, path (path can be a picture address that starts with https: // or a dynamic ppt address that starts with the pptx: // protocol) |

* body sample

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

**Note: This interface can only enter room token**

## Update scene path

Scenes can be switched to reflect the effect of turning pages on PPT.

`PUT /rooms/{{uuid}}/scenepath`

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
path | string | scene path |

* body sample

``` json
{
	"path": "dir/ppt1"
}
```

**Note: This interface can only enter room token**
