import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { IPost } from '@/models/post'

import './styles.less'

const DESIGN_WIDTH = 750
// 全局定义的间隙,需要同步 'src\styles\variables.less' @spacing
const SPACING = 40
const DESIGN_IMAGE_WIDTH = DESIGN_WIDTH / 2 - 1.5 * SPACING

interface IProps {
  data: IPost
  onClick?: (id: string) => void
}

class MiniCardItem extends Component<IProps> {
  state = {
    loaded: false,
    height: `${DESIGN_IMAGE_WIDTH}rpx`,
  }

  onLoadImage = event => {
    const {
      detail: { width, height },
    } = event
    const h = Math.floor((DESIGN_IMAGE_WIDTH * height) / width)

    this.setState({ loaded: true, height: h + 'rpx' })
  }

  render() {
    const { data, onClick } = this.props
    const { loaded, height } = this.state
    return (
      <View className="container" onClick={() => onClick && onClick(data._id as string)}>
        <View className="img-wrapper">
          <Image
            src={data.img}
            className={loaded ? 'img show' : 'img'}
            style={{ height }}
            mode="aspectFill"
            onLoad={this.onLoadImage}
          />
        </View>

        <Text className="content">{data.content}</Text>
      </View>
    )
  }
}

export default MiniCardItem
