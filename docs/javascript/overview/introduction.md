---
id: js-introduction
title: 使用须知
---

白板 sdk 使用 `Typescript` 编写。在部分文档中，会直接解释对应类的 `.d.ts` 中的 API。

## ts 语法提示<span class="anchor" id="declare">

使用 Typescript 开发时，在项目`tsconfig.json`中添加以下配置，即可获得语法提示。

``` json
"compilerOptions": {
    "paths": {
        "*" : ["node_modules/white-web-sdk/types/*"]
    }
}
```

## 运行环境<span class="anchor" id="env">

* 软件

sdk 可以运行在任意支持 es5 的现代浏览器中，兼容性支持可以查看 [ECMAScript 5](https://caniuse.com/#feat=es5)。

* 硬件

sdk 无需任何额外支持，即可运行在 iPad，Surface，Wacom等手写板上。
