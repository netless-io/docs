/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/quick-start-site/img/image.jpg'.
    image: '/img/undraw_open_source.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Netless', // Title for your website.
  tagline: 'Netless Developer Document',
  url: 'https://developer.netless.link', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/quick-start-site/',

  // Used for publishing and more
  projectName: 'netless',
  organizationName: 'netless',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'javascript/overview/js-introduction', label: 'JavaScript'},
    {doc: 'android/overview/android-introduction', label: 'Android'},
    {doc: 'ios/overview/ios-introduction', label: 'iOS'},
    {doc: 'mini/overview/mini-introduction', label: '小程序' },
    {doc: 'server/overview/server-introduction', label: 'Server'},
    {doc: 'blog/blog-glossary', label: '博客'},
    {
        href: 'https://github.com/netless-io',
        label: 'GitHub',
    },
  ],
  algolia: {
      apiKey: 'c438dda9f510a0e984c1e0582e03fa62',
      indexName: 'netless',
      algoliaOptions: {},
  },

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/netless.svg',
  footerIcon: 'img/netless.svg',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#5b908e',
    secondaryColor: '#3f6463',
  },
  blogSidebarTitle: { default: '最近的帖子', all: '所有帖子' },
  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */
  // usePrism: ["json"],
  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Netless`,
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'vs2015',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://www.googletagmanager.com/gtag/js?id=UA-143392347-1',
    '/js/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js',
    "/js/analytic.js",
    "/js/spec-code.js"
  ],
  stylesheets: ['/css/code-block-buttons.css'],
  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',
  scrollToTop: true,
  scrollToTopOptions: {
      zIndex: 100,
  },

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,
  docsSideNavCollapsible: false,
  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
