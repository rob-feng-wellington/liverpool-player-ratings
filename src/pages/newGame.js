import React, { Component } from 'react';
import Layout from '../components/layout';
import NewGame from '../components/NewGame';
import PropTypes from 'prop-types';

class NewGamePage extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  };
  
  state = {
    allPlayers: [],
    loading: true,
  }

  componentDidMount() {
    const squadRef = this.context.firebase.squad;
    squadRef
      .orderBy('number')
      .get()
      .then((querySnapshot) => {
        const allSquads = querySnapshot.docs.map(doc => {
          const player = doc.data();
          player.id = doc.id;
          return player;
        });

        this.setState({
          allPlayers: allSquads
        });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
  }

  render() {
    const { allPlayers } = this.state;
    return (
      <Layout>
        {
          auth => {
            return <NewGame allPlayers={allPlayers} isAuthed={auth.isAuthed} email={auth.email} />
          }
        }
      </Layout>
    )
  }
}

export default NewGamePage