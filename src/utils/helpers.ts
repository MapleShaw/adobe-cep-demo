import config from '@/utils/config'

export function loadScript (src: string) {
  return new Promise((resolve) => {
    const tag = document.createElement('script')
    tag.type = 'text/javascript'
    tag.src = src
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(tag)
    tag.addEventListener('load', resolve)
  })
}

export const getCookie = (name: string): string => {
  const m = RegExp(`(^| )${name}=([^;]*)(;|$)`).exec(document.cookie)
  return m ? decodeURIComponent(m[2]) : ''
}

export function getExt(fName: string) {
  // eslint-disable-next-line no-useless-escape
  let result = /(\.[^\.]+)$/.exec(fName)
  if (result) {
    return result[0].toLowerCase()
  } else {
    return null
  }
}

export function getMediaType(fileName: string): 'OTHER' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'STICKER' {
  let ext = getExt(fileName)
  if (!ext) {
    return 'OTHER'
  }
  for (let p in config.allowUploadExts) {
    ext = ext!.replace('.', '').toLocaleLowerCase()
    if ((config.allowUploadExts as any)[p].includes(ext)) {
      return p.toLocaleUpperCase() as any
    }
  }
  return 'OTHER'
}

export function getMemDesc(val: number) {
  let result = val
  let counter = 0
  let names = ['b', 'kb', 'M', 'G']
  while (result > 1000) {
    result = result / 1000
    ++counter
  }
  return `${result.toFixed(2)}${names[counter]}`
}

export function base64ToArrayBuffer (base64: string) {
  var binaryString = window.atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
