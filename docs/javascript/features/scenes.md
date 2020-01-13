---
id: js-scenes
title: Page (scene) management
---

There can be multiple pages in a whiteboard room. Just like `ppt`, you can draw different content on different pages and switch between them.
> sdk uses `scene` for definition, developers can understand it with` page`

## Page

### TypeScript definition

A whiteboard page with `name` and` ppt` attributes. Among them, `ppt` can be empty, if` name` is empty during initialization, SDK will automatically create a name.

```typescript
// Whiteboard page structure
export type SceneDefinition = {
    // Page name, if not defined, sdk will automatically name it
    readonly name?: string;
    // Background image (ppt) structure
    readonly ppt?: PptDescription;
};

// Background image structure
export type PptDescription = {
    // Picture web address
    readonly src: string;
    // Width and height, the length in the internal coordinate system of the whiteboard, the point in the background image is always at the midpoint of the internal coordinates of the whiteboard
    readonly width: number;
    readonly height: number;
};
```

```javascript
// Create a whiteboard page
const scene = {name: "example", ppt: {src: "https://www.example.com/1.png", width: 1080, height: 720}};
```

## New concepts in pages

### Directory-Group Management Page

In order to facilitate the management and operation of multiple pages, `sdk` supports putting` pages` in different `directories` (similar to file management systems of desktop operating systems such as window / macOS).
By grouping whiteboards, you can more effectively manage a large number of whiteboards.

* The following is the form in which multiple pages exist:

```bash
# The default page exists when the room is initialized. Defaults to the root directory, named "init"
/init
# Pages in the Eng directory
/Eng/ppt1
/Eng/ppt2
/Eng/ppt3
# Pages in the Phy directory
/Phy/ppt1
/Phy/ppt2
/Phy/ppt3
```

### Path-specify a specific whiteboard

When there are multiple directories and multiple whiteboards, we need to use `page path` to describe the page.
`Page path` (scenePath) can also be called` scene path`.

>`Page path` = `Page directory` + `Page name`。  
`Page path` starts with "/" and starts with "/". The last level is `Page name`。

* The following is the page path in the directory section

```bash
# Path to each page in the root directory
"/init"
# Paths to pages in the Eng directory
"/Eng/ppt1"
"/Eng/ppt2"
"/Eng/ppt3"
# Path to each page in the Phy directory
"/Phy/ppt1"
"/Phy/ppt2"
"/Phy/ppt3"
```

> **Page path is unique**:  
The same `page path` will point to the same` page`. When creating a new page, if the combined `Page Path` already exists; the new page will overwrite the old page.

### Page and path note

>**Directory and path cannot be the same**:  
When there is a page with the path `/ Eng / ppt1` in the whiteboard room, it means that a directory of“ / Eng ”already exists at this time; therefore, a page of` / Eng` cannot be inserted directly into the root directory because this The `Page Path` formed at that time is also` / Eng`, and a `/ Eng` directory already exists in the whiteboard. The two conflict and cannot be successfully inserted.

### SceneState structure-current directory information

```typescript
/// Displayer.d.ts
// room player for public use

// Whiteboard current directory information
export type SceneState = {
    // All pages in the same directory
    readonly scenes: ReadonlyArray<Scene>;
    // The full path of the current page
    readonly scenePath: string;
    // The current page is at the index position of the page array in the same directory
    readonly index: number;
};

// Page information
export type Scene = {
    // The page name must exist. If it is not passed during creation, SDK will automatically generate a random string.
    name: string;
    // Background page + Number of strokes
    componentsCount: number;
    // Background page settings
    ppt?: PptDescription;
};
```

## API

### Get current directory / page information

The current directory information `sceneState` is stored in` room` and `state` of` player`.

* Sample code

```typescript
// room player pblic for use

let scenceState = room.state.sceneState;
// or let scenceState = player.state.sceneState;

/* scenceState data structure
{
    scenePath: "/Phy/ppt1",
    scenes: [{
        name: "ppt1",
        //(Ppt is optional, there is no ppt attribute here)
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

### Switch pages

`Current page` is the` Whiteboard` page that all users can currently operate in the whiteboard room. (Developers can use the `Preview` API to let users view other pages, but they cannot do so).

After the initialization of the whiteboard room is complete, a page will be created and set as the current page. The page is under the root directory "" / "`, and its name is: "" init "`.

* TypeScript signature

```typescript
/// room.d.ts
/**
 * Switch the current page
 * @param scenePath The full page path of the page you want to display, not the page directory想要显示页面的完整页面路径，不能是 页面目录
 */
public setScenePath(scenePath: string): void;
```

* Sample code

```js
// Switch to a specific page
room.setScenePath("/Eng/ppt1");
```

#### Note

* `setScenePath` is not responding, or an error is reported in the callback. It may be the following:

> 1. The path is illegal. Please read the `Page Management` section and confirm that the` Page Path` complies with the specification (begins with `/` and ends with `Page Name`).
> 2. The `Page` corresponding to the path does not exist.
> 3. The path corresponds to `Page Directory`, not` Page`.

### Page turning (same directory)

* TypeScript signature

```typescript
/// room.d.ts
/**
 * Page turning API (must be in the same directory as the current page)
 * @param index Want to display the index of the page in sceneState.scenes
 */
public setSceneIndex(index: number): void;
```

#### Sample code

```js
// In the current page, turn the page.
room.setSceneIndex(0);
// When the array is out of bounds, it throws an error
room.setSceneIndex(room.state.sceneState.index - 1);
room.setSceneIndex(room.state.sceneState.index + 1);
```

#### Note

* `setSceneIndex` error：
> The string or numeric index passed in is less than or equal to the length of `room.state.sceneState`.

### Insert page (one or more)

```typescript
/// room.d.ts

/**
 * Insert page array
 * @param dir Page directory; the incoming path, if there is no corresponding page, a new page will be automatically created (if it is a multiple / divided multi-level directory, there must be no corresponding page in the path corresponding to each level of directory). For example, "/ ppt / eng" will create the ppt directory first, and then create the eng directory in the ppt directory; you need to make sure that there is no corresponding page for "/ ppt" "/ ppt / eng".
 * @param scenes Array of whiteboard pages created
 * @param index Optional, the insertion index position of the array path. When undefined, it is inserted after the original scenes in the dir directory.
 */
putScenes(dir: string, scenes: ReadonlyArray<SceneDefinition>, index?: number): void;
```

#### Note

>1. The `dir` parameter cannot overlap the` path` of an existing page. (Analogous with: Cannot insert `file` into` file`)
>2. When the `name` in the` scenes` inserted by `dir` and the` path` spliced ​​out are consistent with the existing `path` of the page, because the` path` is unique, the new `page` will cover the old` `(New files overwrite old files).

### Duplicate name, mobile page

```typescript
/// room.d.ts

/**
 * Move / rename page
 *
 * @param source Page path of the page you want to move
 * @param target Destination path or directory. If it is a directory, move the page into the directory, otherwise it is a rename effect.
 */
moveScene(source: string, target: string): void;
```

### Delete page

```typescript
/// room.d.ts
/**
 * Delete page
 * @param dirOrPath Path / directory. If path, corresponding page. If it is a directory, remove all pages and subdirectories under the directory.
 */
removeScenes(dirOrPath: string): void;
```

* Sample code

```js
// Delete all pages in the room
room.removeScenes("/")
```

> There must be at least one page in the room. When all pages are deleted, SDK will automatically create a page named `init` in the root directory` / `and switch over.

### Page preview

```Typescript
///Display.d.ts
// room player use for public

/**
 * Preview function
 * 
 * @param  {string} scenePath Page (scene) path of the page (scene) where you want to get preview content
 * @param  {HTMLElement} div The div that wants to display preview content
 * @param  {number} width div width
 * @param  {number} height div height
 * @returns void
 */
scenePreview(scenePath: string, div: HTMLElement, width: number, height: number): void;
```

> What the preview API sees is what the current user sees when switching to the corresponding page. That is, the current user zoom and move positions are retained.

### Page screenshot

Local screenshot, there are certain defects, it is recommended to use [Server API -> cover screenshot](server/api/whiteboard-cover.md)。