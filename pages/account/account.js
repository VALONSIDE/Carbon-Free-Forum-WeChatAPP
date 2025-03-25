// pages/account/account.js
Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    carbonPoints: 0,
    carbonSaved: 0.0
  },

  onLoad: function() {
    // 检查用户是否已登录
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true,
        // 模拟数据，实际应从服务器获取
        carbonPoints: Math.floor(Math.random() * 1000),
        carbonSaved: (Math.random() * 100).toFixed(2)
      });
    }
  },

  // 用户登录
  login: function() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', res.userInfo);
        
        // 更新页面数据
        this.setData({
          userInfo: res.userInfo,
          isLoggedIn: true,
          // 模拟数据，实际应从服务器获取
          carbonPoints: Math.floor(Math.random() * 1000),
          carbonSaved: (Math.random() * 100).toFixed(2)
        });
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('登录失败', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 用户登出
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo');
          
          // 更新页面数据
          this.setData({
            userInfo: null,
            isLoggedIn: false,
            carbonPoints: 0,
            carbonSaved: 0.0
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 切换到论坛页面
  switchToForum: function() {
    wx.switchTab({
      url: '/pages/forum/forum'
    });
  },
  
  // 跳转到设置页面
  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/account_settings/account_settings'
    });
  }
})