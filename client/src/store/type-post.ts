/**
 * @description 用户中心-按类型区分的列表
 */
import { observable, action, runInAction } from 'mobx'

import { IPost } from '@/models/post'
import { QueryType, apiGetPostsByType } from '@/apis/post'

interface IListBase {
  list: IPost[]
  total: number
  pageNumber: number
  isNoMore: boolean
}

export interface ITypePostStore {
  allState: IListBase
  likeState: IListBase
  collectState: IListBase
  init: () => Promise<any>
  getPosts: (type: QueryType) => Promise<any>
  loadMore: (type: QueryType) => Promise<any>
}

class TypePostStore implements ITypePostStore {
  @observable allState: IListBase = {
    list: [],
    total: 0,
    pageNumber: 1,
    isNoMore: false,
  }
  @observable likeState: IListBase = {
    list: [],
    total: 0,
    pageNumber: 1,
    isNoMore: false,
  }
  @observable collectState: IListBase = {
    list: [],
    total: 0,
    pageNumber: 1,
    isNoMore: false,
  }

  @action
  init = async () => {
    return Promise.all([this.getPosts('all'), this.getPosts('like'), this.getPosts('collect')])
  }

  @action
  getPosts = async (type: QueryType) => {
    const { list, total } = await apiGetPostsByType(1, type)
    runInAction(() => {
      const nextState = { list, total, pageNumber: 1, isNoMore: list.length === total }
      if (type === 'all') {
        this.allState = nextState
      } else if (type === 'like') {
        this.likeState = nextState
      } else {
        this.collectState = nextState
      }
    })
  }

  @action
  loadMore = async (type: QueryType) => {
    let target = type === 'all' ? this.allState : type === 'like' ? this.likeState : this.collectState
    if (target.isNoMore) {
      return
    }
    const { list, total } = await apiGetPostsByType(target.pageNumber + 1, type)

    runInAction(() => {
      const nextList = target.list.concat(list)
      const nextState = {
        list: nextList,
        total,
        pageNumber: target.pageNumber + 1,
        isNoMore: nextList.length === total,
      }
      if (type === 'all') {
        this.allState = nextState
      } else if (type === 'like') {
        this.likeState = nextState
      } else {
        this.collectState = nextState
      }
    })
  }
}

export default new TypePostStore()
