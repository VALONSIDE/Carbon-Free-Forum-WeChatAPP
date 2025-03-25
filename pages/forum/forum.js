// pages/forum/forum.js
Page({
  data: {
    isEditing: false,
    postContent: '',
    tempImagePath: '',
    userInfo: {},
    refreshing: false,
    posts: [
      {
        id: 1,
        title: '低碳生活从点滴做起',
        content: '今天分享一些日常生活中的低碳小技巧...',
        imageUrl: '/images/post1.jpg',
        likes: 128,
        comments: 32,
        isLiked: false
      },
      {
        id: 2,
        title: '碳中和政策解读',
        content: '近期国家发布了一系列碳中和相关政策...',
        imageUrl: '/images/post2.jpg',
        likes: 256,
        comments: 64,
        isLiked: true
      },
      {
        id: 3,
        title: '绿色出行方式推荐',
        content: '分享几种环保又便捷的出行方式...',
        imageUrl: '/images/post3.jpg',
        likes: 96,
        comments: 24,
        isLiked: false
      },
      {
        id: 4,
        title: '可持续发展与碳排放',
        content: '探讨可持续发展与碳排放的关系...',
        imageUrl: '/images/post4.jpg',
        likes: 180,
        comments: 45,
        isLiked: false
      },
      {
        id: 5,
        title: '企业碳足迹管理',
        content: '企业如何有效管理自身的碳足迹...',
        imageUrl: '/images/post5.jpg',
        likes: 210,
        comments: 53,
        isLiked: true
      },
      {
        id: 6,
        title: '环保材料创新应用',
        content: '新型环保材料在日常生活中的应用...',
        imageUrl: '/images/post6.jpg',
        likes: 150,
        comments: 38,
        isLiked: false
      }
    ]
  },
  
  // 点赞或取消点赞
  toggleLike: function(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts;
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
      const isLiked = posts[postIndex].isLiked;
      // 更新点赞状态和数量
      posts[postIndex].isLiked = !isLiked;
      posts[postIndex].likes = isLiked ? posts[postIndex].likes - 1 : posts[postIndex].likes + 1;
      
      this.setData({
        posts: posts
      });
    }
  },
  
  // 跳转到帖子详情页
  goToDetail: function(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/post/post?id=' + postId
    });
  },
  
  // 跳转到发帖页面
  goToCreatePost: function() {
    wx.navigateTo({
      url: '/pages/post_create/post_create'
    });
  },
  
  // 页面显示时触发
  onShow: function() {
    // 确保数据正确加载
    console.log('页面显示，检查数据加载状态');
    if (!this.data.posts || this.data.posts.length === 0) {
      console.log('重新加载数据');
      this.onLoad();
    } else {
      console.log('数据已加载，共有帖子:', this.data.posts.length);
    }
  },
  
  // 下拉刷新
  onRefresh: function() {
    // 设置refreshing状态为true
    this.setData({
      refreshing: true
    });
    
    // 模拟刷新数据，实际应调用后端API
    setTimeout(() => {
      // 随机调整点赞数，模拟数据刷新
      const posts = this.data.posts.map(post => {
        return {
          ...post,
          likes: Math.floor(Math.random() * 300) + 50,
          comments: Math.floor(Math.random() * 100) + 10
        };
      });
      
      this.setData({
        posts: posts,
        refreshing: false
      });
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1000
      });
    }, 1500); // 延迟1.5秒，模拟网络请求
  },
  
  // 加载更多帖子（示例函数，实际应连接后端API）
  loadMorePosts: function() {
    // 这里可以添加加载更多帖子的逻辑
    // 例如调用后端API获取更多帖子数据
    console.log('加载更多帖子');
  },
  
  onLoad: function() {
    // 调试数据加载状态
    console.log('开始加载本地测试数据...');
    
    try {
      // 确保posts数组已正确初始化
      if (!this.data.posts || this.data.posts.length === 0) {
        console.error('Posts数组为空，重新初始化默认数据');
        // 初始化默认数据
        this.setData({
          posts: [
            {
              id: 1,
              title: '低碳生活从点滴做起',
              content: '今天分享一些日常生活中的低碳小技巧...',
              imageUrl: '/images/post1.jpg',
              likes: 128,
              comments: 32,
              isLiked: false
            },
            {
              id: 2,
              title: '碳中和政策解读',
              content: '近期国家发布了一系列碳中和相关政策...',
              imageUrl: '/images/post2.jpg',
              likes: 256,
              comments: 64,
              isLiked: true
            },
            {
              id: 3,
              title: '绿色出行方式推荐',
              content: '分享几种环保又便捷的出行方式...',
              imageUrl: '/images/post3.jpg',
              likes: 96,
              comments: 24,
              isLiked: false
            }
          ]
        });
      } else {
        // 确保现有数据正确显示
        this.setData({
          posts: this.data.posts
        });
      }
      
      console.log('数据加载完成，共加载帖子数量:', this.data.posts.length);
      wx.showToast({
        title: '数据加载完成',
        icon: 'success'
      });
    } catch (error) {
      console.error('加载数据时出错:', error);
      wx.showToast({
        title: '数据加载失败',
        icon: 'error'
      });
    }
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
  }
})