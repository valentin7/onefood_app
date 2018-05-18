import {observable, action} from 'mobx'

class MobxStore {
  @observable loading = true;
  @observable pedidos = [];
  @observable last4CreditCard = " ";

  @action loadingCompleted() {
    this.loading = false;
  }

  @action toggleLoading() {
    this.loading = this.loading ? false : true;
  }
}

export default new MobxStore();
