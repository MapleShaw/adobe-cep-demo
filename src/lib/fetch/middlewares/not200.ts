// 服务器返回非 200
export default async (ctx: any, next: any) => {
  await next()
  if (ctx.res.status !== 200) {
    const message = `内部错误：${ctx.res.statusText}，错误码：${ctx.res.status}`
    const error: any = new Error(message)
    error.status = ctx.res.status
    throw error
  }
}
