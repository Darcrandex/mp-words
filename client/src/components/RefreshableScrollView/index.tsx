import Taro, { Component } from '@tarojs/taro'
import { ITouchEvent } from '@tarojs/components/types/common'
import { View, Text, ScrollView } from '@tarojs/components'

import './styles.less'

enum REFRESH_STATUS {
  NORMAL,
  REFRESH,
}

interface IPos {
  x: number
  y: number
}

interface IProps {
  height: number | string
  refreshing: boolean
  refresherThreshold?: number
  onRefresh?: (event?: any) => any
}

interface IState {
  scrollViewTop: number
  startPos: IPos
  touching: boolean
  status: REFRESH_STATUS

  preRefreshing: boolean
}

const ELASTIC_COEFFICIENT = 3.5 //下拉弹性系数
const MAX_DEVIATION = 0.3 //水平位移与垂直位移的最大比例,超过则不处理

export default class extends Component<IProps, IState> {
  static defaultProps = {
    refresherThreshold: 50,
    onRefresh: null,
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (state.preRefreshing && !props.refreshing) {
      return {
        scrollViewTop: 0,
        status: REFRESH_STATUS.NORMAL,
        preRefreshing: false,
      }
    }
    return null
  }

  state = {
    scrollViewTop: 0,
    startPos: { x: 0, y: 0 },
    touching: false,
    status: REFRESH_STATUS.NORMAL,
    preRefreshing: false,
  }

  onTouchStart = (event: ITouchEvent) => {
    if (this.props.refreshing) {
      return
    }
    this.setState({ startPos: { x: event.touches[0].clientX, y: event.touches[0].clientY } })
  }

  onTouchMove = (event: ITouchEvent) => {
    if (this.props.refreshing) {
      return
    }
    const endPos: IPos = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    const { refresherThreshold } = this.props
    const { startPos } = this.state

    const maxThreshold = (refresherThreshold as number) + 20
    const touchDeviation = Math.abs(endPos.x - startPos.x) / Math.abs(endPos.y - startPos.y)

    if (touchDeviation > MAX_DEVIATION) {
      return
    }

    // 计算容器滑动位置
    let offsetY = Math.floor(Math.min((endPos.y - startPos.y) / ELASTIC_COEFFICIENT, maxThreshold))

    if (offsetY > 0) {
      // 下拉
      this.setState({
        scrollViewTop: offsetY,
        touching: true,
        status: offsetY > (refresherThreshold as number) ? REFRESH_STATUS.REFRESH : REFRESH_STATUS.NORMAL,
      })
    }
  }

  onTouchEnd = () => {
    if (this.props.refreshing) {
      return
    }
    const { status } = this.state
    const shouldRefresh = status === REFRESH_STATUS.REFRESH
    const scrollViewTop = shouldRefresh ? (this.props.refresherThreshold as number) : 0
    this.setState({ touching: false, scrollViewTop, preRefreshing: shouldRefresh })

    if (shouldRefresh) {
      this.props.onRefresh && this.props.onRefresh()
    }
  }

  render() {
    const { height, refreshing } = this.props
    const scrollHeight = typeof height === 'number' ? `${height}px` : height
    const { scrollViewTop, touching } = this.state

    return (
      <View className="container" style={{ height: scrollHeight }}>
        <View className="top-tips">
          <Text>{refreshing ? 'refreshing' : 'ready'}</Text>
        </View>

        <ScrollView
          className={touching ? 'scroll-wrapper' : 'scroll-wrapper scrollable'}
          scrollWithAnimation
          scrollY={!touching && !refreshing}
          style={{ top: `${scrollViewTop}px` }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          {this.props.children}
        </ScrollView>
      </View>
    )
  }
}
