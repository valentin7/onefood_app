import {observable, action} from 'mobx'

class MobxStore {
  @observable loading = true;
  @observable pedidos = [];
  @observable subscriptions = [];
  @observable last4CreditCard = " ";
  @observable esRep = undefined;
  @observable repPhone = "";
  @observable conektaCustomerId = undefined;
  @observable showingLocationOnMap = true;
  @observable userLocationOnMap = undefined;
  @observable mapMarkers = [];
  @observable totalPrice = 0;
  @observable cocoaQuantity = 0;
  @observable chaiQuantity = 0;
  @observable frutosQuantity = 0;
  @observable mixtoQuantity = 0;
  @observable cocoaSnackQuantity = 0;
  @observable chaiSnackQuantity = 0;
  @observable frutosSnackQuantity = 0;
  @observable mixtoSnackQuantity = 0;
  @observable subscriptionStatus = "";

  @action loadingCompleted() {
    this.loading = false;
  }

  @action toggleLoading() {
    this.loading = this.loading ? false : true;
  }
}

export default new MobxStore();
