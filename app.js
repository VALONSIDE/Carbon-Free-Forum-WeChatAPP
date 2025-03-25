// app.js
App({
  globalData: {
    translations: {}
  },
  
  onLaunch: function() {
    // 加载语言包
    this.loadLanguage();
    // 设置CSS变量
    this.setCSSVariables();
  },
  
  // 设置CSS变量
  setCSSVariables: function() {
    // 在Skyline渲染引擎下，CSS变量已在app.wxss中定义，无需动态设置
    console.log('CSS变量已在app.wxss中定义，无需动态设置');
    // 如果需要切换深色模式，可以通过添加类名实现
    // const pages = getCurrentPages();
    // if (pages.length > 0) {
    //   const currentPage = pages[pages.length - 1];
    //   currentPage.setData({
    //     darkModeClass: this.globalData.darkMode ? 'dark-mode' : ''
    //   });
    // }
  },
  

  
  // 加载语言包
  loadLanguage: function() {
    this.globalData.translations = require('./utils/languages/zh_CN.js');
  },
  
  // 获取翻译文本
  t: function(key) {
    const translations = this.globalData.translations;
    return translations[key] || key;
  }
})
