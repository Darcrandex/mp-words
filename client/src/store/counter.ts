import { observable, action, runInAction } from 'mobx'

export interface ICounter {
  count: number
  add: () => void
  sub: () => Promise<any>
}

class Counter {
  @observable
  count = 1

  @action
  add = () => {
    this.count++
  }

  @action
  sub = async () => {
    await waiting(3)
    runInAction(() => {
      this.count--
    })
  }
}

async function waiting(second = 1) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000 * second)
  })
}

export default new Counter()
