import React, { Component } from 'react';
import PropTypes from 'prop-types';

const RatingsContainer = () => (
  <ul
    style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      marginBottom: rhythm(1)
    }}
  />
);

const PlayerContainer = () => (
  <li
    style={{
      borderBottom: `1px solid ${gray(1)}`,
      padding: `${rhythm(1)}`,
      margin: 0,
      marginBottom: rhythm(1),
      backgroundColor: gray(40),
      listStyle: 'none',
      position: 'relative',
      minHeight: rhythm(10),
      display: 'flex'
    }}
  />
);

const PlayerItem = ({player}) => (
  <div>
    <img
      src={player.img}
      style={{
        marginRight: rhythm(1 / 2),
        marginBottom: 0,
        width: rhythm(2),
        height: rhythm(2),
      }}
    />
    <label for="rating">{player.name}</label>
    <input type="range" name="rating" min="0" max="10" step="0.5" value={player.rating} />
    <span>{player.rating}</span>
  </div>
)

const SortableList = ({ options, ...props }) => {
  return (
    <RatingsContainer />
  )
};

class NewRatings extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  };

  static propTypes = {
  }

  state = {
    title: '',
    players: [],
    loading: false,
  }

  // to keep track of what item is being edited
  editing = null;

  render() {
    const { players, loading, title } = this.state;
    //const playersWithText = players.filter(({ text }) => !!text.trim());
    //const disableCreate = !title || playersWithText.length < 2 || loading;
    const squadRef = this.context.firebase.squad;
    
    squadRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    return (
      <div>
        <h2>Create a new rating</h2>
        <div
          style={{
            display: 'inline-flex',
            width: '350px',
            flexDirection: 'column',
            marginBottom: '30px'
          }}
        >
          {
            players
          }      
        </div>
      </div>
    )
  }

}


/* const NewRatings = props => (
  <h1>Rating</h1>
);

NewRatings.propTypes = {

};
 */
export { NewRatings };