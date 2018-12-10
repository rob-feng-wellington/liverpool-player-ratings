import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';
import { navigate } from "@reach/router";

import { OUR_TEAM } from '../utils/Constant';
import { resolve } from 'any-promise';

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
    title: ''
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
            
            if( ratings ) {
              // there are ratings
              ratingsArr = Object.keys(rating).map(key=> rating[key]);
              ratingsCount = ratings.length;
              
              const ratingsAverge = [...ratingsArr.reduce((r, o) => {
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
                  return player;
                });

              const subPlayers = querySnapshot
                .docs
                .filter(doc => subList.indexOf(doc.id) > -1)
                .map(doc => {
                  const player = doc.data();
                  player.id = doc.id;
                  return player;
                });

              this.setState({
                loading: false,
                title: homeOrAway === 'home' ? `${OUR_TEAM} ${score} ${opponent}` : `${opponent} ${score} ${OUR_TEAM}`,
                image,
                date,
                startingList: startingPlayers,
                subList: subPlayers,
                ratingsCount,
                ratingAverage: {}
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
    const { loading, title, image, date, startingList, subList, ratingCount, ratingsAverge } = this.state;
    return loading ?
    <div>loading...</div>
    :
    <Rating 
      loading={loading}
      title={title}
      image={image}
      date={date}
      startingList={startingList}
      subList={subList}
      ratingCount={ratingCount}
      ratingsAverge={ratingsAverge}
    />
  }

}

export default RatingContainer;