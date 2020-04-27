import { observable, action, runInAction } from 'mobx'
import Taro from '@tarojs/taro'

export interface IAppStore {
  isFullScreen: boolean
  getAppMessage: () => Promise<any>
}

class AppStore implements IAppStore {
  @observable isFullScreen = false

  @action
  getAppMessage = async () => {
    // 注意,该方法需要在使用了小程序的'tarBar'之后,并且在'tab页面'中调用
    const res = await Taro.getSystemInfo()

    // 判断是否为全面屏
    const navBarHeight = 46 //经验值,ios:44, android:48
    const fullScreenTabBarHeight = 72 //经验值,全面屏的底部导航高度
    const bottomTabBarHeight = res.screenHeight - res.windowHeight - res.statusBarHeight - navBarHeight

    if (bottomTabBarHeight >= fullScreenTabBarHeight) {
      runInAction(() => {
        this.isFullScreen = true
      })
    }
  }
}

export default new AppStore()
