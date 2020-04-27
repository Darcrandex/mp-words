import fetch from '@/utils/fetch'
import { IPost, IPostCreate } from '@/models/post'

// 获取列表
export async function apiGetPosts(page = 1): Promise<{ list: IPost[]; total: number }> {
  const {
    data: { list, total },
  } = await fetch('post/list', { page })
  return { list, total }
}

// 新增
export async function apiAddPost(post: IPostCreate): Promise<string> {
  const { data } = await fetch('post/add', { ...post })
  return data
}

// 获取详情
export async function apiGetPost(id: string): Promise<IPost> {
  const { data } = await fetch('post/detail', { id })
  return data
}

// 更新帖子
export interface IUpdateParams extends IPostCreate {
  id: string
}
export async function apiUpdatePost(form: IUpdateParams): Promise<any> {
  const { data } = await fetch('post/update', form)
  return data
}

// 删除帖子
export async function apiRemovePost(id: string): Promise<any> {
  const { data } = await fetch('post/remove', { id })
  return data
}

// 点赞
export async function apiLike(postId: string): Promise<void> {
  await fetch('post/like', { id: postId })
}

// 收藏
export async function apiCollect(postId: string): Promise<void> {
  await fetch('post/collect', { id: postId })
}

// 按类型获取列表
export type QueryType = 'all' | 'like' | 'collect'
export async function apiGetPostsByType(page = 1, type: QueryType = 'all'): Promise<{ list: IPost[]; total: number }> {
  const {
    data: { list = [], total = 0 },
  } = await fetch('post/list-by-type', { page, type })
  return { list, total }
}
