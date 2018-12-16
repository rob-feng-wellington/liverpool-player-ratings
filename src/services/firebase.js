import firebase from "firebase"
import "firebase/firestore"

const config = {
  apiKey: "AIzaSyDyWIGN6fzTUeGgufOwIh9PE5DKXqK8A-Y",
  authDomain: "liverpool-player-ratings.firebaseapp.com",
  databaseURL: "https://liverpool-player-ratings.firebaseio.com",
  projectId: "liverpool-player-ratings",
  storageBucket: "liverpool-player-ratings.appspot.com",
  messagingSenderId: "723867942651"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.store = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    this.store.settings(settings);
    this.auth = firebase.auth;
  }

  get squad() {
    return this.store.collection('squad');
  }

  get games() {
    return this.store.collection('games');
  }

  get ratings() {
    return this.store.collection('ratings');
  }
}

export default new Firebase();