import Taro, { Component, Config } from "@tarojs/taro"
import { observer, inject } from "@tarojs/mobx"
import { View } from "@tarojs/components"
import { AtButton, AtMessage, AtModal } from "taro-ui"

import { IPostCreate } from "@/models/post"
import { IAppStore, IPostStore } from "@/store"

import PostForm from "@/components/PostForm"
import { apiGetPost } from "@/apis/post"

import "./styles.less"

interface IProps {
  appStore: IAppStore
  postStore: IPostStore
  [key: string]: any
}

interface IState {
  id: string
  loaded: boolean
  data: IPostCreate
  visibleRemove: boolean
}

@inject("appStore", "postStore")
@observer
export default class PostEdit extends Component<IProps, IState> {
  state = {
    id: "",
    loaded: false,

    data: {
      img: "",
      content: "",
      from: ""
    },

    visibleRemove: false
  }

  componentDidMount() {
    this.onInit()
  }

  config: Config = {
    navigationBarTitleText: "Edit"
  }

  onInit = () => {
    const { id = "" } = this.$router.params
    this.setState({ id }, this.getDetial)
  }

  getDetial = async () => {
    try {
      const { id = "" } = this.state
      const { img, content, from } = await apiGetPost(id)
      this.setState({ loaded: true, data: { img, content, from } })
    } catch (err) {
      console.log("获取帖子详情失败(重编辑)", err)
    }
  }

  onFormChange = (data: IPostCreate) => {
    this.setState({ data })
  }

  onSubmit = async () => {
    const { id } = this.state
    const { content, from, img } = this.state.data

    if (!content) {
      Taro.atMessage({ message: "input your words", type: "warning" })
      return
    }
    if (!from) {
      Taro.atMessage({ message: "input the source", type: "warning" })
      return
    }
    if (!img) {
      Taro.atMessage({ message: "choose an image", type: "warning" })
      return
    }

    try {
      await this.props.postStore.update({ id, ...this.state.data })
      Taro.navigateBack()
    } catch (err) {
      console.log("修改帖子失败", err)
    }
  }

  onRemoveEvents = (confirm?: boolean) => {
    this.setState({ visibleRemove: false })
    confirm && this.onRemove()
  }

  onRemove = async () => {
    try {
      const { id = "" } = this.state
      await this.props.postStore.remove(id)
    } catch (err) {
      console.log("删除帖子失败", err)
    }
  }

  render() {
    const {
      appStore: { isFullScreen }
    } = this.props

    const {
      loaded,
      data: { img, content, from },
      visibleRemove
    } = this.state
    return (
      <View className={isFullScreen ? "container full-screen" : "container"}>
        <AtMessage />

        <AtModal
          isOpened={visibleRemove}
          title="Warning"
          cancelText="Cancel"
          confirmText="Remove"
          onClose={() => this.onRemoveEvents()}
          onCancel={() => this.onRemoveEvents()}
          onConfirm={() => this.onRemoveEvents(true)}
          content="Are you sure you want to remove this post?"
        />

        {loaded && <PostForm data={{ img, content, from }} onChange={this.onFormChange} />}

        <View className={isFullScreen ? "submit-bar full-screen" : "submit-bar"}>
          <View className="btn">
            <AtButton
              type="secondary"
              onClick={() => {
                this.setState({ visibleRemove: true })
              }}
            >
              Remove
            </AtButton>
          </View>
          <View className="btn">
            <AtButton type="primary" onClick={this.onSubmit}>
              Update
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}
