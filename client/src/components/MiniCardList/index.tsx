import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { IPost } from '@/models/post'

import MiniCard from '@/components/MiniCardItem'

import './styles.less'

interface IProps {
  visible: boolean
  list: IPost[]
}

class MiniCardList extends Component<IProps> {
  static defaultProps = {
    visible: false,
    list: [],
  }

  onItemClick = (id: string) => {
    Taro.navigateTo({ url: '/pages/post-detail/index?id=' + id })
  }

  render() {
    const { visible, list } = this.props
    const isEmpty = list.length === 0
    const col1 = list.filter((_v, index) => index % 2 === 0)
    const col2 = list.filter((_v, index) => index % 2 !== 0)

    return (
      <View className={visible ? 'container' : 'container hide'}>
        {!isEmpty && (
          <View className="mini-card-list-col left">
            {col1.map(v => (
              <MiniCard key={v._id} data={v} onClick={this.onItemClick} />
            ))}
          </View>
        )}

        {!isEmpty && (
          <View className="mini-card-list-col right">
            {col2.map(v => (
              <MiniCard key={v._id} data={v} onClick={this.onItemClick} />
            ))}
          </View>
        )}

        {isEmpty && (
          <View className="empty-tips">
            <Text>Empty</Text>
          </View>
        )}
      </View>
    )
  }
}

export default MiniCardList
