import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './styles.less'

const DESIGN_IMAGE_WIDTH = 670

interface IProps {
  img: string
  onImagesChange?: () => void
}

export default class FormImagePreview extends Component<IProps> {
  state = { height: DESIGN_IMAGE_WIDTH + 'rpx' }

  onLoadImage = event => {
    const {
      detail: { width, height },
    } = event
    const h = Math.floor((DESIGN_IMAGE_WIDTH * height) / width)

    this.setState({ height: h + 'rpx' })
  }

  render() {
    const { img, onImagesChange } = this.props
    const { height } = this.state

    return (
      <View className="image-preview-container" onClick={() => onImagesChange && onImagesChange()}>
        <Image src={img} mode="aspectFill" className="image-preview" style={{ height }} onLoad={this.onLoadImage} />

        {!img && (
          <View className="image-preview-ico">
            <AtIcon value="camera" size="50rpx"></AtIcon>
          </View>
        )}
      </View>
    )
  }
}
