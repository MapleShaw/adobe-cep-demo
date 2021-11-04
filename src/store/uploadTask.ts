export enum TaskStatus {
  INIT,
  UPLOADING,
  PAUSE,
  WAITING,
  ZIP_UNZIP, // 【解压中】，zip解压
  ZIP_SERIALIZE, // 【读取中】，数据序列化
  ZIP_PROCESS, // 【处理中】，新数据压缩 + 封面
}

export interface UploadTask {
  id: string
  name: string
  percent: number
  parentTask?: UploadTask
  status: TaskStatus
  speed: string
  canNotRemove?: boolean
  total: number
  current?: number
  vod?: any
  signRenew?: any
  runner?: any
  callback?: any
  fullLoad?: boolean
  hideTaskList?: boolean
}