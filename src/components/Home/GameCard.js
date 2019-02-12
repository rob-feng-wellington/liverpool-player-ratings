import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'

import { Link } from 'gatsby'

import { OUR_TEAM } from '../../utils/Constant';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  image: {
    maxWidth: 320,
    maxHeight: 180,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

const GameCard = props => {
  const { classes, opponent, image, date, score, homeOrAway, hasRated, id, isAuthed } = props;
  const getHomeScore = (isHome) => isHome ? score.split(':')[0] : score.split(':')[1]
  return (
    <Paper className={classes.root}>
    <Link
      to={`/rating/${id}`}
    >
      <Grid container spacing={16}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt={`vs ${opponent}`} src={image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={16}>
            <Grid container spacing={0} gutterBottom>
              <Grid item xs={10}>
                <Typography variant="h5">
                  { homeOrAway === 'home' ? OUR_TEAM : opponent }
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h5">
                  { getHomeScore(true) }
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5">
                  { homeOrAway === 'home' ? opponent : OUR_TEAM }
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h5">
                  { getHomeScore(false) }
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>{date}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                {
                  isAuthed && hasRated
                  ? <Button variant="outlined" color="secondary">Click to review</Button>
                  : <Button variant="outlined" color="primary">Click to rate</Button>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Link>
    </Paper>
  )
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  opponent: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  homeOrAway: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isAuthed: PropTypes.bool.isRequired,
  hasRated: PropTypes.bool
}

export default withStyles(styles)(GameCard);