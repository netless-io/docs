---
id: mini-webview
title: 微信小程序集成
---

## 微信小程序集成白板

- 打开微信小程序开发工具，从菜单栏依次进入【工具】->【项目详情】
- 确保如下选项处于开启状态【不校验合法域名、web-view（业务域名），TLS 版本以及 HTTPS 证书】

![disable-https-check](/screenshot/disable-https-check.png)

- 进入左侧菜单中的 page/index/index.wxml 文件，改变内容为：

``` xml
<!--index.wxml-->
<view class="container">
  <!-- <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
    <block wx:else>
      <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view> -->
  <web-view src="http://www.baidu.com" />
</view>

```

- 保存并使用小程序开发工具重新编译，则在浏览器中显示出白板页面

![mini-finally](/screenshot/mini-finally.png)

## 下一步

可以开发对接音视频服务，构成一个完整的音视频和白板的互动方案

