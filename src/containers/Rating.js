import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';

import { OUR_TEAM } from '../utils/Constant';

class RatingContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    uid: PropTypes.string,
    signIn: PropTypes.func
  }

  state = {
    hasRated: false,
    loading: false,
    myRating: {},
    title: ''
  }

  componentDidMount() {
    const { history, uid, match } = this.props;

    // id in firebase is 20 characters 
    if(match.params.gameId.length === 20) {
      if (uid) {
        this.getMyRating(uid, match.params.gameId);
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
            const ratingsAverge = [...ratings.reduce((r, o) => {
              const key = o.player;
              const item = r.get(key) || Object.assign({}, o, {rating: 0});
              item.rating += o.rating;

              return r.set(key, item)
            }, new Map).values()].map(player => {
              return {player: player.player, rating: player.rating/ratings.length}
            })
            
            this.setState({
              loading: false,
              title: homeOrAway === 'home' ? `${OUR_TEAM} ${score} ${opponent}` : `${opponent} ${score} ${OUR_TEAM}`,
              image,
              date,
              startingList,
              subList,
              ratingsCount,
              ratingsAverge
            })
          } else {
            history.push('/404');
          }
        })
        .catch(error => {
          // TODO: error handling here
        })
    } else {
      history.push('/404');
    }
  }

  get game() {
    const { firebase } = this.context;
    const { match } = this.props;

    return firebase.games.doc(match.params.gameId);
  }

  get allRatings() {
    return this.game.collection('ratings');
  }

  render() {
    const { loading, title, image, date, startingList, subList, ratingCount, ratingsAverge } = this.state;
    return (
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
    )
  }

}

export default RatingContainer;