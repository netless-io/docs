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
            <div style={{width: 80, marginTop: 16}}>Let's interactive.</div>
          </a>
          <div>
            <h5>Product</h5>
            <a target="_blank" href="https://console.netless.link/">
              Console
            </a>
            <a target="_blank" href="https://netless.link/">
              Homepage
            </a>
            <a target="_blank" href="https://demo-rtc.herewhite.com/#/">
              Demo
            </a>
            <a target="_blank" href="https://github.com/netless-io">
              Github
            </a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="mailto:hr@herewhite.com">
              Join us
            </a>
            <a target="_blank" href="https://netless.link/zh-CN/service/">Service</a>
            <a
              href="https://netless.link/zh-CN/privacy/"
              target="_blank">
              Privacy
            </a>
          </div>
          <div>
            <h5>Contact</h5>
              <a href="mailto:support@netless.link">
                  support@netless.link
              </a>
            <a href="https://spectrum.chat/netless?tab=posts" target="_blank">Community</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
