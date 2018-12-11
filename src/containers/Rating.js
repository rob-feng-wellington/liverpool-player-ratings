import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';
import { navigate } from "@reach/router";
import LoginDialog from '../components/loginDialog';

import { OUR_TEAM, DEFAULT_RATING } from '../utils/Constant';

class RatingContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    uid: PropTypes.string,
    signIn: PropTypes.func,
    gameId: PropTypes.string
  }

  state = {
    hasRated: false,
    loading: true,
    myRating: {},
    title: '',
    image: '',
    date: '',
    startingPlayers: [],
    subPlayers: [],
    ratingCount: 0,
    ratingsAverge: new Map,
    signInDialogIsOpen: false
  }

  componentDidMount() {
    const { gameId, uid } = this.props;
    // id in firebase is 20 characters 
    if(gameId.length === 20) {
      if (uid) {
        this.getMyRating(uid, gameId);
      }

      this.setState({
        loading: true,
      });

      this.game
        .get()
        .then(doc => {
          if (doc.exists) {
            const { opponent, homeOrAway, score, image, date, startingList, subList, ratings } = doc.data();
            let ratingsArr = [];
            let ratingsCount = 0; 
            let ratingsAverge = new Map;
            if( ratings ) {
              // there are ratings
              ratingsArr = Object.keys(rating).map(key=> rating[key]);
              ratingsCount = ratings.length;
              
              ratingsAverge = [...ratingsArr.reduce((r, o) => {
                const key = o.player;
                const item = r.get(key) || Object.assign({}, o, {rating: 0});
                item.rating += o.rating;
  
                return r.set(key, item)
              }, new Map).values()].map(player => {
                return {player: player.player, rating: player.rating/ratingsArr.length}
              })
              console.log('ratingsAverge => ', ratingsAverge);

            }

            // playerId => player
            this.squad.get().then(querySnapshot => {
              const startingPlayers = querySnapshot
                .docs
                .filter(doc => startingList.indexOf(doc.id) > -1)
                .map(doc => {
                  const player = doc.data();
                  player.id = doc.id;
                  player.rating = doc.rating || DEFAULT_RATING;
                  return player;
                });

              const subPlayers = querySnapshot
                .docs
                .filter(doc => subList.indexOf(doc.id) > -1)
                .map(doc => {
                  const player = doc.data();
                  player.id = doc.id;
                  player.rating = doc.rating || DEFAULT_RATING;
                  return player;
                });

              this.setState({
                loading: false,
                title: homeOrAway === 'home' ? `${OUR_TEAM} ${score} ${opponent}` : `${opponent} ${score} ${OUR_TEAM}`,
                image,
                date,
                startingPlayers,
                subPlayers,
                ratingsCount,
                ratingsAverge,
              })

            })


          } else {
            navigate('/404');
          }
        })
        .catch(error => {
          // TODO: error handling here
        })
    } else {
      navigate('/404');
    }
  }

  handleRating = (value, playerId) => {
    const { startingPlayers, subPlayers } = this.state;
    const newStartingPlayers = startingPlayers.map(player => {
      return player.id === playerId ?
        {...player, rating: value} :
        player
    })

    const newSubPlayers = subPlayers.map(player => {
      return player.id === playerId ?
        {...player, rating: value} :
        player
    })

    this.setState({
      startingPlayers: newStartingPlayers,
      subPlayers: newSubPlayers
    })
  }

  handleSubmit = () => {
    const { uid } = this.props;
    //if no user id at this point, need to sign in as anonymouse
    if (!uid) {
      this.setState({
        signInDialogIsOpen: true
      })
    }
  }

  get game() {
    const { firebase } = this.context;
    const { gameId } = this.props;

    return firebase.games.doc(gameId);
  }

  get allRatings() {
    return this.game.collection('ratings');
  }

  get squad() {
    const { firebase } = this.context;
    return firebase.squad;
  }

  render() {
    const { loading, title, image, date, startingPlayers, subPlayers, ratingCount, ratingsAverge } = this.state;
    return loading ?
      <div>loading...</div>
      :
      <>
        <Rating 
          loading={loading}
          title={title}
          image={image}
          date={date}
          startingPlayers={startingPlayers}
          subPlayers={subPlayers}
          ratingCount={ratingCount}
          ratingsAverge={ratingsAverge}
          onRate={this.handleRating}
          onSubmit={this.handleSubmit}
        />
        <LoginDialog
          open={this.state.signInDialogIsOpen}
          onClose={this.handleSignIn}
          showLogin={true}
          showSignUp={true}
      />
      </>
  }

}

export default RatingContainer;