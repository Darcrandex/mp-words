import Taro, { Component } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import { IPostStore } from '@/store'
import { IPost } from '@/models/post'
import { dateFormatEN } from '@/utils'
import './styles.less'

const MENU_BUTTON_SIZE = 20

interface IProps {
  postStore?: IPostStore
  data: IPost
}

@inject('postStore')
@observer
export default class CardItem extends Component<IProps> {
  static defaultProps = { data: {} }

  state = { loaded: false }

  onCoverImageLoad = () => {
    this.setState({ loaded: true })
  }

  render() {
    const { data } = this.props
    const { toggleLike, toggleCollect } = this.props.postStore!
    const { _id, img, content, from, createDate, author, like, collect } = data
    const { loaded } = this.state
    const { year, month, date } = dateFormatEN(createDate)

    return (
      <View className="container">
        <View
          className="content_wrapper"
          onClick={() => {
            Taro.navigateTo({ url: '/pages/post-detail/index?id=' + _id })
          }}
        >
          <Image
            src={img}
            mode="aspectFill"
            className={loaded ? 'bg-image show' : 'bg-image'}
            onLoad={this.onCoverImageLoad}
          />

          <View className="content">
            <Text className="date-line">{date}</Text>
            <Text className="year-line">{`${month} ${year}`}</Text>

            <Text className="article">{content}</Text>
            <Text className="from-line">from {from}</Text>

            <View className="footer">
              <Image src={author.avatarUrl} className="author-avatar" />
              <Text className="author-name">{author.nickName}</Text>

              <Button
                className="menu-btn"
                onClick={e => {
                  e && e.stopPropagation()
                  toggleLike(_id)
                }}
              >
                <AtIcon size={`${MENU_BUTTON_SIZE}rpx`} value={like ? 'heart-2' : 'heart'} />
              </Button>
              <Button
                className="menu-btn"
                onClick={e => {
                  e && e.stopPropagation()
                  toggleCollect(_id)
                }}
              >
                <AtIcon size={`${MENU_BUTTON_SIZE}rpx`} value={collect ? 'star-2' : 'star'} />
              </Button>

              {/* 
                分享通过'data-*'来设置参数,组件的'onShareAppMessage'会接受参数
              */}
              <Button
                className="menu-btn"
                openType="share"
                data-id={_id}
                data-content={content}
                data-img={img}
                onClick={e => {
                  e && e.stopPropagation()
                }}
              >
                <AtIcon size={`${MENU_BUTTON_SIZE}rpx`} value="share-2" />
              </Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
