import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import { OUR_TEAM, POSITIONS_ORDER, DEFAULT_RATING } from '../../utils/Constant';
import { groupByPosition } from '../../utils/utils';

const styles = theme => ({
  root: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageWrapper: {
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
  },

})

class Rating extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    game: PropTypes.object,
    ratingsCount: PropTypes.number,
    ratingsAverge: PropTypes.object,
    hasRated: PropTypes.bool,
    onRate: PropTypes.func
  }

  state = {
    myRatings: {}
  }

  getTitle = () => {
    const { game } = this.props;
    return game.homeOrAway === 'home'?
      `${OUR_TEAM} ${game.score} ${game.opponent}` :
      `${game.opponent} ${game.score} ${OUR_TEAM}`;
  }

  getSubTitle = () => {
    const { game } = this.props;
    return `Played at ${game.date}`;
  }

  render() {
    const { game } = this.props;
    const startingGroupedPlayers = groupByPosition(game.startingList);
    const subGroupedPlayers = groupByPosition(game.subList);
    return (
      <Paper className={classes.root}>
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <div className={classes.imageWrapper}>
              <img alt={`vs ${game.opponent}`} src={game.image} />
            </div>
            <div className={classes.titleWrapper}>
              <Typography component="h4" gutterBottom>
                {this.getTitle()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {this.getSubTitle()}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <List className={classes.ratingListWrapper} disablePadding={true}>
              {
                POSITIONS_ORDER.map(position => {
                  startingGroupedPlayers[position].map(player => {
                    <ListItem key={player.id}>
                      <ListItemText primary={player.number} />
                      <ListItemText primary={player.name} />
                      <ListItemSecondaryAction>
                        <Typography variant="subtitle1">Your rating</Typography>
                        <Slider value={DEFAULT_RATING} min={0} max={10} step={0.5} />
                        <Typography variant="subtitle1">Average rating</Typography>
                        <Slider value={ratingsAverge[player.id]} min={0} max={10} step={0.1} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  })
                })
              }
            </List>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

/* 
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
} */

export default withStyles(styles)(Rating);