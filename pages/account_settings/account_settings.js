// pages/account_settings/account_settings.js
Page({
  data: {
    userInfo: null,
    notificationEnabled: true,
    t: {} // 翻译文本对象
  },

  onLoad: function() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
    
    // 获取设置信息（实际应从服务器或本地存储获取）
    const settings = wx.getStorageSync('userSettings');
    if (settings) {
      this.setData({
        notificationEnabled: settings.notificationEnabled !== undefined ? settings.notificationEnabled : true
      });
    }
    
    // 获取全局应用实例
    const app = getApp();
    
    // 设置当前页面的语言文本
    this.setData({
      t: app.globalData.translations
    });
  },
  
  // 切换通知设置
  toggleNotification: function() {
    const newValue = !this.data.notificationEnabled;
    this.setData({
      notificationEnabled: newValue
    });
    this.saveSettings();
  },
  
  // 清除缓存
  clearCache: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          // 实际应用中，这里应该清除应用的缓存数据
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 关于我们
  aboutUs: function() {
    wx.showModal({
      title: '关于碳生活',
      content: '碳生活是一款致力于推广低碳生活方式的社区应用，版本号：1.0.0',
      showCancel: false
    });
  },
  
  // 保存设置到本地存储
  saveSettings: function() {
    const settings = {
      notificationEnabled: this.data.notificationEnabled
    };
    
    wx.setStorageSync('userSettings', settings);
  }
})