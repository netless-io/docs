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
                <div className="home-page-box-banner">
                    <div className="home-page-box-banner-image-box">
                        <img className="home-page-box-banner-image" src={`${siteConfig.baseUrl}img/globe.svg`}/>
                    </div>
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
                <div className="home-page-box-mid">
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">JavaScript</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/javascript.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">产品概述</div>
                        <div className="home-page-cell-inner">快速开始</div>
                        <div className="home-page-cell-inner">常用功能</div>
                        <div className="home-page-cell-inner">升级指南</div>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">Android</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/android.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">产品概述</div>
                        <div className="home-page-cell-inner">快速开始</div>
                        <div className="home-page-cell-inner">常用功能</div>
                        <div className="home-page-cell-inner">升级指南</div>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">iOS</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/ios.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">产品概述</div>
                        <div className="home-page-cell-inner">快速开始</div>
                        <div className="home-page-cell-inner">常用功能</div>
                        <div className="home-page-cell-inner">升级指南</div>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">Server</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/server.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">产品概述</div>
                        <div className="home-page-cell-inner">服务端 API</div>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">高级功能</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/features.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">场景管理</div>
                        <div className="home-page-cell-inner">主播与观众</div>
                    </div>
                    <div className="home-page-cell">
                        <div className="home-page-cell-title">博客</div>
                        <div className="home-page-cell-icon">
                            <img src={`${siteConfig.baseUrl}img/blog.svg`}/>
                        </div>
                        <div className="home-page-cell-inner">回放功能</div>
                        <div className="home-page-cell-inner">接入准备</div>
                        <div className="home-page-cell-inner">白板介绍</div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Index;
