// import something here
import Vue from 'vue'

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'

// Add the Firebase products that you want to use
// import 'firebase/auth'
// import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCh7YNRtHAo1qHo-pBoDFPu-8q5nFaGgsg',
  authDomain: 'gerador-cardapio.firebaseapp.com',
  databaseURL: 'https://gerador-cardapio.firebaseio.com',
  projectId: 'gerador-cardapio',
  storageBucket: 'gerador-cardapio.appspot.com',
  messagingSenderId: '49801333112',
  appId: '1:49801333112:web:eeb24b3c0020d7e87da08d'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// const db = firebase.firestore()
const storage = firebase.storage()

Vue.prototype.$firebase = firebase
// Vue.prototype.$db = db
Vue.prototype.$storage = storage
// Vue.prototype.$storage = firebase.storage().ref()

// 'async' is optional
export { firebase, storage }