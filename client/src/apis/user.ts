import fetch from '@/utils/fetch'
import { IWXUser, IUser } from '@/models/user'

export async function apiGetAdmin(): Promise<{ openid: string }[]> {
  const { data = [] } = await fetch('admin')
  return data
}

export async function apiLogin(): Promise<IUser> {
  const { data = {} } = await fetch('user/login')
  return data
}

export async function apiSignUp(user: IWXUser) {
  await fetch('user/sign-up', { user })
}
