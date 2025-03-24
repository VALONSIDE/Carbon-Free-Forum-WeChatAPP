// pages/post/post.js
Page({
  data: {
    post: null,
    commentText: '',
    showCommentDetail: false,
    currentComment: null,
    replyText: '',
    showCommentEditor: false,
    showReplyEditor: false
  },

  onLoad: function(options) {
    // 获取帖子ID
    const postId = parseInt(options.id);
    // 模拟从服务器获取帖子数据
    this.getPostData(postId);
  },

  // 模拟获取帖子数据
  getPostData: function(postId) {
    // 模拟的帖子数据库
    const postsDatabase = [
      {
        id: 1,
        title: '低碳生活从点滴做起',
        content: '今天分享一些日常生活中的低碳小技巧，希望能够帮助大家更好地践行低碳生活方式。\n\n1. 减少一次性用品使用：自带购物袋、水杯和餐具，减少塑料垃圾。\n\n2. 节约用水用电：洗澡时间控制在10分钟以内，随手关灯关水龙头。\n\n3. 绿色出行：尽量选择公共交通、骑行或步行，减少私家车使用频率。\n\n4. 垃圾分类：正确进行垃圾分类，提高资源回收利用率。\n\n5. 减少食物浪费：按需购买食材，剩菜剩饭及时保存或再利用。\n\n这些小习惯看似微不足道，但如果每个人都能坚持，对减少碳排放将产生巨大的积极影响。让我们一起行动起来，为地球的可持续发展贡献自己的力量！',
        imageUrl: '/images/post1.jpg',
        likes: 128,
        isLiked: false,
        comments: [
        {
          id: 1,
          username: '绿色先锋',
          avatar: '/images/post2.jpg',
          content: '非常实用的小技巧，我已经开始践行了！',
          time: '2023-10-15 14:30',
          replies: [
            {
              id: 1,
              username: '低碳达人',
              avatar: '/images/post5.jpg',
              content: '我也是，感觉效果很好！',
              time: '2023-10-15 15:20'
            }
          ]
        },
        {
          id: 2,
          username: '环保达人',
          avatar: '/images/post3.jpg',
          content: '建议大家也可以尝试使用可降解的环保材料替代塑料制品。',
          time: '2023-10-15 15:45',
          replies: []
        },
        {
          id: 3,
          username: '低碳生活家',
          avatar: '/images/post4.jpg',
          content: '我觉得食物浪费是个大问题，希望更多人能够重视起来。',
          time: '2023-10-16 09:20',
          replies: [
            {
              id: 1,
              username: '节约先锋',
              avatar: '/images/post6.jpg',
              content: '完全同意，我们家已经开始实行剩菜再利用计划了。',
              time: '2023-10-16 10:15'
            },
            {
              id: 2,
              username: '环保小卫士',
              avatar: '/images/post1.jpg',
              content: '有什么好的食物保存方法可以分享一下吗？',
              time: '2023-10-16 11:30'
            }
          ]
        }
      ]
      },
      {
        id: 2,
        title: '碳中和政策解读',
        content: '近期国家发布了一系列碳中和相关政策，本文将为大家详细解读这些政策的核心内容和影响。\n\n1. 政策背景：应对全球气候变化，实现可持续发展。\n\n2. 主要目标：2030年前碳达峰，2060年前碳中和。\n\n3. 重点领域：能源结构调整、工业转型、建筑节能、交通低碳化等。\n\n4. 支持措施：财税政策支持、金融支持、技术创新等。\n\n5. 对企业的影响：能源密集型企业面临转型压力，绿色低碳企业迎来发展机遇。\n\n通过这些政策的实施，我国将逐步建立起完善的碳排放管理体系，推动经济社会发展全面绿色转型。每个企业和个人都应当了解这些政策，积极参与到碳中和行动中来。',
        imageUrl: '/images/post2.jpg',
        likes: 256,
        isLiked: true,
        comments: [
          {
            id: 1,
            username: '政策研究员',
            avatar: '/images/post3.jpg',
            content: '这篇解读非常全面，对企业如何应对政策变化很有帮助。',
            time: '2023-10-18 09:45',
            replies: []
          },
          {
            id: 2,
            username: '企业管理者',
            avatar: '/images/post4.jpg',
            content: '想请教一下，中小企业如何更好地适应碳中和政策？',
            time: '2023-10-18 14:20',
            replies: [
              {
                id: 1,
                username: '绿色转型专家',
                avatar: '/images/post5.jpg',
                content: '中小企业可以从能源审计开始，找出能耗高的环节进行优化，同时关注相关补贴政策。',
                time: '2023-10-18 15:30'
              }
            ]
          }
        ]
      },
      {
        id: 3,
        title: '绿色出行方式推荐',
        content: '分享几种环保又便捷的出行方式，帮助大家在日常生活中减少碳足迹。\n\n1. 公共交通：选择地铁、公交等公共交通工具，不仅环保还能避免拥堵。\n\n2. 共享单车：适合短距离出行，既环保又锻炼身体。\n\n3. 电动汽车：如需私家车，可考虑电动汽车，减少尾气排放。\n\n4. 拼车出行：同方向的同事朋友可以拼车，减少单人驾车。\n\n5. 步行：距离很近时，选择步行是最健康环保的方式。\n\n通过选择这些绿色出行方式，我们每个人都能为减少碳排放做出贡献。让我们一起行动起来，让城市更加宜居，让地球更加美好！',
        imageUrl: '/images/post3.jpg',
        likes: 96,
        isLiked: false,
        comments: [
          {
            id: 1,
            username: '骑行爱好者',
            avatar: '/images/post1.jpg',
            content: '我已经坚持骑行上班一年了，感觉身体素质提高了很多！',
            time: '2023-10-20 08:30',
            replies: [
              {
                id: 1,
                username: '健康达人',
                avatar: '/images/post2.jpg',
                content: '骑行确实是很好的有氧运动，还能欣赏沿途风景。',
                time: '2023-10-20 09:15'
              }
            ]
          }
        ]
      },
      {
        id: 4,
        title: '可持续发展与碳排放',
        content: '探讨可持续发展与碳排放的关系，以及如何在发展经济的同时减少碳足迹。\n\n1. 可持续发展的核心理念：经济发展、社会公平和环境保护的平衡。\n\n2. 碳排放与经济增长的关系：传统模式下呈正相关，绿色发展模式下可实现脱钩。\n\n3. 低碳技术创新：能源效率提升、可再生能源利用、碳捕获与封存等。\n\n4. 循环经济模式：资源循环利用，减少废弃物产生。\n\n5. 国际合作机制：全球气候治理需要各国共同参与。\n\n实现可持续发展与碳减排的双赢，需要政府、企业和个人的共同努力。通过政策引导、技术创新和生活方式转变，我们可以创造一个更加可持续的未来。',
        imageUrl: '/images/post4.jpg',
        likes: 180,
        isLiked: false,
        comments: [
          {
            id: 1,
            username: '可持续发展研究者',
            avatar: '/images/post6.jpg',
            content: '文章分析得很到位，特别是关于经济增长与碳排放脱钩的部分很有启发性。',
            time: '2023-10-22 16:40',
            replies: []
          }
        ]
      },
      {
        id: 5,
        title: '企业碳足迹管理',
        content: '企业如何有效管理自身的碳足迹，实现绿色低碳转型。\n\n1. 碳足迹盘查：识别企业运营中的碳排放源和排放量。\n\n2. 设定减排目标：基于盘查结果，制定科学合理的减排目标。\n\n3. 实施减排措施：能源效率提升、清洁能源使用、供应链优化等。\n\n4. 碳抵消策略：对难以减少的排放，可通过碳汇项目进行抵消。\n\n5. 信息披露：定期发布碳排放和减排成果报告，提升企业形象。\n\n通过系统的碳足迹管理，企业不仅可以降低环境影响，还能提升品牌价值，获得更多商业机会。绿色低碳转型已成为企业可持续发展的必由之路。',
        imageUrl: '/images/post5.jpg',
        likes: 210,
        isLiked: true,
        comments: [
          {
            id: 1,
            username: '企业ESG负责人',
            avatar: '/images/post3.jpg',
            content: '我们公司正在推进碳足迹管理，这篇文章提供了很好的框架。',
            time: '2023-10-25 11:20',
            replies: [
              {
                id: 1,
                username: '碳管理顾问',
                avatar: '/images/post4.jpg',
                content: '建议可以参考GHG Protocol的方法学进行碳盘查，这是国际通用的标准。',
                time: '2023-10-25 13:45'
              }
            ]
          }
        ]
      },
      {
        id: 6,
        title: '环保材料创新应用',
        content: '新型环保材料在日常生活中的应用，助力绿色低碳生活方式。\n\n1. 可降解塑料：由植物淀粉、纤维素等制成，可自然降解。\n\n2. 再生建材：利用建筑废弃物制成的环保建材，减少资源消耗。\n\n3. 生物基材料：利用农作物秸秆、甘蔗渣等制成的材料，替代传统塑料。\n\n4. 新型隔热材料：提高建筑能效，减少能源消耗。\n\n5. 环保纺织品：利用回收塑料瓶、废旧服装等再生制造的面料。\n\n这些环保材料的创新应用，不仅减少了资源消耗和环境污染，还创造了新的经济增长点。作为消费者，我们可以优先选择使用这些环保材料制成的产品，支持绿色产业发展。',
        imageUrl: '/images/post6.jpg',
        likes: 150,
        isLiked: false,
        comments: [
          {
            id: 1,
            username: '材料科学爱好者',
            avatar: '/images/post1.jpg',
            content: '这些环保材料的发展真的很令人期待，特别是可降解塑料的普及应用。',
            time: '2023-10-28 10:10',
            replies: []
          },
          {
            id: 2,
            username: '绿色消费者',
            avatar: '/images/post2.jpg',
            content: '有没有推荐的品牌，我想购买这些环保材料制成的产品。',
            time: '2023-10-28 15:25',
            replies: [
              {
                id: 1,
                username: '环保达人',
                avatar: '/images/post5.jpg',
                content: '可以关注一些专注于可持续发展的品牌，如Patagonia、Allbirds等，他们在环保材料应用方面做得不错。',
                time: '2023-10-28 16:40'
              }
            ]
          }
        ]
      }
    ];

    // 根据ID查找对应的帖子
    const postData = postsDatabase.find(post => post.id === postId) || postsDatabase[0];

    this.setData({
      post: postData
    });
  },

  // 点赞或取消点赞
  toggleLike: function(e) {
    const post = this.data.post;
    const isLiked = post.isLiked;
    
    // 更新点赞状态和数量
    post.isLiked = !isLiked;
    post.likes = isLiked ? post.likes - 1 : post.likes + 1;
    
    this.setData({
      post: post
    });
  },

  // 评论输入框内容变化
  onCommentInput: function(e) {
    this.setData({
      commentText: e.detail.value
    });
  },
  
  // 显示评论编辑器
  showCommentEditor: function() {
    this.setData({
      showCommentEditor: true
    });
  },
  
  // 隐藏评论编辑器
  hideCommentEditor: function() {
    this.setData({
      showCommentEditor: false
    });
  },
  
  // 显示回复编辑器
  showReplyEditor: function() {
    this.setData({
      showReplyEditor: true
    });
  },
  
  // 隐藏回复编辑器
  hideReplyEditor: function() {
    this.setData({
      showReplyEditor: false
    });
  },

  // 提交评论
  submitComment: function() {
    const commentText = this.data.commentText.trim();
    if (!commentText) {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }

    const post = this.data.post;
    const newComment = {
      id: post.comments.length + 1,
      username: '我',
      avatar: '/images/post1.jpg',
      content: commentText,
      time: this.formatTime(new Date())
    };

    post.comments.unshift(newComment);
    
    this.setData({
      post: post,
      commentText: ''
    });

    wx.showToast({
      title: '评论成功',
      icon: 'success'
    });
  },

  // 格式化时间
  formatTime: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${year}-${this.formatNumber(month)}-${this.formatNumber(day)} ${this.formatNumber(hour)}:${this.formatNumber(minute)}`;
  },

  formatNumber: function(n) {
    return n < 10 ? '0' + n : n;
  },
  
  // 显示评论详情
  showCommentDetail: function(e) {
    const commentId = e.currentTarget.dataset.id;
    const post = this.data.post;
    const comment = post.comments.find(comment => comment.id === commentId);
    
    if (comment) {
      this.setData({
        showCommentDetail: true,
        currentComment: comment,
        replyText: ''
      });
    }
  },
  
  // 隐藏评论详情
  hideCommentDetail: function() {
    this.setData({
      showCommentDetail: false,
      currentComment: null,
      replyText: ''
    });
  },
  
  // 回复输入框内容变化
  onReplyInput: function(e) {
    this.setData({
      replyText: e.detail.value
    });
  },
  
  // 提交回复
  submitReply: function() {
    if (!this.data.replyText.trim()) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none'
      });
      return;
    }
    
    // 创建新回复
    const newReply = {
      id: this.data.currentComment.replies ? this.data.currentComment.replies.length + 1 : 1,
      username: '碳生活用户',
      avatar: '/images/post1.jpg',
      content: this.data.replyText,
      time: this.formatTime(new Date())
    };
    
    // 更新回复列表
    const updatedCurrentComment = {...this.data.currentComment};
    if (!updatedCurrentComment.replies) {
      updatedCurrentComment.replies = [];
    }
    updatedCurrentComment.replies.push(newReply);
    
    // 更新帖子数据中的评论
    const updatedComments = [...this.data.post.comments];
    const commentIndex = updatedComments.findIndex(comment => comment.id === updatedCurrentComment.id);
    if (commentIndex !== -1) {
      updatedComments[commentIndex] = updatedCurrentComment;
    }
    
    const updatedPost = {...this.data.post, comments: updatedComments};
    
    this.setData({
      post: updatedPost,
      currentComment: updatedCurrentComment,
      replyText: '',
      showReplyEditor: false
    });
    
    wx.showToast({
      title: '回复成功',
      icon: 'success'
    });
  }
})