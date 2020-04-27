import appStore, { IAppStore } from './app'
import postStore, { IPostStore } from './posts'
import typePostStore, { ITypePostStore } from './type-post'
import counterStore from './counter'
import userStore, { IUserStore } from './user'

export { IAppStore, IPostStore, ITypePostStore, IUserStore }

export default {
  appStore,
  postStore,
  typePostStore,
  counterStore,
  userStore,
}
