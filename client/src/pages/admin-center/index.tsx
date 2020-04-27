import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class AdminCenter extends Component {
  componentDidMount() {
    console.log('mount')
  }

  config: Config = {
    navigationBarTitleText: '后台管理',
  }

  render() {
    return (
      <View>
        <Text>后台管理</Text>
      </View>
    )
  }
}
