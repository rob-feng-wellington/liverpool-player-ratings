import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';
import { navigate } from "@reach/router";

import { OUR_TEAM } from '../utils/Constant';

class RatingContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    uid: PropTypes.string,
    signIn: PropTypes.func,
    gameId: PropTypes.string.isRequired
  }

  state = {
    hasRated: false,
    loading: true,
    myRating: {},
    title: ''
  }

  componentDidMount() {
    const { gameId, uid, signIn } = this.props;
    console.log('signIn =>', signIn);
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
            const ratingsCount = ratings.length;
/*             const ratingsAverge = [...ratings.reduce((r, o) => {
              const key = o.player;
              const item = r.get(key) || Object.assign({}, o, {rating: 0});
              item.rating += o.rating;

              return r.set(key, item)
            }, new Map).values()].map(player => {
              return {player: player.player, rating: player.rating/ratings.length}
            })

            console.log(ratingsAverge); */
            
            this.setState({
              loading: false,
              title: homeOrAway === 'home' ? `${OUR_TEAM} ${score} ${opponent}` : `${opponent} ${score} ${OUR_TEAM}`,
              image,
              date,
              startingList,
              subList,
              ratingsCount,
              ratingAverage: {}
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