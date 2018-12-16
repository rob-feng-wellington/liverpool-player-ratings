import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Home from '../components/Home';

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
    myNumbers: {}
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

  getMyNumbers = (uid, allGames) => {
    const allMyRatings = allGames.map(game => {
      return this.games
        .doc(game.id)
        .collection('ratings')
        .doc(uid)
        .get()
    });

    Promise.all(allMyRatings).then((allRatings) => {
      const allExistingRatings = allRatings
        .filter(doc => {
          return doc.exists;
        })
        .map(doc => {
          return {[doc.id] : doc.data()};
        })
        .reduce((r, o) => {
          r[Object.keys(o)[0]] = o[Object.keys(o)[0]];
          return r;
        }, {})
        
      const ratingCount = Object.keys(allExistingRatings).length;
      
      
    })
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
      />
    );
  }
}

export default HomeContainer;