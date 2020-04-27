import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './styles.less'

export default class TestPage extends Component {
  onPullDownRefresh() {
    console.log('刷新')

    setTimeout(() => {
      Taro.stopPullDownRefresh()
      console.log('完成')
    }, 2000)
  }

  config: Config = {
    backgroundColor: '#f6f6f6',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  }

  render() {
    return (
      <View>
        <Text>测试页面</Text>
      </View>
    )
  }
}
