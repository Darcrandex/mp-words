import { IUserBase } from './user'
// 创建时
export interface IPostCreate {
  img: string
  content: string
  from: string
}

// 保存在后台的/接口返回的
export interface IPostBase extends IPostCreate {
  _id: string //创建时,后台生成
  openid: string //controller层添加
  createDate: number //controller层添加
  updateDate: number //controller层添加
  readed?: number //查看次数
}

// 在前端列表展示的
export interface IPost extends IPostBase {
  likeTotal: number
  collectTotal: number
  like: boolean
  collect: boolean
  author: IUserBase
}
