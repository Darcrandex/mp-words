import Taro, { Component, Config } from "@tarojs/taro"
import { observer, inject } from "@tarojs/mobx"
import { View } from "@tarojs/components"

import { IAppStore, IPostStore } from "@/store"
import CardItem from "@/components/CardItem"
import "./styles.less"

interface IProps {
  appStore?: IAppStore
  postStore?: IPostStore
  [key: string]: any
}

@inject("appStore", "postStore")
@observer
export default class Index extends Component<IProps> {
  componentDidMount() {
    Taro.startPullDownRefresh()
    this.props.appStore!.getAppMessage()

    this.gotoShareDetail()
  }

  gotoShareDetail = () => {
    // 分享场景
    // 如果用户是点击分享链接进来的,判断路径中的'id',然后跳转的详情页面
    const { id = null } = this.$router.params
    if (id) {
      // 为了修复初始化时,直接跳转导致没有重置loading状态,顶部一直有loading的bug
      Taro.stopPullDownRefresh()
      Taro.navigateTo({ url: "/pages/post-detail/index?id=" + id })
    }
  }

  onShareAppMessage(options: any) {
    // 自定义分享内容
    return {
      title: options!.target!.dataset!.content,
      path: "/pages/index/index?id=" + options!.target!.dataset!.id,
      imageUrl: options!.target!.dataset!.img
    }
  }

  async onPullDownRefresh() {
    try {
      await this.props.postStore!.getPosts()
    } catch (err) {
      console.error("加载失败", err)
    } finally {
      Taro.stopPullDownRefresh()
    }
  }

  async onReachBottom() {
    try {
      await this.props.postStore!.loadMore()
    } catch (err) {
      console.error("加载失败", err)
    }
  }

  config: Config = {
    navigationBarTitleText: "Words",
    enablePullDownRefresh: true,
    onReachBottomDistance: 100
  }

  render() {
    const { list } = this.props.postStore!

    return (
      <View>
        {list.map((v) => (
          <CardItem key={v._id} data={v} />
        ))}
      </View>
    )
  }
}
