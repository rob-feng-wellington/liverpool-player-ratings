import React, { Component } from 'react'
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import LoginDialog from './loginDialog';

class Header extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    siteTitle: PropTypes.string,
    isAuthed: PropTypes.bool
  }

  state = {
    signInDialogIsOpen: false,
    showLogin: false,
    showSignUp: false
  }

  handleClickOpenLogin = () => {
    this.setState({
      signInDialogIsOpen: true,
      showLogin: true,
      showSignUp: false
    })
  }

  handleClickOpenSignUp = () => {
    this.setState({
      signInDialogIsOpen: true,
      showLogin: false,
      showSignUp: true
    })
  }

  handleLoginDialogClose = (signinOption, email, password) => {
    console.log('signinOption =>', signinOption);
    console.log('email =>', email);
    if (signinOption === 'google') {
      this.props.signIn('google')
    } else if (signinOption === 'email') {
      
      this.props.signIn('email', email, password)
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
                <Button
                  color="inherit"
                  onClick={this.handleClickOpenSignUp}
                >
                  SignUp
                </Button>
                <LoginDialog
                  open={this.state.signInDialogIsOpen}
                  onClose={this.handleLoginDialogClose}
                  showLogin={this.state.showLogin}
                  showSignUp={this.state.showSignUp}
                />
              </div>
            }
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Header
