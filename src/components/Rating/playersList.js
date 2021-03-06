import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { POSITIONS_ORDER } from '../../utils/Constant';

import './playersList.css';

const styles = theme => ({
  root: {
    marginTop: '5px'
  },
  listItem: {
    marginBottom: '10px'
  }
})

const RatingPlayerList = ({classes, players, onRate, ratingsAverge}) => {
  return(
    <List className={`${classes.root} players-list-wrapper`}>
      {
        POSITIONS_ORDER.map(position => {
          if (players[position]) {
            return (
              players[position].map(player => {
                return(
                  <ListItem key={player.id} className={classes.listItem}>
                    <ListItemText primary={player.number} />
                    <ListItemText primary={player.name} />
                    <ListItemSecondaryAction className={classes.actionWrapper}>
                      <Typography variant="subtitle1">{`Your rating: ${player.rating}`}</Typography>
                      <Slider value={player.rating} min={0} max={10} step={0.5} onChange={(e, value) => onRate(value, player.id)}/>
                      {
                        ratingsAverge.get(player.id) ?
                        <>
                          <Typography variant="subtitle1">{`Other's rating: ${parseFloat(ratingsAverge.get(player.id))}`}</Typography>
                          <Slider value={parseFloat(ratingsAverge.get(player.id))} min={0} max={10} step={0.1} disabled/>
                        </>
                        :
                        null
                      }
                      
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })
            )
          }
        })
      }
    </List>
  )
}

RatingPlayerList.propTypes = {
  classes: PropTypes.object,
  players: PropTypes.object.isRequired,
  onRate: PropTypes.func.isRequired,
  ratingsAverge: PropTypes.instanceOf(Map).isRequired,
}

export default withStyles(styles)(RatingPlayerList);