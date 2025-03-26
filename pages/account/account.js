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
      if (userInfo && userInfo.openid) {
        // 从数据库获取最新的用户信息
        const dbUserInfo = await userDB.getUserInfo(userInfo.openid)
        if (dbUserInfo) {
          // 更新本地存储的用户信息
          wx.setStorageSync('userInfo', dbUserInfo)
          this.setData({
            userInfo: dbUserInfo,
            isLogin: true
          })
        } else {
          // 如果服务器上没有找到用户信息，清除本地登录状态
          console.log('服务器未找到用户信息，退出登录')
          wx.removeStorageSync('userInfo')
          this.setData({
            userInfo: null,
            isLogin: false
          })
        }
      }
    } catch (error) {
      console.error('检查登录状态失败：', error)
      // 发生错误时，为安全起见也清除登录状态
      wx.removeStorageSync('userInfo')
      this.setData({
        userInfo: null,
        isLogin: false
      })
    }
  },

  // 处理用户登录
  async handleLogin() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    wx.showLoading({ title: '登录中...' })
    
    try {
      // 获取用户信息
      const userProfileRes = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })
      console.log('获取到的用户信息：', userProfileRes.userInfo)

      // 获取云开发的用户身份信息
      const cloudLoginRes = await wx.cloud.callFunction({
        name: 'login'
      })
      console.log('云开发登录结果：', cloudLoginRes.result)

      const openid = cloudLoginRes.result.openid
      if (!openid) {
        throw new Error('获取用户openid失败')
      }

      // 构建用户信息对象
      const userInfo = {
        openid: openid,
        nickName: userProfileRes.userInfo.nickName || '微信用户',
        avatarUrl: userProfileRes.userInfo.avatarUrl || '/images/default-avatar.png',
        gender: userProfileRes.userInfo.gender || 0,
        country: userProfileRes.userInfo.country || '',
        province: userProfileRes.userInfo.province || '',
        city: userProfileRes.userInfo.city || '',
        language: userProfileRes.userInfo.language || ''
      }
      console.log('准备更新的用户信息：', userInfo)

      // 保存到云数据库
      const updatedUser = await userDB.updateUserInfo(openid, userInfo)
      console.log('更新后的用户信息：', updatedUser)

      if (!updatedUser || !updatedUser.nickName || !updatedUser.avatarUrl) {
        throw new Error('更新用户信息失败')
      }

      // 保存到本地存储
      wx.setStorageSync('userInfo', updatedUser)

      this.setData({
        userInfo: updatedUser,
        isLogin: true,
        loading: false
      })

      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('登录失败：', error)
      wx.removeStorageSync('userInfo')
      this.setData({
        userInfo: null,
        isLogin: false,
        loading: false
      })
      wx.hideLoading()
      wx.showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none'
      })
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

  // 编辑资料
  navigateToEdit() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/user_edit/user_edit'
    })
  },

  // 跳转到设置页面
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/account_settings/account_settings'
    })
  }
})