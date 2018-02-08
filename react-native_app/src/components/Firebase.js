// @flow

import * as firebase from "firebase";

  const config = {
    apiKey: "AIzaSyDbVmdAuf2oDt_j-uKcunA020C1P_41V50",
    authDomain: "onefood-23mexico.firebaseapp.com",
    databaseURL: "https://onefood-23mexico.firebaseio.com",
    projectId: "onefood-23mexico",
    storageBucket: "onefood-23mexico.appspot.com",
    messagingSenderId: "39690239700"
  };


export default class Firebase {
  static auth;

  static registrationInfo = {
    displayName: "",
    phone: ""
  }

  static init () {
    firebase.initializeApp(config);
    Firebase.auth = firebase.auth();
  }

}
