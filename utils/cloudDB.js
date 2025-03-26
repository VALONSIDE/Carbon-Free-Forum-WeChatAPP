// 云数据库操作工具类
const db = wx.cloud.database({
  env: 'cloud1-2go4otwj32566b98'
})

// 默认图片配置
const DEFAULT_AVATAR = '/images/default-avatar.png'
const DEFAULT_POST_IMAGE = '/images/default-post.png'

// 帖子相关操作
const postDB = {
  // 获取帖子列表
  getPosts: async (page = 1, pageSize = 10) => {
    try {
      console.log('开始查询帖子，参数：', { page, pageSize })
      
      // 获取总数
      const countResult = await db.collection('posts').count()
      const total = countResult.total
      console.log('帖子总数：', total)
      
      if (total === 0) {
        console.log('没有帖子数据')
        return []
      }
      
      // 查询帖子列表
      const result = await db.collection('posts')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
      
      console.log('原始查询结果：', result)
      
      if (!result.data || result.data.length === 0) {
        console.log('本页没有数据')
        return []
      }
      
      // 处理数据，确保所有必要字段都存在
      const posts = result.data.map(post => ({
        _id: post._id,
        title: post.title || '无标题',
        content: post.content || '无内容',
        authorName: post.authorName || '匿名用户',
        authorAvatar: post.authorAvatar || DEFAULT_AVATAR,
        images: Array.isArray(post.images) && post.images.length > 0 ? post.images : [DEFAULT_POST_IMAGE],
        createTime: post.createTime || new Date(),
        likes: post.likes || 0,
        comments: post.comments || 0
      }))
      
      console.log('处理后的帖子数据：', posts)
      return posts
    } catch (error) {
      console.error('获取帖子列表失败：', error)
      throw error
    }
  },

  // 获取帖子详情
  getPostById: async (postId) => {
    try {
      console.log('开始获取帖子详情，ID：', postId)
      const result = await db.collection('posts').doc(postId).get()
      
      if (!result.data) {
        console.log('未找到帖子')
        return null
      }
      
      // 处理数据，确保所有必要字段都存在
      const post = {
        _id: result.data._id,
        title: result.data.title || '无标题',
        content: result.data.content || '无内容',
        authorName: result.data.authorName || '匿名用户',
        authorAvatar: result.data.authorAvatar || DEFAULT_AVATAR,
        images: Array.isArray(result.data.images) && result.data.images.length > 0 ? result.data.images : [DEFAULT_POST_IMAGE],
        createTime: result.data.createTime || new Date(),
        likeCount: result.data.likeCount || 0,
        commentCount: result.data.commentCount || 0,
        isLiked: result.data.isLiked || false
      }
      
      console.log('处理后的帖子详情：', post)
      return post
    } catch (error) {
      console.error('获取帖子详情失败：', error)
      throw error
    }
  },

  // 更新点赞状态
  updateLikes: async (postId, isLiked) => {
    try {
      await db.collection('posts').doc(postId).update({
        data: {
          likeCount: db.command.inc(isLiked ? 1 : -1),
          isLiked: isLiked
        }
      })
    } catch (error) {
      console.error('更新点赞状态失败：', error)
      throw error
    }
  },

  // 创建帖子
  createPost: async (postData) => {
    try {
      const result = await db.collection('posts').add({
        data: {
          ...postData,
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          likeCount: 0,
          commentCount: 0,
          isLiked: false
        }
      })
      return result._id
    } catch (error) {
      console.error('创建帖子失败：', error)
      throw error
    }
  }
}

// 用户相关操作
const userDB = {
  // 获取用户信息
  getUserInfo: async (openid) => {
    try {
      const result = await db.collection('users')
        .where({
          openid: openid
        })
        .get()
      
      return result.data[0] || null
    } catch (error) {
      console.error('获取用户信息失败：', error)
      throw error
    }
  },

  // 更新用户信息
  updateUserInfo: async (openid, userData) => {
    try {
      // 确保必要的字段存在
      if (!userData.avatarUrl) {
        console.error('缺少必要的用户信息字段');
        throw new Error('用户信息不完整');
      }

      // 先查询用户是否存在
      const result = await db.collection('users')
        .where({
          openid: openid
        })
        .get()

      // 准备要更新的数据
      const updateData = {
        openid: openid,
        avatarUrl: userData.avatarUrl,
        gender: userData.gender || 0,
        country: userData.country || '',
        province: userData.province || '',
        city: userData.city || '',
        language: userData.language || '',
        updateTime: db.serverDate()
      }
      
      let finalUserData;
      if (result.data.length > 0) {
        // 更新现有用户信息，但保留原有昵称
        const existingUser = result.data[0];
        const docId = existingUser._id;
        
        // 只在用户第一次创建时或明确要求更新昵称时才更新
        if (!existingUser.nickName || (userData.nickName && userData.nickName !== '微信用户')) {
          updateData.nickName = userData.nickName;
        }
        
        await db.collection('users').doc(docId).update({
          data: updateData
        })

        // 获取更新后的完整用户信息
        const updatedResult = await db.collection('users').doc(docId).get()
        finalUserData = updatedResult.data
      } else {
        // 创建新用户
        updateData.createTime = db.serverDate()
        updateData.nickName = userData.nickName || '微信用户'  // 新用户设置默认昵称
        
        const addResult = await db.collection('users').add({
          data: updateData
        })

        // 获取新创建的用户完整信息
        const newUserResult = await db.collection('users').doc(addResult._id).get()
        finalUserData = newUserResult.data
      }

      // 验证返回的数据完整性
      if (!finalUserData || !finalUserData.avatarUrl) {
        console.error('返回的用户数据不完整:', finalUserData);
        throw new Error('用户数据不完整');
      }

      return finalUserData
    } catch (error) {
      console.error('更新用户信息失败：', error)
      throw error
    }
  },

  // 获取用户收藏的帖子
  getFavorites: async (openid, page = 1, pageSize = 10) => {
    try {
      const result = await db.collection('favorites')
        .where({
          openid: openid
        })
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
      
      return result.data
    } catch (error) {
      console.error('获取收藏列表失败：', error)
      throw error
    }
  },

  // 添加收藏
  addFavorite: async (openid, postId) => {
    try {
      await db.collection('favorites').add({
        data: {
          openid,
          postId,
          createTime: db.serverDate()
        }
      })
    } catch (error) {
      console.error('添加收藏失败：', error)
      throw error
    }
  },

  // 取消收藏
  removeFavorite: async (openid, postId) => {
    try {
      await db.collection('favorites')
        .where({
          openid,
          postId
        })
        .remove()
    } catch (error) {
      console.error('取消收藏失败：', error)
      throw error
    }
  },

  // 检查是否已收藏
  checkFavorite: async (openid, postId) => {
    try {
      const result = await db.collection('favorites')
        .where({
          openid,
          postId
        })
        .get()
      
      return result.data.length > 0
    } catch (error) {
      console.error('检查收藏状态失败：', error)
      throw error
    }
  }
}

// 评论相关操作
const commentDB = {
  // 获取评论列表
  getComments: async (postId, page = 1, pageSize = 10) => {
    try {
      const result = await db.collection('comments')
        .where({
          postId: postId
        })
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
      
      // 处理评论数据
      return result.data.map(comment => ({
        _id: comment._id,
        content: comment.content,
        authorName: comment.authorName || '匿名用户',
        authorAvatar: comment.authorAvatar || DEFAULT_AVATAR,
        createTime: comment.createTime || new Date()
      }))
    } catch (error) {
      console.error('获取评论列表失败：', error)
      throw error
    }
  },

  // 添加评论
  addComment: async (commentData) => {
    try {
      // 添加评论
      const result = await db.collection('comments').add({
        data: {
          ...commentData,
          createTime: db.serverDate()
        }
      })
      
      // 更新帖子的评论计数
      await db.collection('posts').doc(commentData.postId).update({
        data: {
          commentCount: db.command.inc(1)
        }
      })
      
      return result._id
    } catch (error) {
      console.error('添加评论失败：', error)
      throw error
    }
  }
}

module.exports = {
  postDB,
  userDB,
  commentDB
} 