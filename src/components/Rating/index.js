import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GameCard from '../Home/GameCard';

import RatingPlayerList from './playersList';
import { groupByPosition } from '../../utils/utils';

const styles = theme => ({
  root: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  ratingWrapper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
})

class Rating extends Component {
  static propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    id: PropTypes.string,
    opponent: PropTypes.string,
    homeOrAway: PropTypes.string,
    homeScore: PropTypes.number,
    awayScore: PropTypes.number,
    group: PropTypes.string,
    image: PropTypes.string,
    date: PropTypes.string,
    startingPlayers: PropTypes.array,
    subPlayers: PropTypes.array,
    ratingsCount: PropTypes.number,
    ratingsAverge: PropTypes.object,
    onRate: PropTypes.func,
    onSubmit: PropTypes.func,
    isAuthed: PropTypes.bool,
    hasRated: PropTypes.bool,
  }

  getSubTitle = () => {
    const { date } = this.props;
    return `Played at ${date}`;
  }

  render() {
    const { classes, isAuthed, id, opponent, date, homeScore, awayScore, group, homeOrAway, image, startingPlayers, subPlayers, onRate, onSubmit, ratingsAverge, hasRated } = this.props;
    const startingGroupedPlayers = groupByPosition(startingPlayers);
    const subGroupedPlayers = groupByPosition(subPlayers);

    return (
      <div className={classes.root}>
        <Grid container spacing={32}>
          <Grid item xs={4}>
            <GameCard 
              id={id}
              opponent={opponent}
              date={date}
              homeOrAway={homeOrAway}
              image={image}
              homeScore={homeScore}
              awayScore={awayScore}
              group={group}
              isAuthed={isAuthed}
              hasRated={hasRated}
            />
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.ratingWrapper} elevation={1}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>Starting Line-up</Typography>
                <RatingPlayerList players={startingGroupedPlayers} ratingsAverge={ratingsAverge} onRate={onRate}/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>Substitutes</Typography>
                <RatingPlayerList players={subGroupedPlayers} ratingsAverge={ratingsAverge} onRate={onRate}/>
              </Grid>
              <Button variant="outlined" color="primary" onClick={onSubmit}>
                Submit Ratings
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Rating);