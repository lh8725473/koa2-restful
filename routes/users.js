const router = require('koa-router')()
const userctrl = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const util = require('util')
const Joi = require('joi')
const validate = require('koa2-validation')
const verify = util.promisify(jwt.verify)
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
