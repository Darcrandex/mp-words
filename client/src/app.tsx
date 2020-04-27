import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'

import store from './store'

import Index from './pages/index'
import './app.less'
import './styles/custom-theme.scss'

class App extends Component {
  componentDidMount() {
    // 初始化数据库(小程序端和云函数都要执行)
    const CLOUD_ID = 'cloud-db-0kmga'
    Taro.cloud.init({ env: CLOUD_ID })
  }

  // 小程序全局配置(https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/post-create/index',
      'pages/post-edit/index',
      'pages/post-detail/index',
      'pages/account/index',
      'pages/settings/index',
      'pages/messages/index',
      'pages/about/index',

      // 后台管理
      'pages/admin-center/index',
      'pages/test-page/index',
    ],
    window: {
      // 页面(类似html)背景色, 下拉loading的颜色
      backgroundColor: '#f6f6f6',
      backgroundTextStyle: 'dark',

      navigationBarBackgroundColor: '#ff5252',
      navigationBarTitleText: 'Words',
      navigationBarTextStyle: 'white',
    },

    tabBar: {
      list: [
        {
          pagePath: 'pages/index/index',
          text: '',
          iconPath: 'assets/icons/home.png',
          selectedIconPath: 'assets/icons/home-active.png',
        },
        {
          pagePath: 'pages/post-create/index',
          text: '',
          iconPath: 'assets/icons/plus.png',
          selectedIconPath: 'assets/icons/plus.png',
        },
        {
          pagePath: 'pages/account/index',
          text: '',
          iconPath: 'assets/icons/mine.png',
          selectedIconPath: 'assets/icons/mine-active.png',
        },
      ],
    },
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
