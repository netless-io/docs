---
id: server-whiteboard-cover
title: Get cover API
---

Get cover is a service that converts whiteboard scenes into pictures.
Whiteboard scenes can be used to implement functions such as thumbnails and room covers after being converted into pictures.

For more information about scenes, please refer to: [Scene Management](/docs/javascript/guides/js-scenes)

## Ready to work

### 1. According to the [Configure Cloud Storage](/docs/blog/blog-add-driver) article, configure cloud storage in [console](https://console.netless.link)

### 2. Open the Get Cover service on the management console

1. Go to [console](https://console.netless.link), and click to enter the application management page in the list on the left <svg viewBox="64 64 896 896" class="" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg>.

2. Find `Get Cover` to activate

<details>
<summary>**Click to expand: operation diagram in console**</summary>

* Get initial status of cover service
![Get initial status of cover service](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover0.png)

* Get cover service management page
![Get cover service management page](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover2.png)

* Get cover service off
![Get cover service off](https://white-document.oss-cn-hangzhou.aliyuncs.com/netless-doc-images/cover3.png)

</details>

## Specific scene cover

`POST /handle/rooms/single-snapshot`

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
width | number | Cover width(px) |
height | number | Cover Height(px) |
uuid | string | Whiteboard unique identifier |
scenePath（optional） | string | Need to read the scene path of the cover (if not passed, return the cover picture of the current scene) |

**Note: This interface can only use room token**

* body example

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
            "url": "url",   // Cover image url
            "key": "key", // The key for the cover image stored in the storage service
            "bucket": "bucket", // Cover image stored in bucket in storage service
            "region": "region"  // Regions where the cover image is stored in the storage service
        }
    }
}
```

## Cover in scope

`POST /handle/rooms/snapshots`

* header parameter

Field | Type | Description |
--  | -- | -- |
roomToken | string | {{roomtoken}}|

* body parameter

Field | Type | Description |
--  | -- | -- |
width | number | Cover width (px) |
height | number | Cover height (px) |
uuid | string | Whiteboard unique identifier |
page （可选）| number | Return value for pagination (default is 1)|
size（可选） | number | Returns the number of scene screenshots returned on each page of the list (default is 5, maximum is 10)|
scenePath | string | Scene group path |

* body example

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

The instructions on pagination are as follows:

The number of scene screenshots requested by the user at one time is limited. The background page paginates the scene list under the specified scene group and returns the data corresponding to page and size entered by the user. Each page returns up to 10 pieces of data.

About the scene path:

Suppose the user has a list of scenarios
* /physics/quantum-mechanics/first-chapter
* /physics/newtonian-mechanics
* /english

Then after the user passes scenePath = "/ physics", the interface will only return

* /physics/newtonian-mechanics
* /physics/relativity-theory

The two screenshot data, again, the interface will only return after the user passes scenePath = "/"

* /english 

Screenshot data

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

**Note: This interface can only input room token**
