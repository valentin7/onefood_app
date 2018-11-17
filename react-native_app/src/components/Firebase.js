// @flow
import * as firebase from "firebase";
import "firebase/firestore";

  const config = {
    apiKey: "AIzaSyDbVmdAuf2oDt_j-uKcunA020C1P_41V50",
    authDomain: "onefood-23mexico.firebaseapp.com",
    databaseURL: "https://onefood-23mexico.firebaseio.com",
    projectId: "onefood-23mexico",
    storageBucket: "onefood-23mexico.appspot.com",
    messagingSenderId: "39690239700"
  };


const endpoint = {
  prod: "https://test.com/api",
  dev: "http://test2.com/api"
}

export default class Firebase {
  static auth;
  static firestore: firebase.firestore.Firestore;
  static storage: firebase.storage.Storage;

  static endpoint = endpoint.prod;

  static registrationInfo = {
    displayName: "",
    phone: ""
  }

  static init () {
    firebase.initializeApp(config);
    Firebase.auth = firebase.auth();
    Firebase.firestore = firebase.firestore();
    Firebase.storage = firebase.storage();
  }

}
