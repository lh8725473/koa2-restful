const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  try {
    console.log('dsadsa')
  } catch (error) {
    console.log('error')
    console.log(error.message)
    console.log(error)
    ctx.body = {
      title: error.message
    }
    ctx.app.emit('error', error, ctx)
  }
})

module.exports = router
