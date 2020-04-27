import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './styles.less'

export default function({ size = 'normal' }: { size?: 'normal' | 'small' | 'large' }) {
  const margin = size === 'normal' ? '30rpx' : size === 'small' ? '20rpx' : '40rpx'
  return <View className="divider" style={{ marginTop: margin, marginBottom: margin }}></View>
}
