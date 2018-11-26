import React, { Component } from 'react';
import Link from 'gatsby-link';
import shortId from 'short-id';
import Header from '../components/header';
import Rating from '../containers/Rating';
import Layout from '../components/layout'

class NewRatingPage extends Component {
  state = {
    
  }

  render() {
    return (
      <Layout>
        {
          () => {
            return (
              <Rating />
            )
          }
        }
      </Layout>
    )
  }
}

export default NewRatingPage