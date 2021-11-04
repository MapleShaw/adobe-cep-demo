import { getCookie } from '@/utils'
let global = window as any
function genHost() {
  /**
   * 请求入口会从流水线注入,示例如下
   * api.vs.tencent.com/env_path
   */
  return '127.0.0.1:7777/'
  // return global._api_host
}

/**
 * 强制切换后台环境
 */

let forcePath: any
let isprod = false
// let _w = window as any

// if (_w._version.indexOf('2.') > -1) {
//   isprod = true
// }

if (!isprod) {
  forcePath = localStorage.getItem('_forcePath')

  if (forcePath) {
    // eslint-disable-next-line prettier/prettier
    console.error(`现在你正处在: ${forcePath} 环境下，如果需要恢复正常，请如下操作后刷新页面 localStorage.removeItem('_forcePath')`)
  }
}

export default async (ctx: any, next: any) => {
  const protocol = 'http' // 'https'

  const host = genHost()
  let hostArr = host.split('/')
  /**
   * 服务端环境地址
   */
  let serverPath = ''
  /**
   * HOST值
   **/
  let baseHost = hostArr[0]
  if (hostArr.length > 1) {
    serverPath = hostArr[1]
    baseHost = hostArr[0]
  }
  // debug('fetch ', hostArr)
  /**
   * 插入路径前缀。
   * 如果有设置值强制走缓存环境地址
   */
  // if (forcePath) {
  //   serverPath = forcePath
  // }

  if (serverPath != '') {
    serverPath = `${serverPath}/`
  }

  // 点播业务，默认 post 请求
  ctx.req.method = 'POST'
  if (forcePath) {
    ctx.req.url = `${forcePath}/${ctx.req.url}`
  } else {
    ctx.req.url = `${protocol}://${baseHost}/${serverPath}${ctx.req.url}`
  }

  ctx.req.headers = {}
  ctx.req.headers['Host'] = host
  ctx.req.headers['Access-Control-Request-Method'] = 'POST'
  ctx.req.mode = 'cors'
  const params = { ...ctx.req.params }
  let global = window as any
  let tokenName = getCookie(`tf_token_${global._PlatformId}`)
  // debug('tokenName:', `tf_token_${global._PlatformId}`)
  if (tokenName === '') {
    tokenName = getCookie('tf_token')
  }
  const timestamp = getCookie('tf_timestamp')
  // tf_token_voddefaulttest-1253039488
  // if (csrf_token) {
  //   params.csrf_token = csrf_token
  // }
  if (timestamp) {
    params.timestamp = timestamp
  }
  ctx.req.params = params
  await next()
}
