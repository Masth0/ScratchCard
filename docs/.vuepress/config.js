module.exports = {
  theme: '',
  title: ' ScratchCard',
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
          { text: 'Circle', link: '/brushes/circle/' },
        ]
      },
      { text: 'github', link: 'https://github.com/fluffy-factory/toolbox' },
    ],
  }
};
