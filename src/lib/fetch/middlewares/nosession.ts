import router from '@/router'
// import monitor from '@/lib/monitor'
let debug = require('debug')('ve:NoSession')
export default async (ctx: any, next: any) => {
  await next()

  if (ctx.req.ignoreError) {
    return
  }

  // console.log('window.location', window.location)

  const href = window.location.href
  // debugger
  if (href.indexOf('filePreview') > -1 || href.indexOf('checkPassword') > -1) {
    // debugger
    return
  }

  // debugger

  if (ctx.res.data.Code !== 'Success' && ctx.res.data.Code !== 'ResourceNotFound') {
    const error: any = new Error(ctx.res.data.Message || '服务器内部错误')
    error.code = ctx.res.data.Code
    error.messageen = ctx.res.data.EnglishMessage
    error.status = 200
    // monitor.module('Fetch', 'nosession')
    if (ctx.res.data.Code === 'AuthFailure.SessionInvalid') {
      // 登录态过期，跳到登出页
      ctx.req.silent = true
      /**
       * 如果当前已经是login路由重定向会异常
       */
      console.log('=====router.currentRoute=====', router.currentRoute)
      // if (router.currentRoute.name === 'login') return
      router.push({ name: 'login', query: { action: 'logout', redirect: window.location.href } })
    }
    throw error
  }
}
