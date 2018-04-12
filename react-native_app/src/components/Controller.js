
import { observable } from 'mobx'


export default class Controller {
  //  static sharedInstance = this.sharedInstance == null ? new Controller() : this.sharedInstance
  @observable pedidos = []
  static instance = null;
  //var pedidos = [];
  static createInstance() {
      var object = new Controller();
      return object;
  }

  static getInstance () {
      if (!Controller.instance) {
          console.log("creating singleton from scratch");
          Controller.instance = Controller.createInstance();
      }
      return Controller.instance;
  }
}

// const singletonClass = Controller.getInstance();
//
// export default singletonClass
