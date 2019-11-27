/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');

class Index extends React.Component {

    render() {
        const {config: siteConfig} = this.props;
        return (
            <div className="home-page-box">
                <div className="home-page-box-mid">
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">JavaScript</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/javascript.svg`}/>
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/javascript/overview/js-outline`}>
                            <div className="home-page-cell-inner">文档大纲</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/javascript/guide/js-sdk`}>
                            <div className="home-page-cell-inner">安装指南</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/javascript/quick-start/js-precondition`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/javascript/features/js-tools`}>
                            <div className="home-page-cell-inner">功能介绍</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">Android</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/android.svg`}/>
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/android/overview/android-introduction`}>
                            <div className="home-page-cell-inner">产品概述</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/quick-start/android-declare`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/guides/android-state`}>
                            <div className="home-page-cell-inner">常用功能</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/guides/android-v2migration`}>
                            <div className="home-page-cell-inner">升级指南</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">iOS</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/ios.svg`}/>
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/ios/overview/ios-introduction`}>
                            <div className="home-page-cell-inner">产品概述</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/quick-start/ios-declare`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/guides/ios-state`}>
                            <div className="home-page-cell-inner">常用功能</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/guides/ios-v2migration`}>
                            <div className="home-page-cell-inner">升级指南</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">小程序</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/wechat.svg`} />
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/mini/overview/mini-introduction`}>
                            <div className="home-page-cell-inner">产品概述</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/mini/quick-start/mini-declare`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/mini/guides/mini-state`}>
                            <div className="home-page-cell-inner">常用功能</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">Server</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/server.svg`}/>
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/server/overview/server-introduction`}>
                            <div className="home-page-cell-inner">产品概述</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/server/api/server-request`}>
                            <div className="home-page-cell-inner">服务端 API</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">博客</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/blog.svg`} />
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/blog/blog-add-driver`}>
                            <div className="home-page-cell-inner">配置云存储</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/blog/debug-center`}>
                            <div className="home-page-cell-inner">在线 debug</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/blog/blog-begin-netless`}>
                            <div className="home-page-cell-inner">使用说明</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/blog/blog-broadcast`}>
                            <div className="home-page-cell-inner">主播与观众</div>
                        </a>
                    </div>
                </div>
                <div className="home-page-box-banner">
                    {/*<div className="home-page-box-banner-image-box">*/}
                        {/*<img className="home-page-box-banner-image" src={`${siteConfig.baseUrl}img/globe.svg`}/>*/}
                    {/*</div>*/}
                    <div className="home-page-box-banner-btn">
                        <a href="https://netless.link/" target="_blank">
                            <div className="home-page-box-banner-cell">
                                <div className="home-page-box-banner-cell-box">
                                    <img style={{width: 104, marginBottom: 12}} src={`${siteConfig.baseUrl}img/landing.svg`}/>
                                </div>
                                <div className="home-page-box-banner-cell-title">官方网站</div>
                            </div>
                        </a>
                        <a href="https://console.herewhite.com/" target="_blank">
                            <div className="home-page-box-banner-cell">
                                <div className="home-page-box-banner-cell-box">
                                    <img style={{width: 108, marginBottom: 12}} src={`${siteConfig.baseUrl}img/console.svg`}/>
                                </div>
                                <div className="home-page-box-banner-cell-title">管理控制台</div>
                            </div>
                        </a>
                        <a href="https://demo.herewhite.com/#/zh-CN/" target="_blank">
                            <div className="home-page-box-banner-cell">
                                <div className="home-page-box-banner-cell-box">
                                    <img style={{width: 106, marginBottom: 12}} src={`${siteConfig.baseUrl}img/demo.svg`}/>
                                </div>
                                <div className="home-page-box-banner-cell-title">Demo 体验</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Index;
