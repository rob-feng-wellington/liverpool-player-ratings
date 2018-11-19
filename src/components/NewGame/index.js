import React, { Component, useState } from 'react';
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
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const styles = () => ({
  root: {
    flexGrow: 1,
  }
})

class NewGame extends Component {
  static propTypes = {
    allPlayers: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
  }
  
  order = ['GK', 'DF', 'MF', 'FW'];

  state = {
    startingList: [],
    subList: [],
    title: '',
    date: ''
  }

  groupByPosition = (players) => {
    return players.reduce(
      (accum, current) => {
        (accum[current.position] = accum[current.position] || []).push(current);
        return accum;
      }, 
      {}
    )
  }

  getPlayerById = (playerId) => {
    return this.props.allPlayers.filter(
      (player) => player.id === playerId
    ).reduce(
      (x, y) => x
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

  render() {
    const { allPlayers, classes } = this.props;
    const {
      startingList,
      subList,
      title,
      date
    } = this.state;
    console.log(startingList);

    const groupedPlayers = this.groupByPosition(allPlayers);
    return(
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <TextField
              id="opponent-team"
              label="Opponent"
              className={classes.textField}
              value={''}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              value={''}
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
              defaultValue="2017-05-24"
              fullWidth
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={6}>
            {
              allPlayers.length > 0 ?
              (
                <List>
                  <h3>Full Squad</h3>
                  {
                    this.order.map(position => (
                      <li key={`position-${position}`}>
                        <ul>
                          <ListSubheader>{position}</ListSubheader>
                          {
                            groupedPlayers[position].map(player => (
                              <ListItem key={player.id}>
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
              <div>loading</div>
            }    
          </Grid>
          <Grid item xs={6}>
            <List>
              <h3>Line-up</h3>
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
      </form>
    )
  }
}

export default withStyles(styles)(NewGame);