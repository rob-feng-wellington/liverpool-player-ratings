import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import RatingPlayerList from './playersList';
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
    classes: PropTypes.object,
    loading: PropTypes.bool,
    title: PropTypes.string,
    image: PropTypes.string,
    date: PropTypes.string,
    startingPlayers: PropTypes.array,
    subPlayers: PropTypes.array,
    ratingsCount: PropTypes.number,
    ratingsAverge: PropTypes.object,
    onRate: PropTypes.func,
    onSubmit: PropTypes.func
  }

  state = {
    myRatings: {}
  }

  getSubTitle = () => {
    const { date } = this.props;
    return `Played at ${date}`;
  }

  render() {
    const { title, startingPlayers, subPlayers, image, classes, onRate, onSubmit, ratingsAverge } = this.props;
    const startingGroupedPlayers = groupByPosition(startingPlayers);
    const subGroupedPlayers = groupByPosition(subPlayers);

    return (
      <Paper className={classes.root}>
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <div className={classes.imageWrapper}>
              <img alt={title} src={image} />
            </div>
            <div className={classes.titleWrapper}>
              <Typography variant="h4" component="h4" gutterBottom>
                {title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {this.getSubTitle()}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <RatingPlayerList players={startingGroupedPlayers} ratingsAverge={ratingsAverge} onRate={onRate}/>
          </Grid>
          <Grid item xs={12}>
            <RatingPlayerList players={subGroupedPlayers} ratingsAverge={ratingsAverge} onRate={onRate}/>
          </Grid>
        </Grid>
        <Button variant="outlined" color="primary" onClick={onSubmit}>
          Submit Ratings
        </Button>
      </Paper>
    )
  }
}

export default withStyles(styles)(Rating);