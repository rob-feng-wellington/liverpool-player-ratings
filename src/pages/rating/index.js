import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../../containers/Rating';

import { BrowserRouter, Route, Redirect } from 'react-router-dom';

const RatingPage = ({uid, signIn}) => {
  return (
    <BrowserRouter
      render={({ location }) => {
        return (
          <div>
            <Route exact path="/rating/" render={() => <Redirect to="/" /> } />
            <Route
              location={location}
              key={location.key}
              path="/rating/:gameId"
              render={props => <Rating {...props} uid={uid} signIn={signIn} />} 
            />
          </div>
        )
      }}
    />
  )
}


export default RatingPage