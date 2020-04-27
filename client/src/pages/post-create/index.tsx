import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import { View } from '@tarojs/components'
import { AtButton, AtMessage } from 'taro-ui'

import { IPostStore } from '@/store'
import PostForm from '@/components/PostForm'
import { IPostCreate } from '@/models/post'

import './styles.less'

interface IProps {
  postStore: IPostStore
  [key: string]: any
}

interface State {
  data: IPostCreate
  [key: string]: any
}

@inject('postStore')
@observer
export default class PostEdit extends Component<IProps, State> {
  state = {
    data: {
      img: '',
      content: '',
      from: '',
    },
  }

  config: Config = {
    navigationBarTitleText: 'New',
  }

  onFormChange = (data: IPostCreate) => {
    this.setState({ data })
  }

  onSubmit = async () => {
    const { content, from, img } = this.state.data

    if (!content) {
      Taro.atMessage({ message: 'input your words', type: 'warning' })
      return
    }
    if (!from) {
      Taro.atMessage({ message: 'input the source', type: 'warning' })
      return
    }
    if (!img) {
      Taro.atMessage({ message: 'choose an image', type: 'warning' })
      return
    }

    try {
      await this.props.postStore.add({ content, from, img })
      this.setState({ data: { img: '', content: '', from: '' } })

      Taro.switchTab({ url: '/pages/index/index' })
    } catch (err) {
      console.error('新增失败', err)
    }
  }

  render() {
    const { img, from, content } = this.state.data

    return (
      <View className="container">
        <AtMessage />

        <PostForm data={{ img, content, from }} onChange={this.onFormChange} />

        <View className="submit-btn">
          <AtButton type="primary" onClick={this.onSubmit}>
            Publish
          </AtButton>
        </View>
      </View>
    )
  }
}
