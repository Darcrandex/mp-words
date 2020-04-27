import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'

import FormImagePreview from '@/components/FormImagePreview'
import FormTitle from '@/components/FormTitle'
import { IPostCreate } from '@/models/post'

interface IProps {
  data: IPostCreate
  onChange?: (form: IPostCreate) => any
}

export default class PostForm extends Component<IProps> {
  static defaultProps = { data: { img: '', content: '', from: '' }, onChange: () => {} }

  onFormChange = <K extends keyof IPostCreate>(key: K) => (arg: boolean | string | object) => {
    let value = arg
    if (typeof arg === 'object') {
      value = arg['detail']['value']
    }

    this.props.onChange && this.props.onChange({ ...this.props.data, [key]: value })
  }

  onImagesChange = () => {
    Taro.chooseImage({ count: 1 }).then(res => {
      const {
        tempFilePaths: [src = ''],
      } = res
      this.props.onChange && this.props.onChange({ ...this.props.data, img: src })
    })
  }

  render() {
    const { img, from, content } = this.props.data

    return (
      <View className="container">
        <FormTitle>Your words</FormTitle>
        <AtTextarea
          maxLength={100}
          placeholder="eg: Love look not with the eyes, but with the mind."
          showConfirmBar
          height={200}
          value={content}
          onChange={this.onFormChange('content')}
        />

        <FormTitle>Source from</FormTitle>
        <AtTextarea
          value={from}
          onChange={this.onFormChange('from')}
          maxLength={30}
          placeholder="eg:  William Shakespeare"
          showConfirmBar
        />

        <FormTitle>Cover</FormTitle>
        <FormImagePreview img={img} onImagesChange={this.onImagesChange} />
      </View>
    )
  }
}
