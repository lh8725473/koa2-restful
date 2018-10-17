const router = require('koa-router')()
const userctrl = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const util = require('util')
const Joi = require('joi')
const validate = require('koa2-validation')
const verify = util.promisify(jwt.verify)
// const os = require('os')
const path = require('path')
const fs = require('fs')
const secret = 'jwt demo'

const userValidate = {
  register: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  findUserById: {
    params: {
      _id: Joi.string().hex().required()
    }
  },
  findList: {
    query: {
      companyName: Joi.string().required()
    }
  },
  updateUser: {
    params: {
      _id: Joi.string().hex().required()
    },
    body: {
      username: Joi.string(),
      password: Joi.string()
    }
  }
}

router.prefix('/user')

router.post('/register', validate(userValidate.register), userctrl.register)
router.post('/login', validate(userValidate.login), userctrl.login)
router.get('/:_id', userctrl.findUserById)
router.get('/', validate(userValidate.findList), userctrl.findList)
router.put('/:_id', validate(userValidate.updateUser), userctrl.updateUser)
router.put('/own', userctrl.own)
router.post('/uploadFile', async (ctx, next) => {
  const file = ctx.request.files.file
  const reader = fs.createReadStream(file.path)
  let filePath = path.resolve('public/upload') + `/${file.name}`
  console.log(filePath)
  const stream = fs.createWriteStream(filePath)
  reader.pipe(stream)
  console.log('uploading %s -> %s', file.name, stream.path)
  // // 上传单个文件
  // const file = ctx.request.files.file // 获取上传文件
  // // 创建可读流
  // const reader = fs.createReadStream(file.path)
  // let filePath = path.join(__dirname, 'public/upload') + `/${file.name}`
  // console.log(filePath)
  // // 创建可写流
  // const upStream = fs.createWriteStream(filePath)
  // // 可读流通过管道写入可写流
  // reader.pipe(upStream)
  ctx.body = '上传成功！'
})

router.get('/userInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  if (token) {
    console.log(token)
    console.log(token.split(' '))
    const payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload
    ctx.body = {
      payload
    }
  } else {
    ctx.body = {
      message: '没有token',
      code: -1
    }
  }
})

module.exports = router
