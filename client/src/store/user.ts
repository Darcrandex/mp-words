import { observable, action, computed, runInAction } from 'mobx'
import { IWXUser, IUser } from '@/models/user'
import { apiLogin, apiSignUp } from '@/apis/user'

export interface IUserStore {
  info: IUser
  isLogin: boolean
  login: () => Promise<any>
  signUp: (info: IWXUser) => Promise<any>
}

class UserStore implements IUserStore {
  @observable info: IUser = {
    _id: '',
    openid: '',
    avatarUrl: '',
    city: 'city',
    country: 'country',
    gender: 0,
    language: '',
    nickName: 'nick name',
    province: 'province',
    cover: '',
  }

  @computed
  get isLogin() {
    return Boolean(this.info.openid)
  }

  @action
  login = async () => {
    // 通过openid查询用户表
    const user = await apiLogin()
    runInAction(() => {
      this.info = user
    })
  }

  @action
  signUp = async (user: IWXUser) => {
    // 用户授权后台注册
    await apiSignUp(user)
  }
}

export default new UserStore()
