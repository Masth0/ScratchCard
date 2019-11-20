module.exports = {
  theme: '',
  title: ' ScratchCard-js',
  plugins: ['@vuepress/active-header-links'],
  head: [
    { text: 'Home', link: '/' },
  ],
  port: 8088,
  base: '/scratchcard-js/',
  configureWebpack: {},
  themeConfig: {
    search: false,
    logo: '',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Brushes',
        ariaLabel: 'Brushes menu',
        items: [
          { text: 'Spray', link: '/brushes/spray/' },
          { text: 'Circle', link: '/brushes/circle/' },
          { text: 'Brush', link: '/brushes/brush/' },
          { text: 'Html background', link: '/brushes/html-bg/' },
        ]
      },
      { text: 'github', link: 'https://github.com/fluffy-factory/toolbox' },
      { text: 'npm', link: 'https://www.npmjs.com/package/scratchcard-js' },
    ],
  }
};
