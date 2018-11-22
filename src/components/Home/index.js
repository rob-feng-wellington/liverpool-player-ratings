import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Loading from '../loading';
import GameCard from './GameCard';

const styles = theme => ({
  root: {
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
    allGames: PropTypes.array.isRequired
  }

  render() {
    const { allGames, classes } = this.props;

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
                    opponent={game.opponent}
                    date={game.date}
                    homeOrAway={game.homeOrAway}
                    image={game.image}
                  />
                ))
              }
            </Grid>
          </Grid>
        </div>
    )
  }
}

export default withStyles(styles)(Home)