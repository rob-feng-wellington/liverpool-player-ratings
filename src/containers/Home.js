import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Home from '../components/Home';

import Squad from '../services/squad';
class HomeContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    uid: PropTypes.string.isRequired,
    isAuthed: PropTypes.bool.isRequired
  }

  state = {
    allGames: [],
    myNumbers: []
  }

  componentDidMount() {
    this.getAllGamesPromise = this.getAllGames()
      .then(response => {
        this.setState({
          allGames: response
        })
        const { uid } = this.props;
        if( uid ) {
          this.getMyNumbers(uid, response);
        }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { uid } = this.props;
    const { uid: nextUid } = nextProps;
    this.getAllGamesPromise.then(allGames => {
      if ((!uid && !nextUid) || (uid && !nextUid)) {
        //this.signInAnonymously();
      } else {
        // a uid exists, check if the user has already voted
        this.getMyNumbers(nextUid, this.state.allGames);
      }
    });
  }

  getAllGames = () => {
    return new Promise((resolve, reject) => {
      this.games
        .orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
          const allGames = querySnapshot.docs.map(doc => {
            const game = doc.data();
            game.id = doc.id;
            return game;
          })
          resolve(allGames);
        })
    })
  }

  getMyNumbers = (uid) => {
    this.ratings
    .where('uid', '==', uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.map(doc => {
        const ratings =  doc.data().ratings;
        Squad.getFullSquad().then(allPlayers => {
          const fullRatingData = Object.keys(ratings).map(key => {
            return {
              ...{rating: ratings[key]},
              ...allPlayers.filter(p=>p.id === key)[0]
            }
          });
          
          this.setState({
            myNumbers: fullRatingData
          })

        })
      });
    })
  }

  getMyRatingCounts = () => {
    const {myNumbers} = this.state;
    return myNumbers.length;
  }

  getPlayersRatings = () => {
    const {myNumbers} = this.state;
    return myNumbers.length === 0 
    ? {}
    : this.getPlayersRatingsFromState()
  }

  getPlayersRatingsFromState = () => {
    const {myNumbers} = this.state;
    if(myNumbers.length === 0 ) { return []}
    const myPlayersRatings = myNumbers.reduce((r, o) => {
      Object.keys(o).map(playerId => {
        const playerRating = o[playerId];
          if (r.has(playerId)) {
            r.set(playerId, {rating: r.get(playerId).rating + playerRating, appearance: r.get(playerId).appearance + 1})
          } else {
            r.set(playerId, {rating: playerRating, appearance: 1})
          }
      })
      return r;
    }, new Map);

    return myPlayersRatings;
  }

  get games() {
    const { firebase } = this.context;
    return firebase.games;
  }

  get ratings() {
    const { firebase } = this.context;
    return firebase.ratings;
  }

  render() {
    return (
      <Home
        allGames={this.state.allGames}
        isAuthed={this.props.isAuthed} 
        uid={this.props.uid}
        ratingCounts={this.getMyRatingCounts()}
        playersRatings={this.getPlayersRatings()}
      />
    );
  }
}

export default HomeContainer;