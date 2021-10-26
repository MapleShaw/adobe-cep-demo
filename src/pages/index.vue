<template>
  <div>
    <div id="nav">
      Test
      <button type="button" @click="testScript">click</button>
      <button type="button" @click="openInNewTab">openInNewTab</button>
      <button type="button" @click="loadMoreJsx">loadMoreJsx</button>
    </div>
    {{ hostEnv }}
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
export default defineComponent({
  name: 'Home',
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

  mounted () {
    // 获取环境
    this.hostEnv = this.csInterface.getHostEnvironment()
    // setTimeout(() => {
    //   console.log('=====+++++++=')
    //   this.openInNewTab()
    // }, 3000)
  },

  methods: {
    testScript () {
      this.csInterface.evalScript('showMsg("hahahaah")', (result: any) => {
        if (result !== 'undefined') console.log(result)
      })
    },

    loadMoreJsx () {
      this.loadJSX('ps.jsx')
    },

    openInNewTab () {
      this.csInterface.openURLInDefaultBrowser('https://v.tencent.com')
    },

    loadJSX (fileName: string) {
      const extensionRoot = this.csInterface.getSystemPath('extension') + '/host/'
      this.csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")', (result: any) => {
        console.log(result)
      })
    }
  }
})
</script>
