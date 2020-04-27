/**
 * @description 个人中心
 * @description 背景图片使用'Image'而不是'background-image'是因为云图片不能使用背景图片
 */

import Taro, { Component, Config } from "@tarojs/taro"
import { observer, inject } from "@tarojs/mobx"
import { View, Text, Image } from "@tarojs/components"
import { AtButton, AtIcon, AtBadge } from "taro-ui"

import { IUserStore, ITypePostStore } from "@/store"
import Divider from "@/components/Divider"
import Tabs, { ITabItem } from "@/components/Tabs"
import MiniCardList from "@/components/MiniCardList"
import { getRealAvatar } from "@/utils"
import { QueryType } from "@/apis/post"

import icoMale from "@/assets/icons/ico-male.png"
import icoFemale from "@/assets/icons/ico-female.png"

import "./styles.less"

const defaultCover =
  "cloud://cloud-db-0kmga.636c-cloud-db-0kmga-1301275025/account-default-cover.jpg"

const genderIcos = ["", icoMale, icoFemale]

interface IProps {
  userStore: IUserStore
  typePostStore: ITypePostStore
}

@inject("userStore", "typePostStore")
@observer
export default class Admin extends Component<IProps> {
  state = {
    current: 0,

    backgroundLoaded: false,
    avatarLoaded: false,

    list: []
  }

  componentDidMount() {
    this.onInit()
  }

  config: Config = {
    navigationBarTitleText: "Mine",
    enablePullDownRefresh: true,
    onReachBottomDistance: 100
  }

  async onPullDownRefresh() {
    try {
      await this.onInit()
    } catch (err) {
      console.error("加载失败", err)
    } finally {
      Taro.stopPullDownRefresh()
    }
  }

  async onReachBottom() {
    const { current } = this.state

    try {
      const types = ["all", "like", "collect"]
      await this.props.typePostStore.loadMore(types[current] as QueryType)
    } catch (err) {
      console.error("加载失败", err)
    }
  }

  onInit = async () => {
    try {
      await this.props.userStore.login()
      await this.props.typePostStore.init()
    } catch (err) {
      console.log("获取失败", err)
    }
  }

  authorize = async (event: any) => {
    const {
      detail: { userInfo = null }
    } = event

    try {
      if (userInfo) {
        // 授权成功
        await this.props.userStore.signUp(userInfo)
        this.onInit()
      }
    } catch (err) {
      console.error("授权失败")
    }
  }

  onTab = (index = 0) => {
    this.setState({ current: index })
  }

  onImageLoad = (key: "background" | "avatar") => {
    this.setState({ [`${key}Loaded`]: true })
  }

  render() {
    const {
      info: { nickName, gender, avatarUrl, city, province, country, cover },
      isLogin
    } = this.props.userStore
    const { allState, likeState, collectState } = this.props.typePostStore

    const { current, backgroundLoaded, avatarLoaded } = this.state
    const genderUrl = genderIcos[gender || 0]

    const tabs: ITabItem[] = [
      { title: "words", count: allState.total },
      { title: "like", count: likeState.total },
      { title: "collect", count: collectState.total }
    ]

    return (
      <View className="container">
        <View className="background-image-wrapper">
          <Image
            src={cover || defaultCover}
            className={backgroundLoaded ? "background-image image-loaded" : "background-image"}
            mode="aspectFill"
            onLoad={() => this.onImageLoad("background")}
          />
        </View>

        <View className="empty-fixed"></View>

        <View className="content-wrapper">
          <View className="avatar-container">
            <View className="avatar-wrapper">
              <Image
                src={getRealAvatar(avatarUrl)}
                className={avatarLoaded ? "avatar image-loaded" : "avatar"}
                onLoad={() => this.onImageLoad("avatar")}
              />
            </View>
          </View>

          <View className="info-line">
            <Text>{nickName}</Text>
            {genderUrl && <Image src={genderUrl} className="gender-ico" />}
          </View>

          <Text className="addr-line">{`${city}, ${province}, ${country}`}</Text>

          <Divider />

          {!isLogin && (
            <View className="login-button">
              <AtButton type="primary" openType="getUserInfo" onGetUserInfo={this.authorize}>
                Log In
              </AtButton>
            </View>
          )}

          {isLogin && (
            <View>
              <Tabs list={tabs} current={current} onTab={this.onTab} />
              <MiniCardList visible={0 === current} list={allState.list} />
              <MiniCardList visible={1 === current} list={likeState.list} />
              <MiniCardList visible={2 === current} list={collectState.list} />
            </View>
          )}
        </View>

        {isLogin && (
          <View className="top-menus">
            {/* <View
              className="menu-btn"
              onClick={() => {
                Taro.navigateTo({ url: '/pages/messages/index' })
              }}
            >
              <AtBadge dot>
                <AtIcon value="bell" />
              </AtBadge>
            </View> */}
            <View
              className="menu-btn"
              onClick={() => {
                Taro.navigateTo({ url: "/pages/settings/index" })
              }}
            >
              <AtIcon value="settings" />
            </View>
          </View>
        )}
      </View>
    )
  }
}
