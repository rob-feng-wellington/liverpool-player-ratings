import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../../containers/Rating';
import Home from '../../components/Home';

import { Router } from "@reach/router";

import Layout from '../../components/layout';

const RatingPage = (props) => {
  return (
    <Layout>
      {
        auth => {
          return (
            <Router>
              <Home path="/rating/" />
              <Rating path="rating/:gameId" uid={auth.uid} signIn={auth.signIn} isAuthed={auth.isAuthed} />
            </Router>
          )
        }
      }
    </Layout>
  )
}


export default RatingPage