// pages/forum/forum.js
Page({
  data: {
    isEditing: false,
    postContent: '',
    tempImagePath: '',
    userInfo: {},
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
  
  // 加载更多帖子（示例函数，实际应连接后端API）
  loadMorePosts: function() {
    // 这里可以添加加载更多帖子的逻辑
    // 例如调用后端API获取更多帖子数据
    console.log('加载更多帖子');
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
  }
})