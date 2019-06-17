---
id: js-scenes
title: 场景管理
---

## 场景预览功能

>该功能目前为 web 端独有。

```Typescript
/**
 * @param  {string} scenePath 想要获取预览内容的场景的场景路径
 * @param  {HTMLElement} div 想要展示预览内容的 div
 * @param  {number} width div 宽度
 * @param  {number} height div 高度
 * @returns void
 */
scenePreview(scenePath: string, div: HTMLElement, width: number, height: number): void;
```

`Room` `Player` 都支持该 API，开发者可以在实时白板和回放中调用此功能。

>该功能无法替代截图，无法导出图片。渲染的内容，调用时，场景的内容，不会实时更新。
预览的位置为用户切换到对应场景时，所见场景。不同用户，所处位置不同，看到的内容也会有存在差异。

## 进阶文档

请查看 [进阶文档-场景管理](/docs/advance/advance-scenes?platform=web)