/**
 * @description 首页的全部帖子列表
 */
import { observable, action, computed, runInAction } from 'mobx'
import { IPostCreate, IPost } from '@/models/post'
import { apiUploadFile, apiDeleteFile } from '@/apis/files'
import {
  IUpdateParams,
  apiGetPosts,
  apiAddPost,
  apiGetPost,
  apiRemovePost,
  apiUpdatePost,
  apiLike,
  apiCollect,
} from '@/apis/post'

const CLOUD_FILE_PATH_REGX = /^cloud/ //云存储文件的路径

export interface IPostStore {
  list: IPost[]
  total: number
  pageNumber: number
  isNoMore: boolean
  getPosts: () => Promise<any>
  loadMore: () => Promise<any>
  add: (info: IPostCreate) => Promise<any>
  update: (params: IUpdateParams) => Promise<any>
  remove: (id: string) => Promise<any>
  toggleLike: (id: string) => Promise<any>
  toggleCollect: (id: string) => Promise<any>
}

class PostStore implements IPostStore {
  @observable list: IPost[] = []
  @observable total = 0
  @observable pageNumber = 1

  @computed
  get isNoMore() {
    return this.list.length === this.total
  }

  @action
  getPosts = async () => {
    const { list, total } = await apiGetPosts()
    runInAction(() => {
      this.pageNumber = 1
      this.list = list
      this.total = total
    })
  }

  @action
  loadMore = async () => {
    if (this.isNoMore) {
      return
    }
    const { list, total } = await apiGetPosts(this.pageNumber + 1)
    runInAction(() => {
      if (list && list.length) {
        this.list.push(...list)
        this.total = total

        this.pageNumber++
      }
    })
  }

  @action
  add = async (info: IPostCreate) => {
    const { img, content, from } = info

    const fileID = await apiUploadFile(img)
    await apiAddPost({ content, from, img: fileID })
    this.getPosts()
  }

  @action
  update = async (params: IUpdateParams) => {
    let img = params.img

    // 如果图片路径不是云存储路径,说明是新图片
    if (img.length > 0 && !CLOUD_FILE_PATH_REGX.test(img)) {
      // 先删除旧图片
      const { img: prevImage } = await apiGetPost(params.id)
      await apiDeleteFile(prevImage)

      // 再上传新图片,并更新表单img
      const fileID = await apiUploadFile(img)
      img = fileID
    }

    await apiUpdatePost({ ...params, img })
    this.getPosts()
  }

  @action
  remove = async (id = '') => {
    const { img } = await apiGetPost(id)
    await apiDeleteFile(img)
    await apiRemovePost(id)
    this.getPosts()
  }

  @action
  toggleLike = async (id = '') => {
    await apiLike(id)
    this.getPosts()
  }

  @action
  toggleCollect = async (id = '') => {
    await apiCollect(id)
    this.getPosts()
  }
}

export default new PostStore()
