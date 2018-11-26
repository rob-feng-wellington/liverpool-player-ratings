import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const Rating = ({loading, game, players, ratings, hasRated, onRating, classes}) => {
  return (
    <Paper className={classes.root}>
      <Grid container spacing={32}>
        <Grid item xs={12}>
          rating
        </Grid>
      </Grid>
    </Paper>
  )
}

Rating.propTypes = {
  loading: PropTypes.bool,
  game: PropTypes.object,
  players: PropTypes.array,
  ratings: PropTypes.array,
  hasRated: PropTypes.bool,
  onRate: PropTypes.func
}

export default withStyles(styles)(Rating);