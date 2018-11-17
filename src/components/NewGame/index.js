import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    color: '#000',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  }
});

const  order = ['GK', 'DF', 'MF', 'FW'];

const NewGame = ({allPlayers}) => {
  const [startingList, setStartingList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const classes = useStyles();

  return (
        allPlayers.length > 0 ?
        <div>yes</div>
        :
        <div className={classes.root}>loading</div>
      
  )

}

NewGame.propTypes = {
  allPlayers: PropTypes.array.isRequired,
}

/* 
class NewGame extends Component {
  static propTypes = {
    allPlayers: PropTypes.array.isRequired,
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
    const { allPlayers } = this.props;
    const {
      startingList,
      subList,
      title,
      date
    } = this.state;

    const classes = useStyles();

    const groupedPlayers = this.groupByPosition(allPlayers);
    console.log(startingList);
    return(
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

    )
  }
}
 */

export default NewGame;