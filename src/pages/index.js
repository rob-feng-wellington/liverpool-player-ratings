import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Layout from '../components/layout'
import Image from '../components/image'

import Home from '../components/Home'

class IndexPage extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  state = {
    allGames: [],
  }

  componentDidMount() {
    const gamesRef = this.context.firebase.games;
    gamesRef
      .orderBy('date', 'desc')
      .get()
      .then((querySnapshot) => {
        const allGames = querySnapshot.docs.map(doc => {
          const game = doc.data();
          game.id = doc.id;
          return game;
        });
        this.setState({
          allGames
        })
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <Layout>
        {
          auth => (
            <Home 
              allGames={this.state.allGames} 
              isAuthed={auth.isAuthed} 
              uid={auth.uid} 
            />
          )
        }
      </Layout>
    )
  }
}

/* const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
      <Image />
    </div>
  </Layout>
) */

export default IndexPage;
