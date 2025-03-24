// pages/post_create/post_create.js
Page({
  data: {
    postContent: '',
    tempImagePath: '',
    userInfo: {}
  },

  onLoad: function() {
    // 获取用户信息
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
      },
      fail: () => {
        console.log('获取用户信息失败');
      }
    });
  },
  
  // 监听内容输入
  onContentInput: function(e) {
    this.setData({
      postContent: e.detail.value
    });
  },
  
  // 选择图片
  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFilePaths[0]
        });
      }
    });
  },
  
  // 移除已选择的图片
  removeImage: function() {
    this.setData({
      tempImagePath: ''
    });
  },
  
  // 提交发布帖子
  submitPost: function() {
    if (!this.data.postContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    // 获取页面栈
    const pages = getCurrentPages();
    // 获取上一个页面（即forum页面）
    const forumPage = pages[pages.length - 2];
    
    // 生成新帖子ID
    const newPostId = forumPage.data.posts.length > 0 ? 
      Math.max(...forumPage.data.posts.map(post => post.id)) + 1 : 1;
    
    // 创建新帖子对象
    const newPost = {
      id: newPostId,
      title: this.data.postContent.substring(0, 20) + (this.data.postContent.length > 20 ? '...' : ''),
      content: this.data.postContent,
      imageUrl: this.data.tempImagePath || '/images/post' + (Math.floor(Math.random() * 6) + 1) + '.jpg',
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    // 将新帖子添加到forum页面的帖子列表开头
    const updatedPosts = [newPost, ...forumPage.data.posts];
    
    // 更新forum页面的数据
    forumPage.setData({
      posts: updatedPosts
    });
    
    // 显示发布成功提示
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      success: () => {
        // 延迟返回，让用户看到提示
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
})