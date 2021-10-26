/*
* 全局备忘：
* @vue/cli-service 会自动安装 vue-loader-v16，实际打包时不会用 vue-loader 而是 vue-loader-v16
* 然而 vue-loader-v16 底层用的是 vue-loader@16.7.0，导致热更新有问题
* https://githubmemory.com/repo/vuejs/vue-next/issues/4654?page=1
*/
import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import './assets/styles/index.less'

loadScript(`${process.env.NODE_ENV === 'development' ? '/cep' : '.'}/client/libs/CSInterface.js`)
  .then(() => {
    const csInterface = new (window as any).CSInterface()
    const app = createApp(App)
    app.use(router).mount('#app')
    app.provide('csInterface', csInterface)
  })

function loadScript (src: string) {
  return new Promise((resolve) => {
    const tag = document.createElement('script')
    tag.type = 'text/javascript'
    tag.src = src
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(tag)
    tag.addEventListener('load', resolve)
  })
}
