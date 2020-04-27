import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './styles.less'

export interface ITabItem {
  title: string
  count: number
  dot?: boolean
}

interface IProps {
  list: ITabItem[]
  current: number
  onTab?: (index: number) => void
}

export default function({ list = [], current = 0, onTab }: IProps) {
  return (
    <View className="tabs-container">
      {list.map((v, i) => (
        <View
          key={`${i}-${v.title}`}
          className={i === current ? 'tab-item active' : 'tab-item'}
          onClick={() => onTab && onTab(i)}
        >
          <Text className="tab-item-text">{v.count}</Text>
          <Text className="tab-item-text">{v.title}</Text>
        </View>
      ))}
    </View>
  )
}
