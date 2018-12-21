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
    playersRatings: PropTypes.array
  }

  render() {
    const { classes, allGames, isAuthed, ratingCounts, playersRatings } = this.props;

    const notAuthed = 
      <div>
        <Typography variant="h4" component="h4" >You will need to login to check your stats.</Typography>
        <Button variant="contained" color="primary">
          Login
        </Button>
      </div>

    const noRating = <Typography component="h4" >Kick off your rating by click one of the games on the right</Typography>;

    const stats = (
      <>
        <Typography component="h4" >My States</Typography>
        <List>
          {
            playersRatings.map((player, key) => {
              return (
                <ListItem key={key}>
                  <Avatar className={classes.orangeAvatar}>{player.number}</Avatar>
                  <ListItemText 
                    primary={`${player.name} -- ${player.rating}`} 
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
            <Paper className={classes.paper}>
              {
                !isAuthed
                ? notAuthed
                : ratingCounts === 0 
                  ? noRating
                  : stats
              }
            </Paper>
          </Grid>
          <Grid item xs={7}>
            {
              allGames.map(game => (
                <GameCard 
                  key={game.id}
                  id={game.id}
                  opponent={game.opponent}
                  date={game.date}
                  score={game.score}
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
  allGames: []
}

export default withStyles(styles)(Home)