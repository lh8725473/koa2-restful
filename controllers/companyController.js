const companyModel = require('../models/company')

class CompanyController {
  // 注册
  async addCompany (ctx) {
    const postData = ctx.request.body
    const data = await companyModel.save(postData)
    ctx.body = {
      data: data
    }
  }

  // 登录
  async login (ctx) {
    const postData = ctx.request.body
    const data = await companyModel.findOne(postData)
    ctx.body = {
      data: data
    }
  }

  // 根据_id查询用户
  async findUser (ctx) {
    console.log('findUser')
    const getData = ctx.request.params
    const user = await companyModel.findOne(getData)
    ctx.body = {
      user: user
    }
  }

  // 用户列表
  async findList (ctx) {
    const { limit = 50, skip = 0, username } = ctx.request.query
    let filter = {}
    if (username) {
      filter.username = { $regex: new RegExp(`${username}`, 'g') }
    }
    const userList = await companyModel.findList(filter, limit, skip)
    ctx.body = {
      userList: userList
    }
  }
}

module.exports = new CompanyController()
