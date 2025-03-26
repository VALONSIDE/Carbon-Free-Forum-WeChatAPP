// app.js
App({
  globalData: {
    translations: {},
    envId: 'cloud1-2go4otwj32566b98' // 修改为正确的云环境ID
  },
  
  onLaunch: function() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: this.globalData.envId,
        traceUser: true
      });
    }
    
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
