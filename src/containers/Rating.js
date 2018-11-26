import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';

class RatingContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    game: PropTypes.object,
    allRatings: PropTypes.array,
    uid: PropTypes.string,
    signIn: PropTypes.func
  }

  render() {
    return (
      <Rating />
    )
  }

}

export default RatingContainer;