const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const jwtKoa = require('koa-jwt')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const index = require('./routes/index')
const users = require('./routes/users')
const company = require('./routes/company')

const secret = 'jwt demo'

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(cors())
// app.use(jwtKoa({secret}).unless({
//   path: [/^\/users\/login/] //数组中的路径不需要通过jwt验证
// }))

// app.use(function (ctx, next) {
//   return next().catch((err) => {
//     console.log(err)
//     if (err.status === 401) {
//       ctx.status = 401
//       ctx.body = 'Protected resource, use Authorization header to get access\n'
//     } else {
//       throw err
//     }
//   })
// })

// app.use(jwtKoa({ secret }).unless({
//   path: [/^\/users\/login/] // 数组中的路径不需要通过jwt验证
// }))

app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(ctx.body)
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  ctx.body.times = `${ms}ms`
})

// trans page & pageSize to skip & limit
app.use(async (ctx, next) => {
  if (ctx.request.query.pageSize || ctx.request.query.pageNum) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query
    ctx.request.query.limit = pageSize
    ctx.request.query.skip = pageSize * (pageNum - 1)
  }
  await next()
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(company.routes(), company.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  // console.error(err)
  // console.error(err.message)
  // console.error(ctx)
  ctx.body = {
    code: -1,
    message: err.message
  }
})

module.exports = app
