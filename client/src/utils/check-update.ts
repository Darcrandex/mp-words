// 检测版本更新
import Taro from "@tarojs/taro"

export default function checkUpdate(showMessage = false) {
  if (Taro.canIUse("getUpdateManager")) {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          Taro.showModal({
            title: "Tips",
            content: "A new version is ready, relaunch now?",
            success: function(res) {
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            },
            cancelText: "cancel",
            confirmText: "relaunch",
            confirmColor: "#ff5252"
          })
        })
        updateManager.onUpdateFailed(function() {
          Taro.showModal({
            title: "Tips",
            content: "A new version is available, remove this mini-program, and relaunch.",
            confirmText: "ok",
            confirmColor: "#ff5252",
            showCancel: false
          })
        })
      } else if (showMessage) {
        Taro.showModal({
          title: "Tips",
          content: "Current version is lastest.",
          confirmText: "ok",
          confirmColor: "#ff5252",
          showCancel: false
        })
      }
    })
  }
}
