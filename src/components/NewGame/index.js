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

  handleToggle = (playerId) => {
    const { startingList } = this.state;
    const currentIndex = startingList.indexOf(playerId);
    const newStartingList = [...startingList];
    console.log(playerId);
    if (currentIndex === -1) {
      newStartingList.push(playerId);
    } else {
      newStartingList.splice(currentIndex, 1);
    }
    
    this.setState({
      startingList: newStartingList
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

    const groupedPlayers = this.groupByPosition(allPlayers);
    console.log(startingList);
    return(
      <div className={classes.root}>
        <Grid container spacing={24}>
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
            {/* <InputLabel htmlFor="home-away">Home-Away</InputLabel> */}
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
                <List className={classes.root} subheader={<ListSubheader>Full Squad</ListSubheader>}>
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
                                    onChange={() => this.handleToggle(player.id)}
                                    checked={startingList.indexOf(player.id) !== -1}
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
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(NewGame);