<template>
  <div class="yj-login-with-wechat">
    <div class="yj-login-with-wechat__title">
      <i class="yj-login-with-wechat__icon"></i>
      <span class="yj-login-with-wechat__title-text">请使用微信扫一扫登录</span>
    </div>
    <div
      style="border: none; overflow: hidden"
      class="yj-login-with-wechat__qrcode"
      id="yj-login-with-wechat__qrcode"
    ></div>
  </div>
</template>

<style lang="less">
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, inject } from 'vue' // getCurrentInstance, inject
import fetch from '@/lib/fetch'
import { loadScript } from '@/utils'
type ILoginStatus = 'phone' | 'wx' | 'bindPhone'
export default defineComponent({
  name: 'Login',
  setup () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csInterface = inject('csInterface') as any
    return { csInterface }
  },

  data () {
    return {
      hostEnv: {}
    }
  },

  async mounted () {
    await this.checkAuth()
    loadScript('./wxLogin.js')
    this.loginStatusChangeHandler('wx')
  },

  methods: {
    async checkAuth () {
      const currAuth = window.sessionStorage.getItem('currAuth')
      window.sessionStorage.removeItem('currAuth')

      if (!currAuth) {
        return
      }

      if (!this.$route.query.code) {
        return
      }

      const { code } = this.$route.query

      const loginTypeMap: any = {
        wb: 'Weibo',
        wx: 'WeChat',
        qq: 'QQ'
      }

      const loginType = loginTypeMap[currAuth]

      if (!loginType) {
        return
      }

      // GlobalLoading.show({
      //   text: '载入中⋯',
      //   backgroundColor: '#262626'
      // })

      const res = await fetch(
        'Login/Login',
        {
          LoginType: loginType,
          ThirdPartyLoginInfo: {
            Code: code as string
          }
        },
        {
          ignoreError: true
        }
      )
      console.log('=====res====', res)
      // 成功登录
      if (!res) {
        this.$router.push({
          name: 'Home'
        })
      }
    },

    loginStatusChangeHandler (val: ILoginStatus) {
      if (val === 'wx') {
        // https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html

        const oauthRedirect = this.getRedirectUrl()

        window.sessionStorage.setItem('currAuth', 'wx')

        setTimeout(() => {
          if ((window as any).WxLogin && document.getElementById('yj-login-with-wechat__qrcode')) {
            // eslint-disable-next-line no-new
            new (window as any).WxLogin({
              id: 'yj-login-with-wechat__qrcode',
              appid: 'wxb68f916298ee4d46',
              scope: 'snsapi_login',
              redirect_uri: oauthRedirect,
              href: 'https://vs-cdn.tencent-cloud.com/assets/css/qrcode-override-2.css'
              // self_redirect: true,
              // state: '',
              // style: '',
            })
          }
        }, 300)
      }
    },

    getRedirectUrl () {
      const originRedirect = window.location.href.split('?')[0]
      const { redirect } = this.$route.query
      redirect && window.sessionStorage.setItem('cb', String(redirect))
      const encodedRedirect = encodeURIComponent(originRedirect)
      const oauthRedirect = encodeURIComponent(
        `https://oauth-cme.qcloud.com/release/vs_oauth_redirect?redirect_uri=${encodedRedirect}`
      )
      return oauthRedirect
    }
  }
})
</script>
