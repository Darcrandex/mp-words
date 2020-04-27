import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text, Image } from "@tarojs/components"

import logo from "@/assets/images/words-logo.png"
import "./styles.less"

export default class About extends Component {
  config: Config = {
    navigationBarTitleText: "About"
  }

  render() {
    return (
      <View className="container">
        <Image src={logo} className="logo" />
        <Text className="title">Just Words</Text>
        <Text className="sub_text">There's always some words that moves you.</Text>
        <Text className="sub_text">made by Darcrand</Text>
      </View>
    )
  }
}
