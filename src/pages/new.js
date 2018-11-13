import React, { Component } from 'react';
import Link from 'gatsby-link';
import shortId from 'short-id';
import Header from '../components/header';
import { NewRatings } from '../components/NewRating';
import Layout from '../components/layout'

class NewRatingPage extends Component {
  state = {
    
  }

  render() {
    return (
      <Layout>
        <NewRatings />
      </Layout>
    )
  }
}

export default NewRatingPage