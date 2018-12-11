import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { POSITIONS_ORDER, DEFAULT_RATING } from '../../utils/Constant';

const styles = theme => ({
  root: {
    marginTop: '20px'
  }
})

const RatingPlayerList = ({classes, players, onRate}) => {
  return(
    <List className={classes.root} disablePadding={true}>
      {
        POSITIONS_ORDER.map(position => {
          if (players[position]) {
            return (
              players[position].map(player => {
                return(
                  <ListItem key={player.id}>
                    <ListItemText primary={player.number} />
                    <ListItemText primary={player.name} />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle1">{`Your rating: ${player.rating}`}</Typography>
                      <Slider value={player.rating} min={0} max={10} step={0.5} onChange={(e, value) => onRate(value, player.id)}/>
                      <Typography variant="subtitle1">Average rating</Typography>
                      {/* <Slider value={ratingsAverge[player.id]} min={0} max={10} step={0.1} /> */}
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
  onRate: PropTypes.func.isRequired
}

export default withStyles(styles)(RatingPlayerList);