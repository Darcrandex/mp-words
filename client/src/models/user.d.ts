export interface IUserBase {
  avatarUrl: string
  nickName: string
}

// 微信用户基本信息
export interface IWXUser extends IUserBase {
  city: string
  country: string
  gender: number // 0:未知, 1:男, 2:女
  language: string
  province: string
}

// 后台'user'表字段
export interface IUser extends IWXUser {
  _id: string
  openid: string
  cover: string //用户个人中心的封面
  rep?: number //声望
}
