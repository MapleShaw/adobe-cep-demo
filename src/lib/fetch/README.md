### About

支持中间件自由扩展的 `fetch` 模块。

已内置功能：

- 全局错误提示（可设置关闭）
- 超时处理
- 非 200 处理
- 失去登录态时跳转登录页
- 自定义请求头

### Useage

```js
import fetch from '@/lib/fetch'

const result = await fetch(url, { body: {} })

console.log(result)
```

### API

- fetch(url,options)
- fetch.get(url,options)
- fetch.post(url,options)
- fetch.put(url,options)
- fetch.delete(url,options)
- fetch.patch(url,options)

### options 默认参数

```js
{
  url：'',
  method:'GET',
  headers:{
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json'
  },
  credentials:'include',
  timeout: 5000, // 超时时间
  params:{}, // queryString
  body:{}, // 非 get 请求时的 http body部分，会 JSON.stringify(body)
  // 是否禁用系统错误弹框提示，默认请求失败会调用 Modal.error 显示错误信息。
  // 如果需要自己手动处理错误信息，请设置为 true。例如登陆时，需要更友好的提示用户账号密码错误。
  silent: false,
}

```

### 使用中间件扩展功能

使用`use`方法添加中间件。中间件函数接收两个参数，`ctx`,`next`，用法类似 `koa2` 的中间件。

其中`ctx`挂载了 `req`（所有 request 相关的数据） 和 `res`（所有响应数据），可在中间件中自由处理对应数据。

一般来说，在对请求头`ctx.req`处理后，调用`await next()`，再对响应头`ctx.res`进行处理。

其中，`ctx.res.data` 对应该请求最终返回的内容。

例如：

```js
import { use } from '@/lib/fetch'

use(async (ctx, next) => {
  // 强制修改为 post 请求
  ctx.req.method = 'post'
  // 添加一个自定义头
  ctx.req.headers['x-req-id'] = Date.now()
  await next()

  // 强制返回字符串
  ctx.res.data = 'hello world.'
})
```
