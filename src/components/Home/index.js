import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GameCard from './GameCard';

const styles = theme => ({
  root: {
    marginTop: '20px',
    flexGrow: 1,
  },

  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    allGames: PropTypes.array.isRequired,
    ratingCounts: PropTypes.number,
    playersRatings: PropTypes.object
  }

  render() {
    const { allGames, classes, isAuthed } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={32}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=4</Paper>
          </Grid>
          <Grid item xs={8}>
            {
              allGames.map(game => (
                <GameCard 
                  key={game.id}
                  opponent={game.opponent}
                  date={game.date}
                  homeOrAway={game.homeOrAway}
                  image={game.image}
                  isAuthed={isAuthed}
                />
              ))
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}

Home.defaultProps = {
  allGames: []
}

export default withStyles(styles)(Home)