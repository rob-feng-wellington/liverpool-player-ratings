import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Avatar } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { List, ListItem, ListItemText } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';


import GameCard from './GameCard';

const styles = theme => ({
  root: {
    marginTop: '20px',
    flexGrow: 1,
  },

  statsListItem: {
    paddingTop: '0',
    paddingBottom: '0'
  },

  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
})

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    allGames: PropTypes.array.isRequired,
    ratingCounts: PropTypes.number,
    playersRatings: PropTypes.array,
    gameIsLoading: PropTypes.bool,
    statsIsLoading: PropTypes.bool
  }

  render() {
    const { classes, allGames, isAuthed, ratingCounts, playersRatings, gameIsLoading, statsIsLoading } = this.props;
    const notAuthed = 
      <div>
        <Typography variant="h5" >Sign in to check your stats.</Typography>
      </div>

    const noRating = (
      <>
        <Typography variant="h4">My Stats</Typography>
        <Typography variant="h5">Could not find any ratings...</Typography>
      </>
    );

    const stats = (
      <>
        <Typography variant="h4" >My Stats</Typography>
        <List>
          {
            playersRatings.map((player, key) => {
              return (
                <ListItem key={key} className={classes.statsListItem}>
                  <Avatar className={classes.orangeAvatar}>{player.rating}</Avatar>
                  <ListItemText 
                    primary={`#${player.number} - ${player.name} `} 
                    secondary={`Rated: ${player.appearance} times`} />
                </ListItem>
              )
            })
          }
        </List>
      </>
    )

    return (
      <div className={classes.root}>
        <Grid container spacing={32}>
          <Grid item xs={5}>
            <Paper className={classes.paper} >
              {
                statsIsLoading
                ? <LinearProgress />
                : !isAuthed
                  ? notAuthed
                  : ratingCounts === 0 
                    ? noRating
                    : stats
              }
            </Paper>
          </Grid>
          <Grid item xs={7}>
            {
              gameIsLoading
              ? <LinearProgress />
              : allGames.map(game => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  opponent={game.opponent}
                  date={game.date}
                  homeScore={game.homeScore}
                  awayScore={game.awayScore}
                  group={game.group}
                  homeOrAway={game.homeOrAway}
                  image={game.image}
                  isAuthed={isAuthed}
                  hasRated={game.hasRated || false}
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
  allGames: [],
  playersRatings: []
}

export default withStyles(styles)(Home)