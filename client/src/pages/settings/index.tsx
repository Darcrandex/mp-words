import Taro, { Component, Config } from '@tarojs/taro'
import { inject, observer } from '@tarojs/mobx'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { apiGetAdmin } from '@/apis/user'
import { IUserStore } from '@/store'

import './styles.less'
@inject('userStore')
@observer
export default class Settings extends Component<{ userStore: IUserStore }> {
  state = { isAdmin: false }

  componentDidMount() {
    this.onInit()
  }

  config: Config = {
    navigationBarTitleText: 'Settings',
  }

  onInit = async () => {
    try {
      const admins = await apiGetAdmin()
      this.setState({
        isAdmin: admins.some(v => v.openid === this.props.userStore.info.openid),
      })
    } catch (err) {}
  }

  render() {
    const { isAdmin } = this.state

    return (
      <View className="container">
        <View className="list-wrapper">
          <AtList>
            <AtListItem
              title="About"
              arrow="right"
              onClick={() => {
                Taro.navigateTo({ url: '/pages/about/index' })
              }}
            />
            {/* <AtListItem title="Account Cover" arrow="right" /> */}
          </AtList>
        </View>

        <View className="list-wrapper">
          <AtList>
            {isAdmin && (
              <AtListItem
                title="Admin"
                arrow="right"
                onClick={() => {
                  Taro.navigateTo({ url: '/pages/admin-center/index' })
                }}
              />
            )}
            <AtListItem title="Check Update" extraText="v0.1" />
          </AtList>
        </View>

        <View className="copy-right">
          <Text>Copyright © 2020. darcrandex@gmail.com</Text>
        </View>
      </View>
    )
  }
}
