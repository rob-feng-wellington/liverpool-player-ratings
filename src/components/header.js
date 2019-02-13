import React, { Component } from 'react'
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import LoginDialog from './loginDialog';
import { Link } from 'gatsby';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  title: {
    color: 'white',
    textDecoration: 'none'

  }
})

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    siteTitle: PropTypes.string,
    isAuthed: PropTypes.bool
  }

  state = {
    signInDialogIsOpen: false,
    showLogin: false,
    showSignUp: false,
    emailErrorMessage: '',
    passwordErrorMessage: '',
    addEmailErrorMessage: '',
    addPasswordErrorMessage: '',
    addPasswordConfirmErrorMessage: ''
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

  handleFailedMessages = (error) => {
    let errorMessage = {
      signInDialogIsOpen: true,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      addEmailErrorMessage: '',
      addPasswordErrorMessage: '',
      addPasswordConfirmErrorMessage: ''
    }

    switch(error.code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
        errorMessage = {...errorMessage, emailErrorMessage: error.message}
        break;
      case 'auth/wrong-password':
        errorMessage = {...errorMessage, passwordErrorMessage: error.message}
        break;
      default:
        errorMessage =  {...errorMessage, emailErrorMessage: 'unknown error, please try again'}
    }
    console.log('errorMessage =>', errorMessage);
    this.setState(errorMessage);
  }

  handleLoginDialogClose = (signinOption, email, password) => {
    let signinRequest;

    if (signinOption === 'email' || signinOption === 'signup') {
      signinRequest = this.props.signIn(signinOption, email, password)
    } else {
      signinRequest = this.props.signIn(signinOption);
    }

    signinRequest.catch(error=> {
      this.handleFailedMessages(error);
    })
    
    this.setState({
      signInDialogIsOpen: false
    })
  }

  render() {
    const { classes, siteTitle, isAuthed, email } = this.props;

    return (
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" color="inherit" style={{
            flexGrow: 1,
          }}>
            <Link to={`/`} className={classes.title}>
              {siteTitle.toUpperCase()}
            </Link>
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
                Sign In
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
                emailErrorMessage= {this.state.emailErrorMessage}
                passwordErrorMessage= {this.state.passwordErrorMessage}
                addEmailErrorMessage= {this.state.addEmailErrorMessage}
                addPasswordErrorMessage= {this.state.addPasswordErrorMessage}
                addPasswordConfirmErrorMessage= {this.state.addPasswordConfirmErrorMessage}
              />
            </div>
          }
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Header)
