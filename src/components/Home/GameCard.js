import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
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
  const { classes, opponent, image, date, homeScore, awayScore, group, homeOrAway, hasRated, id, isAuthed } = props;
  const getTitle = (isHome) => isHome ? `${OUR_TEAM} ${homeScore} : ${awayScore} ${opponent}` : `${opponent} ${homeScore} : ${awayScore} ${OUR_TEAM}`;
  const getDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const parts = date.split('-');
    const dateDate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return dateDate.toLocaleDateString("en-US", options);
  }
  const getGroupLabel = () => {
    switch (group) {
      case 'uefa':
        return 'Champions League';
      case 'epl':
      default:
        return 'English Premier League';
    }
  }
  const getGroupIconSrc = () => {
    switch (group) {
      case 'uefa':
        return '/uefa.png';
      case 'epl':
      default:
        return '/EPL-LOGO.gif';
    }
  }
  return (
    <Card className={classes.card}>
      <Link to={`/rating/${id}`}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar 
                aria-label={getGroupLabel()}
                className={classes.avatar}
                size={100}
                src={getGroupIconSrc()}
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
      </Link>
    </Card>
  )
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  opponent: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  homeScore: PropTypes.number.isRequired,
  awayScore: PropTypes.number.isRequired,
  group: PropTypes.string.isRequired,
  homeOrAway: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isAuthed: PropTypes.bool.isRequired,
  hasRated: PropTypes.bool
}

export default withStyles(styles)(GameCard);