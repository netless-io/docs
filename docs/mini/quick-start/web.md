---
id: mini-web
title: Web 项目开发服务器
---

## Web 本地服务器

- 参考 [Web 白板项目](../../javascript/quick-start/prepare.md) 创建一个简单的 web 白板。
- 进入到包含 index.html 的页面
    - 如果本地装有 node (npm >= 5.2.0)环境：执行 ```npx serve -l 5000``` 命令
    - 如果本地装有 python 环境：执行 ```python -m SimpleHTTPServer 5000```
- 这时确保访问 {局域网IP}:5000/index.html 会显示刚才的白板

> 例如使用 ```npx serve -l 5000``` 显示如下，其中 http://192.168.2.200:5000 为局域网 IP
![npx](/screenshot/npx.png)