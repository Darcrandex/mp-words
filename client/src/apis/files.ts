import Taro from '@tarojs/taro'
import { randomStr } from '@/utils'

// 查看相关api后, 发现Taro的文件相关api与最新版本的微信api不同,所以先使用Taro自带的api

// 文件上传
export async function apiUploadFile(path: string): Promise<string> {
  const postfix = path.split('.').pop()
  const { fileID = '' } = await Taro.cloud.uploadFile({
    cloudPath: `${randomStr()}_${Date.now()}.${postfix}`,
    filePath: path,
  })

  return fileID
}

// 删除文件
export async function apiDeleteFile(fileID: string): Promise<void> {
  await Taro.cloud.deleteFile({ fileList: [fileID] })
}
