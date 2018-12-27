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
    myNumbers: [],
    gameIsLoading: false,
    statsIsLoading: false
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
    this.setState({
      statsIsLoading: true,
      gameIsLoading: true
    })
    this.ratings
    .where('uid', '==', uid)
    .get()
    .then(querySnapshot => {
      Squad.getFullSquad().then(allPlayers => {
        const FinalResults = querySnapshot.docs.map(doc => {
          const ratings = doc.data().ratings;

          const fullRatingData = Object.keys(ratings).map(key => {
            return {
              ...{rating: ratings[key]},
              ...allPlayers.filter(p=>p.id === key)[0]
            }
          })
          return fullRatingData;
        });

        const gameRated = querySnapshot.docs.map(doc => {
          const gameId = doc.data().gameId;
          return gameId;
        });

        const updatedGames = this.state.allGames.map(game => {
          return { ...game, hasRated: gameRated.filter(gameId=> gameId === game.id).length > 0 }
        })

        this.setState({
          myNumbers: FinalResults,
          allGames: updatedGames,
          statsIsLoading: false,
          gameIsLoading: false
        })
      })
    })

  }

  getMyRatingCounts = () => {
    const {myNumbers} = this.state;
    return myNumbers.length;
  }

  getPlayersRatings = () => {
    const {myNumbers} = this.state;
    return myNumbers.length === 0 
    ? []
    : this.getPlayersRatingsFromState()
  }

  getPlayersRatingsFromState = () => {
    const { myNumbers } = this.state;
    if(myNumbers.length === 0 ) { return []}
    const myPlayersRatings = Array.from(myNumbers.reduce((acc, current) => {
      current.map(playerObj => {
        if (acc.has(playerObj.id)) {
          acc.set(playerObj.id,
                  {...playerObj, 
                    rating: acc.get(playerObj.id).rating + playerObj.rating, 
                    appearance: acc.get(playerObj.id).appearance + 1
                  });
        } else {
          acc.set(playerObj.id,
                  {...playerObj, 
                    appearance: 1
                  });
        }
      })
      return acc;
    }, new Map).values()).map(playerObj => {
      return { ...playerObj, rating: (playerObj.rating/playerObj.appearance).toFixed(1)}
    }).sort((a,b)=> {
      return a.rating > b.rating
      ? -1
      : a.rating < b.rating
        ? 1
        : a.appearance > b.appearance
          ? -1
          : a.appearance < b.appearance
            ? 1
            : 0 
    })
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
        gameIsLoading={this.state.gameIsLoading}
        statsIsLoading={this.state.statsIsLoading}
      />
    );
  }
}

export default HomeContainer;