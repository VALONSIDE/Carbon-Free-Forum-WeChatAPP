// pages/account/account.js
const { userDB } = require('../../utils/cloudDB.js')

Page({
  data: {
    userInfo: null,
    isLogin: false,
    loading: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  // 检查登录状态
  async checkLoginStatus() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          userInfo,
          isLogin: true
        })
      }
    } catch (error) {
      console.error('检查登录状态失败：', error)
    }
  },

  // 处理用户登录
  async handleLogin() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      // 获取用户信息
      const { result } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })

      // 获取云开发的用户身份信息
      const { result: cloudIDResult } = await wx.cloud.callFunction({
        name: 'login'
      })

      // 构建用户信息
      const userInfo = {
        openid: cloudIDResult.openid,
        nickName: result.userInfo.nickName,
        avatarUrl: result.userInfo.avatarUrl,
        gender: result.userInfo.gender,
        country: result.userInfo.country,
        province: result.userInfo.province,
        city: result.userInfo.city,
        language: result.userInfo.language,
        updateTime: new Date()
      }

      // 保存到云数据库
      await userDB.updateUserInfo(cloudIDResult.openid, userInfo)

      // 保存到本地存储
      wx.setStorageSync('userInfo', userInfo)

      this.setData({
        userInfo,
        isLogin: true
      })

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

    } catch (error) {
      console.error('登录失败：', error)
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo')
          
          // 更新页面状态
          this.setData({
            userInfo: null,
            isLogin: false
          })
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  },

  // 跳转到我的帖子
  navigateToMyPosts() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/my_posts/my_posts'
    })
  },

  // 跳转到我的收藏
  navigateToFavorites() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  // 跳转到关于我们
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  }
})