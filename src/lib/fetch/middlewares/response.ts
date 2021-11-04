export default async (ctx: any, next: any) => {
  await next()
  // 后台并没有遵守 http 规范，请求头中指定了 Accept: application/json
  // 但是，返回的响应头固定为：Content-Type: text/plain; charset=utf-8
  // 而响应的数据为 json，所以需要手动 JSON.parse
  try {
    if (typeof ctx.res.data !== 'object') {
      ctx.res.data = JSON.parse(ctx.res.data)
    }
  } catch (e) {
    throw e
  }
}
