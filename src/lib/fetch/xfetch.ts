import qs from 'qs'
// import { fetchLog } from '../CLog'
let debug = require('debug')('ve:XFETCH')
let middlewares: Function[] = []
//?csrf_token=${Token}

export function resRecord(ctx: any, type: 'fetch' | 'fetch_err') {
  let REQUESTID = 'timeout'
  let ENV = 'timeout'
  let resData: any = {}
  if (ctx.res && ctx.res.headers) {
    REQUESTID = ctx.res.headers.get('x-request-id')
    ENV = ctx.res.headers.get('x-cme-environment')
    resData = ctx.res.originData
  }
  // fetchLog.set('fetch', [
  //   { URL: ctx.req.url, req: ctx.req.body },
  //   {
  //     ENV,
  //     REQUESTID, //跨域字段上暂时没暴露，后台暴露以后可以抓取
  //     res: Object.assign({}, resData),
  //   },
  // ])
  let global: any = window
  if (type == 'fetch_err' && global._Aegis) {
    global._Aegis.reportEvent({
      name: JSON.stringify(resData),
      ext1: ctx.req.url,
      ext2: `rid:${REQUESTID}`, //reuqestID
      ext3: `${new Date().getTime()}${JSON.stringify(resData)}`, //时间
    })
  }
}

const xfetch: any = async (fetchUrl: string, options: any = {}) => {
  const [url, queryString] = fetchUrl.split('?')
  const params = qs.parse(queryString) || {}

  const req = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'include', // 默认请求是否带上cookie
    response: false, // 是否返回response对象
    timeout: 1000 * 10, // 超时
    ...options,
    params: { ...options.params, ...params },
  }

  //: `${url}?csrf_token=${Token}`
  req.method = String(req.method).toUpperCase()

  const ctx: any = { req }

  let next = async () => {
    if (req.body) req.body = JSON.stringify(req.body)
    const keys = Object.keys(req.params)
    if (keys.length) req.url += `?${qs.stringify(req.params)}`
    ctx.res = await fetch(req.url, req)

    // (window as any)._ENV = ctx.res.headers.get('X-Cme-Environment')
    const contentType = ctx.res.headers.get('content-type')
    if (contentType.indexOf('application/json') === -1) {
      ctx.res.data = await ctx.res.text()
    } else {
      ctx.res.data = await ctx.res.json()
    }
  }

  const wrap = (fn: Function, n: Function) => async () => await fn(ctx, n)
  middlewares.forEach((fn) => {
    next = wrap(fn, next)
  })

  await next()
  resRecord(ctx, 'fetch')
  if (ctx.req.response) return ctx.res
  if (ctx.res.data) return ctx.res.data

  if (ctx.res) {
    return options.returnInfoIfNoData ? ctx.res.originData : undefined
  }
}

const methods = ['get', 'post', 'put', 'delete', 'patch']
methods.forEach((key) => {
  xfetch[key] = (url: string, options: any) => xfetch(url, { ...options, method: key })
})

export const use = (fn: Function | Function[]) => {
  if (Array.isArray(fn)) {
    middlewares = middlewares.concat(fn)
  } else {
    middlewares.push(fn)
  }
}

export const unuse = () => (middlewares = [])

xfetch.use = use
xfetch.unuse = unuse
export default xfetch
