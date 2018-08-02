import {observable, action} from 'mobx'

class MobxStore {
  @observable loading = true;
  @observable pedidos = [];
  @observable subscriptions = [];
  @observable last4CreditCard = " ";
  @observable esRep = false;
  @observable repPhone = "";
  @observable conektaCustomerId = undefined;
  @observable showingLocationOnMap = true;
  @observable userLocationOnMap = undefined;
  @observable mapMarkers = [];

  @action loadingCompleted() {
    this.loading = false;
  }

  @action toggleLoading() {
    this.loading = this.loading ? false : true;
  }
}

export default new MobxStore();
