import Vue from 'vue';
import firebase from "firebase";
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXkREUITbVkwJ2oj0nUthSbaRN1RYpHmo",
  authDomain: "platzi-rooms-ebee3.firebaseapp.com",
  databaseURL: "https://platzi-rooms-ebee3-default-rtdb.firebaseio.com",
  projectId: "platzi-rooms-ebee3",
  storageBucket: "platzi-rooms-ebee3.appspot.com",
  messagingSenderId: "21713586542",
  appId: "1:21713586542:web:6178151b294132178c197f",
  measurementId: "G-0HSSGK1X4F"
};

// Initialize Firebase
// firebase(firebaseConfig)
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('FETCH_AUTH_USER');
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() { // antes que se cree el componente se va ejecutar esta accion
    if (this.$store.state.authId) {
      this.$store.dispatch('FETCH_USERS', store.state.authId)
    }
  },
}).$mount('#app');
