---
id: js-scenes
title: 页面（场景）管理
---

一个白板房间内，可以存在多个页面，就像`ppt`一样，可以在不同页面绘制不同内容，并进行切换。
>sdk 内部使用`场景(scene)`进行作为定义，开发者以`页面`进行理解即可。

## 页面

### TypeScript 定义

一个白板页面，有`name`,`ppt`两个属性。其中，`ppt`可以为空，`name`如果在初始化时为空，sdk 会自动创建一个名称。

```typescript
//白板页面结构
export type SceneDefinition = {
    //页面名称，如果未定义，sdk 会自动取名
    readonly name?: string;
    //背景图（ppt）结构
    readonly ppt?: PptDescription;
};

//背景图结构
export type PptDescription = {
    //图片网络地址
    readonly src: string;
    //宽高，在白板内部坐标系中长度，背景图中点永远位于白板内部坐标中点
    readonly width: number;
    readonly height: number;
};
```

```javascript
//创建一个白板页面
const scene = {name: "example", ppt: {src: "https://www.example.com/1.png", width: 1080, height: 720}};
```

## 页面新增概念

### 目录——分组管理页面

为了方便管理和操作多个页面，`sdk`支持将`页面`放入在不同`目录`下（类似window/macOS 等桌面操作系统的文件管理系统）。
通过将白板进行分组，可以更有效的管理大量白板。

* 如下为多个页面存在的形式：

```bash
# 初始化房间时，就存在的默认页面。默认在根目录，名称为"init"
/init
# 在 Eng 目录下的页面
/Eng/ppt1
/Eng/ppt2
/Eng/ppt3
# 在 Phy 目录下的页面
/Phy/ppt1
/Phy/ppt2
/Phy/ppt3
```

### 路径——指定特定白板

当存在多个目录，多个白板时，我们就需要用`页面路径`来描述该页面。  
`页面路径`(scenePath)也可以称为`场景路径`。

>`页面路径`=`页面目录`+`页面名称`。  
`页面路径`以"/"分割层级，以"/"开头。最末端的层级，即为`页面名称`。

* 以下即为目录小节中的`页面路径`

```bash
# 在根目录下的各页面路径
"/init"
# 在 Eng 目录下的各页面路径
"/Eng/ppt1"
"/Eng/ppt2"
"/Eng/ppt3"
# 在 Phy 目录下的各页面路径
"/Phy/ppt1"
"/Phy/ppt2"
"/Phy/ppt3"
```

> **页面路径具有唯一性**:  
同一个`页面路径`，会指向同一个`页面`。新建页面时，如果组合出来的`页面路径`已经存在；则新页面，会覆盖旧页面。

### 页面与路径注意点

>**目录与路径不能相同**:  
当白板房间存在一个路径为`/Eng/ppt1`的页面时，说明此时已经存在一个"/Eng"的目录；因此无法把一个`/Eng`的页面，直接插在根目录中，因为此时组成的`页面路径`也是`/Eng`，而白板中已经存在了一个`/Eng`的目录，两者冲突，无法成功插入。

### SceneState 结构 —— 当前目录信息

```typescript
/// Displayer.d.ts
// room player 通用

// 白板当前目录信息
export type SceneState = {
    //同级目录下的所有页面
    readonly scenes: ReadonlyArray<Scene>;
    //当前页面的完整路径
    readonly scenePath: string;
    //当前页面处于同级目录下页面数组的索引位置
    readonly index: number;
};

//页面信息
export type Scene = {
    //页面名称，一定存在，如果创建时没有传，sdk 会自动生成一个随机字符串
    name: string;
    //背景页+笔画数
    componentsCount: number;
    //背景页设置
    ppt?: PptDescription;
};
```

## API

### 获取当前 目录/页面 信息

当前目录信息`sceneState`，存储在`room`以及`player`的`state`。

* 示例代码

```typescript
// room player 通用

let scenceState = room.state.sceneState;
// or let scenceState = player.state.sceneState;

/* scenceState 的数据结构
{
    scenePath: "/Phy/ppt1",
    scenes: [{
        name: "ppt1",
        //（ppt 为可选值，此处都没有 ppt 属性）
    }, {
        name: "ppt2",
        ppt : {
            src: "https://www.example.com/1.png",
            width: 1024,
            height: 768
        }
    }, {
        name: "ppt3",
    }],
    index: 0,
}
*/
```

### 获取当前白板，所有页面信息

>2.7.2 新增 API

该方法可以获取调用时，当前房间全部的场景。返回的数据，会以 {key(场景目录): value(该场景目录下所有的场景)} 字典结构展示。
>该结构不会主动更新，需要插入后，主动再次调用，获取新内容。

```typescript
//displayer.d.ts
export interface Displayer {
    entireScenes(): SceneMap;
}

export type SceneMap = {
    // 场景目录路径: 该目录下的场景列表
    readonly [dirPath: string]: WhiteScene[];
};
```

```javascript
// room player 通用
let allScenes = room.entireScenes();
// 默认房间时，allScenes 状态，key 为场景目录的路径，value 为该场景目录下，所有的场景列表（排列不一定是该目录下的原始顺序）
// {/: [{name: "init", componentsCount: 0, ppt: undefined}]}
```

### 查询特定路径对应内容

> 2.7.0 新增 API

```TypeScript
export enum ScenePathType {
    // 不存在内容
    None = "none",
    // 为页面（场景）目录
    Dir = "dir",
    // 为页面（场景）
    Page = "page",
}
//displayer.d.ts
/* 
 * 传入想要查询的路径地址（以“/”开头），返回该路径对应的内容
 */
scenePathType(path: string): ScenePathType;
```

### 切换页面

`当前页面`为白板房间内，所有用户当前可以操作的`白板`页面。（开发者可以使用`预览`API，让用户观看其他页面，但是无法操作）。

白板房间初始化完成后，会创建一个页面，并将其设置为当前页，该页面在根目录`"/"`下，名称为：`"init"`。

* TypeScript 签名

```typescript
/// room.d.ts
/**
 * 切换当前页面
 * @param scenePath 想要显示页面的完整页面路径，不能是 页面目录
 */
public setScenePath(scenePath: string): void;
```

* 示例代码

```js
//切换至特定页面
room.setScenePath("/Eng/ppt1");
```

#### 注意点

* `setScenePath`没有反应，或者回调中报错，有可能是以下情况：

>1. 路径不合法。请阅读`页面管理`小节，确认`页面路径`符合规范（以`/`开头，结尾为`页面名称`）。
>2. 路径对应的`页面`不存在。
>3. 路径对应的是`页面目录`，而非`页面`。

### 翻页（同目录）

* TypeScript 签名

```typescript
/// room.d.ts
/**
 * 翻页 API（必须与当前页面同一个目录）
 * @param index 想要显示页面在 sceneState.scenes 中的索引
 */
public setSceneIndex(index: number): void;
```

#### 示例代码

```js
//在当前页面中，进行翻页。
room.setSceneIndex(0);
// 数组越界时，会 throw error
room.setSceneIndex(room.state.sceneState.index - 1);
room.setSceneIndex(room.state.sceneState.index + 1);
```

#### 注意点

* `setSceneIndex`报错：

>传入了字符串，或者传入的数字索引，小于或大于等于`room.state.sceneState`长度。

### 插入页面（一个或多个）

```typescript
/// room.d.ts

/**
 * 插入页面数组
 * @param dir 页面目录；传入的路径，没有对应的页面，就会自动新建页面（如果是多个/分割的多级目录，则每一级目录对应的路径，都不能存在对应的页面）。比如 "/ppt/eng"，会先创建 ppt 目录，然后再在 ppt 目录中创建 eng 目录；需要确定 "/ppt" "/ppt/eng" 没有对应的页面。
 * @param scenes 创建的白板页面数组
 * @param index 可选，数组 path 的插入索引位置。undefined 时，则插入该 dir 目录原有 scenes 的后面。
 */
putScenes(dir: string, scenes: ReadonlyArray<SceneDefinition>, index?: number): void;
```

#### 注意点

>1. `dir`参数，不能与现有页面的`路径`重叠。（类比与：无法向`文件`中插入`文件`）  
>2. 当`dir`+ 插入的`scenes`中的`name`，拼接出来的`路径`，与已有的页面`路径`一致时，由于`路径`具有唯一性，新`页面`会覆盖旧`页面`（新文件会覆盖旧文件）。

### 重名、移动页面

```typescript
/// room.d.ts

/**
 * 移动/重命名页面
 *
 * @param source 想要移动的页面的页面 路径
 * @param target 目标路径或者目录。如果是目录，将页面移入该目录中，否则就是移动+重命名效果。
 */
moveScene(source: string, target: string): void;
```

### 删除页面

```typescript
/// room.d.ts
/**
 * 删除页面
 * @param dirOrPath 路径/目录。如果路径，对应页面。如果是目录，则移除该目录下所有页面，以及子目录。
 */
removeScenes(dirOrPath: string): void;
```

* 示例代码

```js
// 删除房间内所有页面
room.removeScenes("/")
```

>房间内必然存在至少一个页面，当删除所有页面后，sdk 会自动在根目录`"/"`下创建一个名为`"init"`的页面，并切换过去。

### 页面预览

```Typescript
///Display.d.ts
// room player 通用

/**
 * 预览功能
 * 
 * @param  {string} scenePath 想要获取预览内容的页面（场景）的页面（场景）路径
 * @param  {HTMLElement} div 想要展示预览内容的 div
 * @param  {number} width div 宽度
 * @param  {number} height div 高度
 * @returns void
 */
scenePreview(scenePath: string, div: HTMLElement, width: number, height: number): void;
```

>预览 API 看到的是当前用户切换到对应页面时，所看到的内容。即保留了当前用户缩放，移动的位置。

### 页面截图

本地截图，存在一定缺陷，推荐使用 [服务器 API —— 封面截图](docs/server/api/server-screenshot/)。
