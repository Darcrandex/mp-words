import Taro, { Component, Config } from "@tarojs/taro"
import { Provider } from "@tarojs/mobx"

import store from "./store"

import Index from "./pages/index"
import "./app.less"
import "./styles/custom-theme.scss"

class App extends Component {
  componentWillMount() {
    // 自动更新版本
    if (Taro.canIUse("getUpdateManager")) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            Taro.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function(res) {
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            Taro.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            })
          })
        }
      })
    }
  }

  componentDidMount() {
    // 初始化数据库(小程序端和云函数都要执行)
    const CLOUD_ID = "cloud-db-0kmga"
    Taro.cloud.init({ env: CLOUD_ID })
  }

  // 小程序全局配置(https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/post-create/index",
      "pages/post-edit/index",
      "pages/post-detail/index",
      "pages/account/index",
      "pages/settings/index",
      "pages/messages/index",
      "pages/about/index",

      // 后台管理
      "pages/admin-center/index",
      "pages/test-page/index"
    ],
    window: {
      // 页面(类似html)背景色, 下拉loading的颜色
      backgroundColor: "#f6f6f6",
      backgroundTextStyle: "dark",

      navigationBarBackgroundColor: "#ff5252",
      navigationBarTitleText: "Words",
      navigationBarTextStyle: "white"
    },

    tabBar: {
      list: [
        {
          pagePath: "pages/index/index",
          text: "",
          iconPath: "assets/icons/home.png",
          selectedIconPath: "assets/icons/home-active.png"
        },
        {
          pagePath: "pages/post-create/index",
          text: "",
          iconPath: "assets/icons/plus.png",
          selectedIconPath: "assets/icons/plus.png"
        },
        {
          pagePath: "pages/account/index",
          text: "",
          iconPath: "assets/icons/mine.png",
          selectedIconPath: "assets/icons/mine-active.png"
        }
      ]
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById("app"))
