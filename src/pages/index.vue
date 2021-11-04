<template>
  <div>
    <div id="nav">
      Test
      <button type="button" @click="testScript">test</button>
      <button type="button" @click="uploadVideo">upload</button>
      <button type="button" @click="openInNewTab">openInNewTab</button>
      <button type="button" @click="loadMoreJsx">loadMoreJsx</button>
      <button type="button" @click="goToLogin">Login</button>
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
import * as vodjs from 'vod-js-sdk-v6'
import fetch from '@/lib/fetch'
import config from '@/utils/config'
import { getExt, getMediaType, getMemDesc, base64ToArrayBuffer } from '@/utils'
import { TaskStatus, UploadTask } from '@/store/uploadTask'

const DEFAULT_AVATAR = require('@/assets/img/default-avatar.svg')
const ALLOWED_EXTS = config.allowOtherUploadExts
const TEST_FILE = '/Users/maplexiao/Downloads/tencent.mp4'

export default defineComponent({
  name: 'Home',
  setup () {
    const csInterface = inject('csInterface') as any
    return { csInterface }
  },

  data () {
    return {
      hostEnv: {}
    }
  },

  async mounted () {
    // 获取环境
    // this.hostEnv = this.csInterface.getHostEnvironment()
    // setTimeout(() => {
    //   console.log('=====+++++++=')
    //   this.openInNewTab()
    // }, 3000)
    await this.getUserInfo({ loginType: 'WeChat' })
  },

  methods: {
    testScript () {
      // this.csInterface.evalScript('showMsg("hahahaah")', (result: any) => {
      //   if (result !== 'undefined') console.log(result)
      // })
      this.csInterface.evalScript('psAction.exportDocument()', (result: any) => {
        if (result !== 'undefined') {
          console.log('=====exportDocument=====', result)
        }
      })
      // this.csInterface.evalScript('psAction.addNewLayer()', (result: any) => {
      //   if (result !== 'undefined') console.log(result)
      // })
    },

    openInNewTab () {
      // 打开外部任意网页
      this.csInterface.openURLInDefaultBrowser('https://v.tencent.com')
    },

    loadMoreJsx () {
      this.loadJSX('ps.jsx')
    },

    loadJSX (fileName: string) {
      const extensionRoot = this.csInterface.getSystemPath('extension') + '/host/'
      this.csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")', (result: any) => {
        console.log(result)
      })
    },

    goToLogin () {
      this.$router.push({
        name: 'Login'
      })
    },

    async getUserInfo (opts?: { loginType?: string }) {
      try {
        const res = await fetch(
          'SaaS/Account/DescribeAccount',
          {},
          {
            silent: true,
            cacheExpire: 0
          }
        )
        let identityInfo
        if (opts?.loginType) {
          const thirdPartyIdRes = await fetch(
            'SaaS/Account/DescribeThirdPartyIdentity',
            {},
            { silent: true, cacheExpire: 0 }
          )
          identityInfo = thirdPartyIdRes.ThirdPartyIdentitySet?.find(
            (item) => item.IdentityType === opts?.loginType
          )
        }
        const info: any = {
          isLogin: !!res.TfUid,
          name: res.Phone,
          id: res.TfUid,
          nick: res.Nick || identityInfo?.Nick || res.Nick,
          email: res.Email,
          // createTime: new Date(res.CreateTime),
          phone: res.Phone,
          avatar: res.Avatar || identityInfo?.Avatar || DEFAULT_AVATAR,
          Role: res.Role
        }
        // this.setInfo(info)
      } catch (err) {
        // this.reset()
      }
    },

    uploadVideo () {
      const uploadFileName = TEST_FILE.split('/')[TEST_FILE.split('/').length - 1]
      const result = (window as any).cep.fs.readFile(TEST_FILE, (window as any).cep.encoding.Base64)
      const bData = base64ToArrayBuffer(result.data)
      const fData = new File([bData], uploadFileName, { type: 'video/mp4' })
      this.handleUploadData(fData)
    },

    // 处理上传数据
    handleUploadData (file: File) {
      if (file) {
        const videoListData = [
          {
            file,
            uploadName: file.name,
            name: file.name,
            classId: 9,
            owner: {
              Id: '6168fd110436300001a98ec3',
              Type: 'COOPERATION_SPACE'
            },
            callback: (e: any) => { console.log('======fileList callback=====', e) }
          }
        ]
          .filter((item) => {
            const nameSlice = item.name.split('.')
            if (nameSlice) {
              return config.allowUploadExts.video.indexOf(nameSlice[nameSlice.length - 1]) >= 0
            }
            return false
          })
          .map((item) => ({ ...item, tmpId: `${item.uploadName}_${new Date().getTime()}` }))
        this.queryUpload(videoListData[0])
      }
    },
    // 上传接口
    async queryUpload (fileData: any, parentTask?: any) {
      // eslint-disable-next-line no-undef
      const query: CGI.IRequests['PaaS/Material/CreateUploadMaterial']['query'] & {
        tmpId: string
        file: File
        parentTask?: UploadTask
        projectId?: string
        callback?: (res: { MaterialId: string }) => void
        errorHandler?: (info: any, parentTask: any) => void
      } = {
        tmpId: fileData.tmpId || '',
        Owner: fileData.owner,
        file: fileData.file,
        parentTask,
        projectId: fileData.owner.Id,
        Name: fileData.uploadName,
        ClassId: fileData.classId,
        errorHandler: (info) => this.errorHandler(info)
      }
      if (fileData.callback) {
        query.callback = fileData.callback
      }
      this.upload(query as any)
    },

    errorHandler (info: any) {
      console.log('======error info=====', info)
    },

    async upload (
      // eslint-disable-next-line no-undef
      query: CGI.IRequests['PaaS/Material/CreateUploadMaterial']['query'] & {
        tmpId?: string
        file: File
        projectId?: string
        canNotRemove?: boolean
        parentTask?: UploadTask
        sign?: string
        coverFile?: File
        hideTaskList?: boolean // 是否展示任务中心
        PreProcessDefinitionSet?: number[]
        addIndex?: number // 插入上传列表的顺序
        callback?: (res: { MaterialId: string }) => void
        watchProgress?: (info: any) => void
        errorHandler?: (info: any) => void
      }
    ) {
      const originFileName = query.file.name
      const ext = getExt(originFileName)
      if (!ext || !ALLOWED_EXTS.includes(ext.replace('.', ''))) {
        return
      }
      const id = query.tmpId || `${query.Name}_${new Date().getTime()}`

      let MaterialType!: any

      if (originFileName.endsWith('.mov')) {
        MaterialType = 'EFFECT_VIDEO'
      } else {
        MaterialType = query.MaterialType || (getMediaType(originFileName) as any)
      }
      const queryData: any = {
        Owner: query.Owner,
        MaterialType,
        Name: query.Name,
        ClassId: query.ClassId,
        TagSet: query.TagSet,
        VerifySign: query.sign
      }
      const { Name } = queryData
      try {
        const signInfo = await this.getUploadSign(queryData)
        const newFile = query.file
        const result = await this.addTask({
          id,
          sign: signInfo.VodUploadSign,
          uploadContext: signInfo.UploadContext,
          file: newFile,
          coverFile: query.coverFile,
          parentTask: query.parentTask,
          name: Name,
          canNotRemove: query.canNotRemove,
          hideTaskList: query.hideTaskList,
          addIndex: query.addIndex,
          signRenew: async () => {
            const renewSign = await this.getUploadSign(queryData)
            return renewSign.VodUploadSign
          },
          watchProgress: query.watchProgress,
          errorHandler: query.errorHandler
        })
        if (query.projectId) {
          await fetch('PaaS/Project/AddMaterialToProject', {
            ProjectId: query.projectId,
            MaterialIds: [result.MaterialId]
          }, { disableUrlDetect: true })
        }
        query.callback && query.callback(result)
        return result
      } catch (err) {
        query.errorHandler &&
        query.errorHandler({
          query,
          id,
          err
        })
      }
    },

    addTask (opts: {
      id?: string
      sign: string
      file: File
      canNotRemove?: boolean
      name?: string
      parentTask?: UploadTask
      uploadContext: string
      coverFile?: File
      hideTaskList?: boolean
      addIndex?: number
      signRenew?: () => Promise<string>
      watchProgress?: (info: any) => void
      errorHandler?: (info: any) => void
      // callback?: (res: { MaterialId: string }) => void
    }): Promise<{ MaterialId: string }> {
      return new Promise((resolve, reject) => {
        const name = opts.name ? opts.name : opts.file.name
        const size = opts.file.size
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this
        const taskInfo: UploadTask = {
          id: opts.id || opts.sign,
          percent: 0,
          name,
          speed: '0kb/s',
          parentTask: opts.parentTask,
          status: TaskStatus.WAITING,
          total: size,
          runner (cb: (err: any, taskId: string, res: any) => void) {
            let hasInitedCosEvent = false
            // eslint-disable-next-line new-cap
            const vodItem = new vodjs.default({
              getSignature: opts.signRenew
                ? opts.signRenew
                : async () => {
                  return opts.sign
                }
            })
            const uploadData: any = {
              videoFile: opts.file
            }
            console.log('=====addTask=====', vodItem, uploadData)
            this.vod = vodItem.upload(uploadData)
            this.vod.on('report_apply', () => {
              if (this.vod.cos && !hasInitedCosEvent) {
                hasInitedCosEvent = true
                this.vod.cos.on(
                  'inner-kill-task',
                  (info: { TaskId: string; toState: 'paused' | 'canceled' }) => {
                    if (info.toState === 'canceled') {
                    // endThisTask = true
                      reject(info)
                    }
                  }
                )
              }
            })
            // uploader.cos.on('inner-kill-task', (info: { TaskId: string; toState: string }) => {
            //   debug('killTask', info)
            // })
            this.vod.on('media_progress', (info: any) => {
              // 暂停后续传进度不回到0
              if (taskInfo.status !== TaskStatus.PAUSE || info.percent !== 0) {
                taskInfo.percent = info.percent
              }
              taskInfo.status = TaskStatus.UPLOADING
              taskInfo.speed = getMemDesc(info.speed)
              if (opts.watchProgress && typeof opts.watchProgress === 'function') {
                opts.watchProgress(info)
              }
            })
            // eslint-disable-next-line no-undef
            this.vod.done().then((res: CGI.VodResult) => {
              fetch('PaaS/Material/FinishUploadMaterial', {
                UploadContext: opts.uploadContext,
                VodVerifyKey: res.video.verify_content, // 目前随便填
                VodFileId: res.fileId
              }, { disableUrlDetect: true })
                .then((finishRes) => {
                  cb && cb(null, taskInfo.id, finishRes)
                  resolve(finishRes)
                })
                // eslint-disable-next-line handle-callback-err
                .catch((err) => {
                  opts.errorHandler && opts.errorHandler({ ...opts, Name: opts.name })
                })
            })
          }
        }
        this.runTask(taskInfo)
        // eslint-disable-next-line no-prototype-builtins
        if (opts.hasOwnProperty('hideTaskList') && opts.hideTaskList) {
          taskInfo.hideTaskList = opts.hideTaskList
        }
        taskInfo.canNotRemove = opts.canNotRemove
      })
    },
    runTask (taskInfo: UploadTask) {
      return (() => {
        const reloadRunner = () => {
          if (taskInfo.status === TaskStatus.WAITING) {
            taskInfo.status = TaskStatus.INIT
            taskInfo.runner &&
              taskInfo.runner((_err: any, taskId: string, res: any) => {
                if (taskInfo) {
                  taskInfo.callback && taskInfo.callback(res)
                  reloadRunner()
                }
              })
          }
        }
        return reloadRunner()
      })()
    },
    // eslint-disable-next-line no-undef
    async getUploadSign (query: CGI.IRequests['PaaS/Material/CreateUploadMaterial']['query']) {
      const result = await fetch('PaaS/Material/CreateUploadMaterial', query, {
        silent: true,
        disableUrlDetect: true
      })
      return result
    }
  }
})
</script>
