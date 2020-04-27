/**
 * @desc 公共云函数请求方法
 * @description 发现一个问题, 'Taro.cloud.callFunction'无法使用'finally'方法
 */

import Taro from '@tarojs/taro'

// 云函数主入口方法
const CLOUD_FUN_NAME = 'main'

enum RESPONSE_CODE {
  SUCCESS = 20000,
  FAILED = 50000,
}

export interface IResponse {
  code: RESPONSE_CODE
  data: any
  msg: string
}

export default async function(url: string, params?: { [key: string]: any }): Promise<any> {
  try {
    Taro.showLoading({ title: 'loading', mask: true })
    const { result } = await Taro.cloud.callFunction({ name: CLOUD_FUN_NAME, data: { $url: url, ...params } })

    const res = result as IResponse
    if (res.code === RESPONSE_CODE.SUCCESS) {
      return res
    } else {
      return Promise.reject(res)
    }
  } catch (err) {
    const errData = JSON.stringify(err || '')
    return Promise.reject(errData)
  } finally {
    Taro.hideLoading()
  }
}
