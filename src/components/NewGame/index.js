import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Loading from '../loading';
import { POSITIONS_ORDER } from '../../utils/Constant';
import { groupByPosition } from '../../utils/utils';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'inherit',
  },

  h3: {
    marginTop: '0.5rem',
    marginLeft: '0.5rem'
  },

  list: {
    maxHeight: '60vh',
    overflowY: 'auto',
    background: theme.palette.background.paper,
    position: 'relative',
  },

  listSection: {
    backgroundColor: 'inherit',
  },

  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
})

class NewGame extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  };

  static propTypes = {
    allPlayers: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
  }

  state = {
    startingList: [],
    subList: [],
    opponent: '',
    date: (new Date()).toISOString().substring(0, 10),
    homeOrAway: 'home',
    group: 'epl',
    image: '',
    homeScore: 0,
    awayScore: 0,
    isSubmiting: false,
    errorMessages: []
  }

  getPlayerById = (playerId) => {
    return this.props.allPlayers.filter(
      (player) => player.id === playerId
    ).reduce(
      (x) => x
    )
  }

  handleStartingToggle = (playerId) => {
    const { startingList } = this.state;
    const currentIndex = startingList.indexOf(playerId);
    const newStartingList = [...startingList];

    if (currentIndex === -1) {
      newStartingList.push(playerId);
    } else {
      newStartingList.splice(currentIndex, 1);
    }
    
    this.setState({
      startingList: newStartingList
    })
  }

  handleSubToggle = (playerId) => {
    const { subList } = this.state;
    const currentIndex = subList.indexOf(playerId);
    const newSubList = [...subList];

    if (currentIndex === -1) {
      newSubList.push(playerId);
    } else {
      newSubList.splice(currentIndex, 1);
    }
    
    this.setState({
      subList: newSubList
    })
  }

  handleFieldChange = (e, property) => {
    const value = e.target.value;
    this.setState({
      [property]: value
    })
  }

  uploadImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.setState({
        image : reader.result
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      isSubmiting: true
    })

    // do validation
    const validateErrors = this.validateGame();
    
    if (validateErrors.length > 0) {
      //validation errors
      this.setState({
        errorMessages: validateErrors,
        isSubmiting: false
      })
    } else {
      // submit result
      const {
        opponent,
        date,
        homeOrAway,
        image,
        homeScore,
        awayScore,
        group,
        startingList,
        subList
      } = this.state;
      const gamesRef = this.context.firebase.games;
      gamesRef
        .add({ 
          opponent,
          date,
          homeOrAway,
          image,
          homeScore,
          awayScore,
          group,
          startingList,
          subList
        })
        .then((docRef) => {
          console.log(`Game save successfully Game id: ${docRef.id}`);
        })
        .catch(function(error) {
          //handle error
        })
    }
  }

  validateGame() {
    const errorMessages = [];
    
    const {
      startingList,
      subList,
      opponent,
      date,
      homeOrAway,
    } = this.state;

    if( !opponent ) {
      errorMessages.push('Did we really played without an opponent?');
    }
    if( !homeOrAway ) {
      errorMessages.push('Home or away have to choose one')
    }
    if( !date ) {
      errorMessages.push('The game played at mysterious date?')
    }
    if( startingList.length !== 11 ) {
      errorMessages.push(`Starting with ${startingList.length} players, really?`)
    }
    if( subList.length > 3 ) {
      errorMessages.push(`Ref allowed us to have ${subList.length} subs? I cannot believe it`)
    }
    if( startingList.filter(player=>player.position==='GK').length>1 ){
      errorMessages.push(`More than 1 GKs in starting line-up....`)
    }

    return errorMessages;
  }

  render() {
    const { allPlayers, classes } = this.props;
    const {
      startingList,
      subList,
      opponent,
      date,
      homeOrAway,
      image,
      homeScore,
      awayScore,
      group,
      isSubmiting,
      errorMessages
    } = this.state;

    const groupedPlayers = groupByPosition(allPlayers);
    
    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
      {
        isSubmiting ?
        <div style={{
          height: '50vh'
        }}>
          <Loading />
        </div>
        :
        <Grid container spacing={32}>
          {
            errorMessages.length > 0 ?
            <Grid item xs={12}>
              <List>
                {
                  errorMessages.map(error=>(
                    <ListItem>
                      <ListItemText primary={error} style={{
                        primary: {
                          color: 'red'
                        }
                      }}/>
                    </ListItem>
                  ))
                }
              </List>
            </Grid>
            :
            null
          }
          <Grid item xs={12}>
            <TextField
              id="opponent-team"
              label="Opponent"
              value={opponent}
              onChange={(e) => this.handleFieldChange(e, 'opponent')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              value={homeOrAway}
              onChange={(e) => this.handleFieldChange(e, 'homeOrAway')}
              inputProps={{
                name: 'home-away',
                id: 'home-away-select',
              }}
              fullWidth
            >
              <MenuItem value={'home'}>Home</MenuItem>
              <MenuItem value={'away'}>Away</MenuItem>
            </Select>
          </Grid> 
          <Grid item xs={6}>
            <TextField
              id="date"
              type="date"
              defaultValue={date}
              onChange={ (e) => {this.handleFieldChange(e, 'date')}}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              value={homeScore}
              onChange={(e) => this.handleFieldChange(e, 'homeScore')}
              inputProps={{
                name: 'homeScore',
                id: 'home-score-select',
              }}
              fullWidth
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Select
              value={awayScore}
              onChange={(e) => this.handleFieldChange(e, 'awayScore')}
              inputProps={{
                name: 'awayScore',
                id: 'away-score-select',
              }}
              fullWidth
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              value={group}
              onChange={(e) => this.handleFieldChange(e, 'group')}
              inputProps={{
                name: 'group',
                id: 'group-select',
              }}
              fullWidth
            >
              <MenuItem value={'epl'}>Premier League</MenuItem>
              <MenuItem value={'champions'}>Champions League</MenuItem>
            </Select> 
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="game-image-upload"
              type="file"
              onChange={this.uploadImage}
              style={{
                display: 'none'
              }}
            />
            <label htmlFor="game-image-upload">
              <Button variant="outlined" component="span">
                Upload
              </Button>
            </label>
            {
              image ?
              <img src={image} />
              :
              null
            }
          </Grid>
          <Grid item xs={6}>
            {
              allPlayers.length > 0 ?
              (
                <List className={classes.list} disablePadding={true}>
                  <h3 className={classes.h3}>Full Squad</h3>
                  {
                    POSITIONS_ORDER.map(position => (
                      <li key={`position-${position}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                          <ListSubheader>{`POSITION: ${position}`}</ListSubheader>
                          {
                            groupedPlayers[position].map(player => (
                              <ListItem key={player.id} style={{
                                listStyleType: 'none',
                                padding: 0,
                              }}>
                                <ListItemText primary={player.number} />
                                <ListItemText primary={player.name} />
                                <ListItemSecondaryAction>
                                  <Switch
                                    onChange={() => this.handleStartingToggle(player.id)}
                                    checked={startingList.indexOf(player.id) !== -1}
                                  />
                                  <Switch
                                    onChange={() => this.handleSubToggle(player.id)}
                                    checked={subList.indexOf(player.id) !== -1}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))
                          }
                        </ul>
                      </li>
                    ))
                  }
                </List>
              )
              :
              <Loading />
            }    
          </Grid>
          <Grid item xs={6}>
            <List>
              <h3 className={classes.h3}>Line-up</h3>
              <ListSubheader>Starting line-up</ListSubheader>
              <ul>
              {
                startingList.map(playerId => {
                  const player = this.getPlayerById(playerId);
                  return(
                    <ListItem key={`player-${player.id}`}>
                      <ListItemText primary={player.number} />
                      <ListItemText primary={player.name} />
                    </ListItem>
                  )
                })
              }
              <ListSubheader>Subs</ListSubheader>
              {
                subList.map(playerId => {
                  const player = this.getPlayerById(playerId);
                  return(
                    <ListItem key={`player-${player.id}`}>
                      <ListItemText primary={player.number} />
                      <ListItemText primary={player.name} />
                    </ListItem>
                  )
                })
              }
              </ul>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      }
      </form>
    )
  }
}

export default withStyles(styles)(NewGame);