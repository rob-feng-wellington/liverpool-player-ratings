import firebase from './firebase';

const Suqad = ((firebase) => {
  const _getFullSquad = () => {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('full-squad')) {
        resolve(JSON.parse(localStorage.getItem('full-squad')));
      } else {
        resolve(_getFullSquadFromFirebase());
      }
    })
  }

  const _getFullSquadFromFirebase = () => {
    return new Promise((resolve, reject) => {
      firebase.squad.get().then(querySnapshot => {
        const players = querySnapshot
        .docs
        .map(doc => {
          const player = doc.data();
          player.id = doc.id;
          return player;
        })
        localStorage.setItem('full-squad',  JSON.stringify(players));
        resolve(players);
      })
    });
  }

  return {
    getFullSquad: _getFullSquad,
  }
})(firebase);

export default Suqad;
