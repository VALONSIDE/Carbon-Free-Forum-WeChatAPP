// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const users = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    // 查询用户是否已存在
    const userRecord = await users.where({
      _openid: openid
    }).get()
    
    if (userRecord.data.length === 0) {
      // 用户不存在，创建新用户
      const userData = {
        _openid: openid,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
        nickName: '用户' + openid.slice(-4),
        avatarUrl: '', // 默认头像，后续可更新
        posts: 0,
        likes: 0,
        comments: 0
      }
      
      await users.add({
        data: userData
      })
      
      return {
        ...userData,
        openid: openid,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        isNewUser: true
      }
    } else {
      // 用户已存在，返回用户信息
      return {
        ...userRecord.data[0],
        openid: openid,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        isNewUser: false
      }
    }
  } catch (err) {
    console.error('登录错误：', err)
    return {
      error: err,
      openid: openid,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID
    }
  }
} 