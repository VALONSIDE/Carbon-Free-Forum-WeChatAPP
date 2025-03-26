const { userDB } = require('../../utils/cloudDB.js')

Page({
  data: {
    userInfo: null,
    tempFilePath: '',
    loading: false,
    pageStyle: 'min-height: 100vh; background: #f8f8f8;'
  },

  onLoad() {
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  // 选择头像
  async chooseAvatar(e) {
    try {
      const { avatarUrl } = e.detail
      
      // 强制页面刷新，确保头像立即更新
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      
      // 使用微信临时文件系统API确保图片可访问
      const fs = wx.getFileSystemManager()
      fs.readFile({
        filePath: avatarUrl,
        success: (res) => {
          this.setData({
            'userInfo.avatarUrl': avatarUrl,
            tempFilePath: avatarUrl
          }, () => {
            // 在数据设置完成后关闭loading
            wx.hideLoading()
          })
        },
        fail: (err) => {
          console.error('读取头像文件失败：', err)
          // 即使读取失败也尝试直接设置
          this.setData({
            'userInfo.avatarUrl': avatarUrl,
            tempFilePath: avatarUrl
          })
          wx.hideLoading()
        }
      })
    } catch (error) {
      console.error('选择头像失败：', error)
      wx.showToast({
        title: '选择头像失败',
        icon: 'none'
      })
      wx.hideLoading()
    }
  },

  // 输入昵称
  onNicknameInput(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  // 上传头像到云存储
  async uploadAvatar() {
    if (!this.data.tempFilePath) return null

    try {
      const cloudPath = `avatars/${this.data.userInfo.openid}_${Date.now()}.jpg`
      const { fileID } = await wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.tempFilePath
      })
      return fileID
    } catch (error) {
      console.error('上传头像失败：', error)
      throw error
    }
  },

  // 保存用户信息
  async saveUserInfo() {
    if (this.data.loading) return
    if (!this.data.userInfo.nickName.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '保存中...' })

    try {
      // 如果有新头像，先上传到云存储
      if (this.data.tempFilePath) {
        const avatarFileID = await this.uploadAvatar()
        if (avatarFileID) {
          this.data.userInfo.avatarUrl = avatarFileID
        }
      }

      // 更新用户信息
      await userDB.updateUserInfo(this.data.userInfo.openid, {
        nickName: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl,
        updateTime: new Date()
      })

      // 更新本地存储
      wx.setStorageSync('userInfo', this.data.userInfo)

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      console.error('保存用户信息失败：', error)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
      this.setData({ loading: false })
    }
  }
})
