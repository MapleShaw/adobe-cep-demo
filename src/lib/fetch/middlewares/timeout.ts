export default async (ctx: any, next: any) => {
  if (!ctx.req.timeout) return await next()
  return new Promise<void>(async (resolve, reject) => {
    let isTimeout = false
    const timer = setTimeout(() => {
      isTimeout = true
      reject(new Error('请求超时'))
    }, ctx.req.timeout)

    await next()
    if (isTimeout) return
    if (timer) clearTimeout(timer)
    resolve()
  })
}
