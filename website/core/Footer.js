/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} style={{marginRight: 200}} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
            <div style={{width: 80, marginTop: 16}}>接入即互动</div>
          </a>
          <div>
            <h5>产品</h5>
            <a href={this.docUrl('doc1.html', this.props.language)}>
              管理控制台
            </a>
            <a href={this.docUrl('doc2.html', this.props.language)}>
              官网网站
            </a>
            <a href={this.docUrl('doc3.html', this.props.language)}>
              Demo 体验
            </a>
            <a href={this.docUrl('doc3.html', this.props.language)}>
              Github
            </a>
          </div>
          <div>
            <h5>公司</h5>
            <a href={this.pageUrl('users.html', this.props.language)}>
              关于我们
            </a>
            <a
              href="http://stackoverflow.com/questions/tagged/"
              target="_blank"
              rel="noreferrer noopener">
              加入我们
            </a>
            <a href="https://discordapp.com/">服务条款</a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer noopener">
              隐私协议
            </a>
          </div>
          <div>
            <h5>联系方式</h5>
              <a href="mailto:support@netless.link">
                  support@netless.link
              </a>
            <a href="https://spectrum.chat/netless?tab=posts" target="_blank">社区</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
