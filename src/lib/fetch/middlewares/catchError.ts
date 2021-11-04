// import router from '@/router'
// import Modal from '@/components/Modal'
// import { Tips } from '@/components/Tips'
import { resRecord } from '../xfetch'
// import { CooperationModule } from '../../../store/cooperation'

let debug = require('debug')('ve:CatchError')

export default async (ctx: any, next: Function) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const startTime = new Date().getTime()
      await next()

      ctx.res.originData = ctx.res.data
      ctx.res.data = ctx.res.data.Data
      resolve()
    } catch (e) {
      let global = window as any
      // debug('global._parentOrigin:', global._parentOrigin)
      debug('e:', e.code, ctx)
      resRecord(ctx, 'fetch_err')
      /***
       * 接口错误响应1002
       * 会话过期响应1001
       */
      let ErrorCode = 1002
      if (e.code === 'AuthFailure.SessionInvalid') {
        ErrorCode = 1001
      }
      let showBuyInfo = false
      let showCooperationMemberNotExist = false
      /**
       * PAAS如果有父级容器，将接口异常问题抛出
       */
      if (global._parentOrigin) {
        if (parent) {
          parent.postMessage(
            {
              type: 'event',
              data: {
                name: 'Error',
                val: {
                  error: ErrorCode,
                  code: e.code,
                  msg: String(e),
                },
              },
            },
            decodeURIComponent(global._parentOrigin)
          )
        }
      } else {
        let codeDesc = (e.code || '').split('.')
        if (codeDesc[0] === 'LimitExceeded') {
          /**
           * 二级错误码前缀如果是BillItem，表示是计费项资源超出项目，则提示用户引导购买
           */
          if (codeDesc[1] && /BillItem/.test(codeDesc[1])) {
            showBuyInfo = true
          }
        }
        if (['CooperationMemberNotExist', 'CooperationSpaceNotExist'].includes(codeDesc[1])) {
          /**
           * 协同空间成员不存在，项目被删除，或退出项目
           */
          showCooperationMemberNotExist = true
        }
      }
      let msg = e.message || String(e)
      // if (showBuyInfo) {
      //   Modal.warning({
      //     title: '用量提示',
      //     content: msg,
      //     showQr: true,
      //   })
      //   reject(e)
      //   return
      // }
      // if (showCooperationMemberNotExist) {
      //   Modal.warning({
      //     title: '访问被拒绝',
      //     content: '项目不存在或没有权限访问此项目',
      //     showQr: false,
      //     okText: '访问首页',
      //     cancelText: '',
      //     onOk: () => {
      //       router.push({
      //         path: `/cooperation/projects/${CooperationModule.projectList[0].Id}/file`,
      //       })
      //     },
      //   })
      //   reject(e)
      //   return
      // }
      // if (!ctx.req.silent) {
      //   Tips.error(`请求异常:${msg}`)
      // }
      reject(e)
    }
  })
}
