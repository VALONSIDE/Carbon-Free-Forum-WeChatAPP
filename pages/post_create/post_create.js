// pages/post_create/post_create.js
const { postDB } = require('../../utils/cloudDB.js')

Page({
  data: {
    title: '',
    content: '',
    images: [],
    uploading: false,
    submitDisabled: true
  },

  // 标题输入处理
  onTitleInput(e) {
    this.setData({
      title: e.detail.value,
      submitDisabled: !e.detail.value.trim() || !this.data.content.trim()
    })
  },

  // 内容输入处理
  onContentInput(e) {
    this.setData({
      content: e.detail.value,
      submitDisabled: !e.detail.value.trim() || !this.data.title.trim()
    })
  },

  // 选择图片
  async chooseImage() {
    try {
      const res = await wx.chooseMedia({
        count: 9 - this.data.images.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      })

      const tempFiles = res.tempFiles
      console.log('选择的图片：', tempFiles)

      this.setData({
        images: [...this.data.images, ...tempFiles.map(file => file.tempFilePath)]
      })
    } catch (error) {
      console.error('选择图片失败：', error)
    }
  },

  // 预览图片
  previewImage(e) {
    const current = e.currentTarget.dataset.src
    wx.previewImage({
      current,
      urls: this.data.images
    })
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  // 上传图片到云存储
  async uploadImages() {
    if (this.data.images.length === 0) return []

    const uploadTasks = this.data.images.map(async (tempFilePath, index) => {
      const ext = tempFilePath.split('.').pop()
      const cloudPath = `post_images/${Date.now()}_${index}.${ext}`
      
      try {
        const res = await wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePath
        })
        console.log('图片上传成功：', res.fileID)
        return res.fileID
      } catch (error) {
        console.error('图片上传失败：', error)
        throw error
      }
    })

    try {
      return await Promise.all(uploadTasks)
    } catch (error) {
      console.error('批量上传图片失败：', error)
      throw error
    }
  },

  // 提交帖子
  async submitPost() {
    if (this.data.submitDisabled || this.data.uploading) return

    if (!this.data.title.trim() || !this.data.content.trim()) {
      wx.showToast({
        title: '请填写标题和内容',
        icon: 'none'
      })
      return
    }

    this.setData({ uploading: true })
    wx.showLoading({ title: '发布中...' })

    try {
      // 上传图片
      const imageFileIds = await this.uploadImages()
      console.log('所有图片上传完成：', imageFileIds)

      // 获取用户信息
      const userInfo = wx.getStorageSync('userInfo') || {}

      // 创建帖子
      const postData = {
        title: this.data.title,
        content: this.data.content,
        images: imageFileIds,
        authorName: userInfo.nickName || '匿名用户',
        authorAvatar: userInfo.avatarUrl || '/images/default-avatar.png'
      }

      const postId = await postDB.createPost(postData)
      console.log('帖子创建成功：', postId)

      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })

      // 返回上一页并刷新列表
      setTimeout(() => {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.loadPosts) {
          prevPage.setData({ page: 1, posts: [], hasMore: true })
          prevPage.loadPosts()
        }
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      console.error('发布帖子失败：', error)
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      })
    } finally {
      this.setData({ uploading: false })
    }
  },

  // 返回上一页
  onBack() {
    wx.navigateBack()
  }
})