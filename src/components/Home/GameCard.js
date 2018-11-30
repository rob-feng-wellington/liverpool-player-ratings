import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { OUR_TEAM } from '../../utils/Constant';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
    minWidth: 800,
    padding: theme.spacing.unit * 2,
  },
  image: {
    width: 320,
    height: 160,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

const GameCard = props => {
  const { classes, opponent, image, date, homeOrAway } = props;
  return (
    <Paper className={classes.root}>
      <Grid container spacing={16}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt={`vs ${opponent}`} src={image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={16}>
            <Grid item xs>
              <Typography gutterBottom component="subtitle1">
                {
                  homeOrAway === 'home' ?
                  `${OUR_TEAM} vs ${opponent}`
                  :
                  `${opponent} vs ${OUR_TEAM}`
                }
              </Typography>
              <Typography component="subtitle1" gutterBottom>{`When: ${date}`}</Typography>
            </Grid>
            <Grid item>
              <Typography component="subtitle1" style={{ cursor: 'pointer' }}>Rate</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GameCard);