const userModel = require('../models/user')
const companyModel = require('../models/company')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'

class UserController {
  // 注册
  async register (ctx) {
    const postData = ctx.request.body
    const data = await userModel.save(postData)
    ctx.body = {
      code: 1,
      data: data
    }
  }

  // 登录
  async login (ctx) {
    const postData = ctx.request.body
    const user = await userModel.findOne(postData)
    console.log(user)
    if (user) {
      let userToken = {
        userId: user._id
      }
      const token = jwt.sign(userToken, secret, { expiresIn: '24h' })
      ctx.body = {
        code: 1,
        user: user,
        token
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '用户或密码错误'
      }
    }
  }

  // 根据_id查询用户
  async findUserById (ctx) {
    const token = ctx.header.authorization
    let payload
    if (token) {
      payload = await verify(token.split(' ')[1], secret)
      const user = await userModel.findUserById(payload.userId)
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1
      }
    }
  }

  // 根据_id更新用户
  async updateUser (ctx) {
    console.log(ctx.params._id)
    console.log(ctx.request.body)
    const user = await userModel.updateUser(ctx.params._id, ctx.request.body)
    if (user) {
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '没有找到对应_id用户'
      }
    }
  }

  // 用户列表
  async findList (ctx) {
    const { limit = 50, skip = 0, username, companyName } = ctx.request.query
    let filter = {}
    if (username) {
      filter.username = { $regex: new RegExp(`${username}`, 'g') }
    }
    if (companyName) {
      let companyFilter = {
        companyName: { $regex: new RegExp(`${companyName}`, 'g') }
      }
      const companyList = await companyModel.findList(companyFilter)
      const companyIds = companyList.map(company => {
        return company._id
      })
      filter.company = { $in: companyIds }
    }
    const userList = await userModel.findList(filter, limit, skip)
    const total = await userModel.count(filter)
    ctx.body = {
      code: 1,
      userList: userList,
      total: total
    }
  }

  // token获取用户信息
  async own (ctx) {
    console.log(ctx)
    const user = await userModel.findUserById(ctx.params._id)
    if (user) {
      ctx.body = {
        code: 1,
        user: user
      }
    } else {
      ctx.body = {
        code: -1,
        errorMsg: '没有找到对应_id用户'
      }
    }
  }
}

module.exports = new UserController()
