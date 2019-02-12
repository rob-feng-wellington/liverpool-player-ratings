import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';

import { Link } from 'gatsby';

import { OUR_TEAM } from '../../utils/Constant';

const styles = theme => ({
  card: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    marginBottom: '1rem'
  },
  avatar: {
    width: 60,
    height: 60,
    "& img": {
      marginBottom: 0
    }
  },
});

const GameCard = props => {
  const { classes, opponent, image, date, score, homeOrAway, hasRated, id, isAuthed } = props;
  const getTitle = (isHome) => isHome ? `${OUR_TEAM} ${score} ${opponent}` : `${opponent} ${score} ${OUR_TEAM}`;
  const getDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const parts = date.split('-');
    const dateDate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return dateDate.toLocaleDateString("en-US", options);
  }
  return (
    <Card className={classes.card}>
      <Link to={`/rating/${id}`}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar 
                aria-label="premier league" 
                className={classes.avatar}
                size={100}
                src="/EPL-LOGO.gif"
              />
            }
            title={getTitle(homeOrAway === 'home')}
            subheader={getDate()}
          />
          <CardMedia
            className={classes.media}
            image={image}
            title={getTitle(homeOrAway === 'home')}
          />
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Rate
          </Button>
        </CardActions>
      </Link>
    </Card>
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