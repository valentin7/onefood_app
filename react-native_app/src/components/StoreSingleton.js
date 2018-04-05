// Store.js

import { observable, computed } from 'mobx'

class StoreSingleton {
  @observable pedidos = []
  @observable numClicks = 0
  @computed get oddOrEven() {
    return this.numClicks % 2 === 0 ? 'even' : 'odd'
  }
}

const storeSingleton = new StoreSingleton()

export default storeSingleton
