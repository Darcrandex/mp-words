import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'

import './styles.less'

export default function FormTitle({ children = '' }: { children: any }) {
  return <Text className="form-title">{children}</Text>
}
