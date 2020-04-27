import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './styles.less'

export default class About extends Component {
  config: Config = {
    navigationBarTitleText: 'About',
  }

  render() {
    return (
      <View className="container">
        <Image src="" className="logo" />
        <Text>Just Words</Text>
      </View>
    )
  }
}
