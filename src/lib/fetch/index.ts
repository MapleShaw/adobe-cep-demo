import xfetch, { use } from './xfetch'
import request from './middlewares/request' // 先修改请求头
import timeout from './middlewares/timeout' // 先检测超时
import not200 from './middlewares/not200' // http status 是否 200
import response from './middlewares/response' // 200，接收响应后，先 JSON.parse
import nosession from './middlewares/nosession' //  判断 ctx.res.data.Code
import catchError from './middlewares/catchError' //  判断 ctx.res.data.Code
export interface IFetchOptions {
  url?: string // 请求的 url 地址
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' // 默认为 POST，请求方法
  headers?: object // 自定义 header，默认为：
  credentials?: 'include' | 'same-origin' | 'omit' // 鉴权，默认为 include，携带 cookie。
  response?: boolean // 默认为 false。是否返回完整的 response 对象，默认只返回经过业务处理的 response.data 对象
  timeout?: number // 超时时间，默认 10s
  params?: object // 请求的 url 参数，queryString
  body?: object // POST 请求的 body 内容
  disableUrlDetect?: boolean
  // 默认为 false。是否禁用全局错误提示，当请求异常时（非 200、超时、后端返回错误码）。
  // 默认使用 Tips 组件提示用户请求异常，示例：Tips.error(error.message)。
  // 如果业务需要自己处理异常，例如根据异常给予用户更精细的提示，或者用于静默请求，例如轮询，请设置 silent 为 true，禁用错误提示。
  silent?: boolean
  cacheExpire?: number
  returnInfoIfNoData?: boolean // 在没有 data 返回的接口，是否需要抛出完整信息
  ignoreError?: boolean // 忽略后台报错，直接获取 Data
}

// 处理中间件
use([request, timeout, not200, response, nosession, catchError]) //not200, response, nosession, catchError

export default function fetch<T extends keyof CGI.IRequests>(
  url: T,
  body?: CGI.IRequests[T]['query'],
  options?: IFetchOptions
): Promise<CGI.IRequests[T]['res']> {
  let resultUrl: any = url
  let detectUrl = true

  let cacheOpts: any = {}
  if (options) {
    if (options.cacheExpire) {
      cacheOpts.expire = options.cacheExpire
    }
    if (options.disableUrlDetect) {
      detectUrl = false
    }
  }
  if (detectUrl && !/SaaS/.test(url.toString())) {
    resultUrl = `SaaS/${url}`
  }
  if (options && typeof options.cacheExpire === 'number') {
    cacheOpts.expire = options.cacheExpire
  }
  return xfetch(resultUrl, { body, ...options })
}
