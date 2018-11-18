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
    title: '',
    date: '',
  }

  componentDidMount() {
    const squadRef = this.context.firebase.squad;
    squadRef.orderBy('number').get().then((querySnapshot) => {
      const allSquads = querySnapshot.docs.map(doc => {
        const player = doc.data();
        player.id = doc.id;
        return player;
      });
      this.setState({allPlayers: allSquads});
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  render() {
    const { allPlayers, title, date } = this.state;
    return (
      <Layout>
        <NewGame allPlayers={allPlayers} title={title} date={date} />
      </Layout>
    )
  }
}

export default NewGamePage