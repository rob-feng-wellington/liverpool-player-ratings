import React, { Component } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types';

import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

const BACKGROUND = 'background-color: #20232a';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Dialog, DialogTitle, List, ListItem } from '@material-ui/core';

class LoginDialog extends Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  }

  handleListItemClick = value => {
    this.props.onClose(value);
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="login-form" {...other}>
        <DialogTitle>Plese login</DialogTitle>
        <div>
          <List>
            <ListItem>
              <SignIn
                onClick={() => this.handleListItemClick('google')}
                icon={<GoogleIcon />}
                text={'Sign in with Google'}
              />
            </ListItem>

          </List>
        </div>
      </Dialog>
    )
  }
}


class Header extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    siteTitle: PropTypes.string,
    isAuthed: PropTypes.bool
  }

  state = {
    signInDialogIsOpen: false,
    signUpDialogIsOpen: false
  }

  handleClickOpenLogin = () => {
    this.setState({
      signInDialogIsOpen: true
    })
  }

  handleLoginDialogClose = signinOption => {
    if (signinOption === 'google') {
      this.props.signIn('google')
    }
    this.setState({
      signInDialogIsOpen: false
    })
  }

  render() {
    const { signIn, signOut, siteTitle, isAuthed, email } = this.props;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography component="h6" color="inherit" style={{
              flexGrow: 1,
            }}>
              {siteTitle}
            </Typography>
            {
              isAuthed ?
              <div>
                Welcome {email}
                <Button color="inherit" onClick={this.props.signOut}>
                  Logout
                </Button>
              </div>
              :
              <div>
                <Button 
                  color="inherit"
                  onClick={this.handleClickOpenLogin}
                >
                  Login
                </Button>
                <LoginDialog
                  open={this.state.signInDialogIsOpen}
                  onClose={this.handleLoginDialogClose}
                />
                <Button
                  color="inherit"
                  onClick={this.handleClickOpenSignup}
                >
                  SignUp
                </Button>
              </div>
            }
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Header
