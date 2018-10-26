import React from 'react';
import PropTypes from 'prop-types';
import {
  SortableContainer,
  SortableElement,
  SortableHandler
} from 'react-sortable-hoc';

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
    <RatingsContainer>
      
    </RatingsContainer>
  )
};

const NewRatings = props => (
  <h1>Rating</h1>
);

NewRatings.PropTypes = {

};

export { NewRatings };