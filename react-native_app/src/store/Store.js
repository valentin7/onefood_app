// Store.js

import { observable, computed } from 'mobx'

class Store {
  @observable pedidos = []
  @observable numClicks = 0
  @computed get oddOrEven() {
    return this.numClicks % 2 === 0 ? 'even' : 'odd'
  }
}

const store = new Store()

export default store
