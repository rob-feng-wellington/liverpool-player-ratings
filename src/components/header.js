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
    signInFailed: false,
    signInFailedReason: false,
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
    let signinRequest;

    if (signinOption === 'email' || signinOption === 'signup') {
      signinRequest = this.props.signIn(signinOption, email, password)
    } else {
      signinRequest = this.props.signIn(signinOption);
    }

    signinRequest.catch(error=> {
      this.setState({
        signInDialogIsOpen: true,
        signInFailed: true,
        signInFailedReason: signinOption === 'signup' ? "Signup failed, please try again" : "Login failed, please try again"
      })
    })
    
    this.setState({
      signInDialogIsOpen: false
    })
  }

  render() {
    const { siteTitle, isAuthed, email } = this.props;

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
