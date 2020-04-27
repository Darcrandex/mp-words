/**
 * @description 帖子详情
 */

import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { inject, observer } from '@tarojs/mobx'
import { apiGetAdmin } from '@/apis/user'
import { apiGetPost } from '@/apis/post'
import { IPost } from '@/models/post'
import { IUserStore } from '@/store'
import { numberAbbreviation, dateFormatEN } from '@/utils'

import './styles.less'

interface IState {
  data: IPost
  [key: string]: any
}

const DESIGN_WIDTH = 750

@inject('userStore')
@observer
class PostDetail extends Component<{ userStore: IUserStore }, IState> {
  state = {
    data: {
      img: '',
      content: '',
      from: '',
      _id: '',
      openid: '',
      createDate: 0,
      updateDate: 0,
      readed: 0,
      likeTotal: 0,
      collectTotal: 0,
      like: false,
      collect: false,
      author: {
        avatarUrl: '',
        nickName: '',
      },
    },
    imageLoaded: false,
    avatarLoaded: false,

    editable: false,

    imageRealHeight: 0.5 * DESIGN_WIDTH + 'rpx',
  }

  componentDidShow() {
    this.getDetial()
  }

  config: Config = {
    navigationBarTitleText: 'Detail',
  }

  getDetial = async () => {
    try {
      const { id = '' } = this.$router.params
      const data = await apiGetPost(id)
      const admins = await apiGetAdmin()
      const { openid } = this.props.userStore.info
      const editable = data.openid === openid || admins.some(v => v.openid === data.openid)

      this.setState({ data, editable })
    } catch (err) {
      console.log('获取帖子详情失败', err)
    }
  }

  onImageLoad = (key: 'imageLoaded' | 'avatarLoaded' = 'imageLoaded') => event => {
    this.setState({ [key]: true })

    if (key === 'imageLoaded') {
      const {
        detail: { width, height },
      } = event
      const h = Math.floor((DESIGN_WIDTH * height) / width)
      this.setState({ imageRealHeight: h + 'rpx' })
    }
  }

  render() {
    const { data, editable, imageLoaded, imageRealHeight } = this.state
    const { year, month, date } = dateFormatEN(data.createDate)
    const dateStr = `${date} ${month} ${year}`

    return (
      <View className="container">
        <View className="img-wrapper">
          <Image
            src={data.img}
            className={imageLoaded ? 'img show' : 'img'}
            mode="aspectFill"
            onLoad={this.onImageLoad('imageLoaded')}
            style={{ height: imageRealHeight }}
          />
        </View>

        <View className="from-text">
          <Text>{data.from}</Text>
        </View>
        <View className="content-text">
          <Text>{data.content}</Text>
        </View>

        <View className="info-bar">
          <View className="at-icon at-icon-eye info-ico"></View>
          <Text className="info-value">{numberAbbreviation(data.readed || 0)}</Text>
          <View className="at-icon at-icon-heart info-ico"></View>
          <Text className="info-value">{numberAbbreviation(data.likeTotal)}</Text>
          <View className="at-icon at-icon-star info-ico"></View>
          <Text className="info-value">{numberAbbreviation(data.collectTotal)}</Text>

          <Text className="info-date">{dateStr}</Text>
        </View>

        <View className="operation-bar">
          <View className={data.like ? 'at-icon at-icon-heart-2 btn' : 'at-icon at-icon-heart btn'}></View>
          <View className={data.collect ? 'at-icon at-icon-star-2 btn' : 'at-icon at-icon-star btn'}></View>
          {editable && (
            <View
              className="at-icon at-icon-edit btn"
              onClick={() => Taro.navigateTo({ url: '/pages/post-edit/index?id=' + data._id })}
            ></View>
          )}
        </View>
      </View>
    )
  }
}

export default PostDetail
