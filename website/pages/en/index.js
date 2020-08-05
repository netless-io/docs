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
                        <a href={`${siteConfig.baseUrl}docs/javascript/overview/js-instruction`}>
                            <div className="home-page-cell-inner">前期准备</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/javascript/quick-start/js-native`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/javascript/parameters/js-sdk`}>
                            <div className="home-page-cell-inner">初始化</div>
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
                        <a href={`${siteConfig.baseUrl}docs/android/overview/android-changelog`}>
                            <div className="home-page-cell-inner">版本历史</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/quick-start/android-declare`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/guides/android-tools`}>
                            <div className="home-page-cell-inner">常用功能</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/android/migration/android-2.9.0`}>
                            <div className="home-page-cell-inner">升级指南</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">iOS</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/ios.svg`}/>
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/ios/overview/ios-changelog`}>
                            <div className="home-page-cell-inner">版本历史</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/quick-start/ios-declare`}>
                            <div className="home-page-cell-inner">快速开始</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/guides/ios-tools`}>
                            <div className="home-page-cell-inner">常用功能</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/ios/migration/ios-2.9.0`}>
                            <div className="home-page-cell-inner">升级指南</div>
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
                        <a href={`${siteConfig.baseUrl}docs/server/api/server-room`}>
                            <div className="home-page-cell-inner">服务端 API</div>
                        </a>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">文档</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/blog.svg`} />
                        </div>
                        <a href={`${siteConfig.baseUrl}docs/faq/oss-config`}>
                            <div className="home-page-cell-inner">配置云存储</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/faq/debug-center`}>
                            <div className="home-page-cell-inner">在线 debug</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/doc/token`}>
                            <div className="home-page-cell-inner">使用说明</div>
                        </a>
                        <a href={`${siteConfig.baseUrl}docs/doc/viewmode`}>
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
