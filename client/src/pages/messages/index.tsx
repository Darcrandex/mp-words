import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAccordion, AtBadge } from 'taro-ui'

import './styles.less'

export default class Messages extends Component {
  state = {
    list: [
      {
        id: '001',
        open: false,
        dot: true,
        title: 'systom message',
        content: '欢迎使用 <片语>',
      },
      {
        id: '002',
        open: false,
        dot: true,
        title: 'systom message',
        content: '欢迎使用 <片语>',
      },
    ],
  }

  config: Config = {
    navigationBarTitleText: 'Messages',
  }

  onToggleOpen = (id: string) => {
    const { list } = this.state
    const nextList = list.map(v => (v.id === id ? { ...v, open: !v.open } : v))
    this.setState({ list: nextList })
  }

  render() {
    const { list } = this.state

    return (
      <View>
        {list.map(v => (
          <View key={v.id} className="msg-item">
            <View className={v.dot ? 'dot visible' : 'dot'}></View>

            <View className="content-wrapper">
              <AtAccordion title={v.title} open={v.open} isAnimation={false} onClick={() => this.onToggleOpen(v.id)}>
                <View className="content">
                  <Text>{v.content}</Text>
                </View>
              </AtAccordion>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
