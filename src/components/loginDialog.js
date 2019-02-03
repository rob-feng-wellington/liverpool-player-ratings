import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle, DialogActions, List, ListItem, TextField, Button, Divider, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';
import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'inherit',
    width: '60vw',
    maxWidth: '800px'
  },

  title: {
    paddingTop: '0.5em',
    paddingBottom: '0.5em'
  },

  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  margin: {
    margin: theme.spacing.unit,
  }
})

class LoginDialog extends Component{
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    showLogin: PropTypes.bool.isRequired,
    showSignUp: PropTypes.bool.isRequired,
    emailErrorMessage: PropTypes.string,
    passwordErrorMessage: PropTypes.string,
    addEmailErrorMessage: PropTypes.string,
    addPasswordErrorMessage: PropTypes.string,
    addPasswordConfirmErrorMessage: PropTypes.string
  }
  state = {
    email: '',
    password: '',
    addEmail: '',
    addPassword: '',
    confirmPassword: '',
    showLogin: this.props.showLogin,
    showSignUp: this.props.showSignUp
  }

  componentWillReceiveProps(nextProps) {
    const {showLogin} = this.props;
    const {showLogin: nextShowLogin} = nextProps;
    if( showLogin !== nextShowLogin ) {
      this.setState({
        showLogin: nextShowLogin
      })
    }

    const {showSignUp} = this.props;
    const {showSignUp: nextShowSignUp} = nextProps;
    if( showSignUp !== nextShowSignUp ) {
      this.setState({
        showSignUp: nextShowSignUp
      })
    }
  }

  handleChange = (attr) => event => {
    this.setState({
      [attr]:  event.target.value,
    });
  }
  
  handleEmailLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose('email', this.state.email, this.state.password);
  }

  handleCreateUser = () => {
    this.props.onClose('signup', this.state.addEmail, this.state.addPassword);
  }

  handleAnonymouseLogin = () => {
    this.props.onClose('anonymous')
  }

  handleSwitchMode = (mode) => {
    this.setState({
      ...{showLogin: false, showSignUp: false},
      [mode]: true
    })
  }

  onPasswordKeyPressed = (e) => {
    if (event.keyCode === 13) {
      this.handleEmailLogin(e);
    }
  }

  onPasswordConfirmKeyPressed = () => {
    if (event.keyCode === 13) {
      this.handleCreateUser();
    }
  }

  render() {
    const { 
      classes, 
      onClose, 
      showLogin,
      showSignUp,
      emailErrorMessage, 
      passwordErrorMessage, 
      addEmailErrorMessage, 
      addPasswordErrorMessage, 
      addPasswordConfirmErrorMessage, 
      ...other } = this.props;

    const {
      showLogin: stateShowLogin, 
      showSignUp: stateShowSignup, 
    } = this.state;

    return (
      <Dialog 
        aria-labelledby="login-form"
        maxWidth={false}
        {...other}
        >
        {
          stateShowLogin ?
          <div className={classes.root}>
            <DialogTitle className={classes.title}>Sign in with Google account</DialogTitle>
            <List className={classes.list}>
              <ListItem className={classes.list} >
                <SignIn
                  onClick={() => onClose('google')}
                  icon={<GoogleIcon />}
                  text={'Sign in with Google'}
                />
              </ListItem>
            </List>
            <Divider variant="middle"/>
            <div className={classes.root}>
              <List className={classes.list}>
                <DialogTitle className={classes.title}>Sign in with Username and Password</DialogTitle>
                <ListItem className={classes.list} >
                  <form noValidate autoComplete="off" onSubmit={(e) => this.handleEmailLogin(e)} >
                    <FormControl fullWidth={true} className={classes.margin} error={emailErrorMessage === '' ? false : true}>
                      <InputLabel htmlFor="signinEmail">Email</InputLabel>
                      <Input
                        name="signinEmail"
                        type="email"
                        value={this.state.email}  
                        onChange={this.handleChange('email')}
                      />
                      {
                        emailErrorMessage === ''
                        ? null
                        : <FormHelperText name="signin-email-error-text">{emailErrorMessage}</FormHelperText>
                      }

                    </FormControl>
                    <FormControl fullWidth={true} className={classes.margin} error={passwordErrorMessage === '' ? false : true}>
                      <InputLabel htmlFor="signinPassword">Password</InputLabel>
                      <Input
                        name="signinPassword"
                        type="password"
                        value={this.state.password}  
                        onChange={this.handleChange('password')}
                        onKeyDown={this.onPasswordKeyPressed}
                      />
                      {
                        passwordErrorMessage === ''
                        ? null
                        : <FormHelperText name="signin-password-error-text">{passwordErrorMessage}</FormHelperText>
                      }
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit">
                      Sign In
                    </Button>
                  </form>
                </ListItem>
              </List>
            </div>
          </div>
          :
          null
        }
        {
          stateShowSignup ?
          <div className={classes.root}>
            <Divider variant="middle"/>
            <List className={classes.list}>
            <DialogTitle className={classes.title}>Please create an account</DialogTitle>
              <ListItem className={classes.list}>
                <form autoComplete="off">
                  <TextField
                    label="Email"
                    type="email"
                    value={this.state.addEmail}
                    onChange={this.handleChange('addEmail')}
                    margin="normal"
                    fullWidth={true}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={this.state.addPassword}
                    onChange={this.handleChange('addPassword')}
                    margin="normal"
                    fullWidth={true}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange('confirmPassword')}
                    onKeyDown={this.onPasswordConfirmKeyPressed}
                    margin="normal"
                    fullWidth={true}
                  />
                  <Button variant="contained" color="primary" onClick={this.handleCreateUser}>
                    Sign Up
                  </Button>
                </form>
              </ListItem>
            </List>
          </div>
          :
          null
        }
        <DialogActions>
          <Button onClick={() => {stateShowSignup ? this.handleSwitchMode('showLogin') : this.handleSwitchMode('showSignUp')} } color="secondary">
            { stateShowSignup ? 'Switch to Sign in' : 'Switch to Sign up' }
          </Button>
          <Button onClick={this.handleAnonymouseLogin} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

LoginDialog.defaultProps = {
  showLogin: true,
  showSignUp: false,
  emailErrorMessage: '',
  passwordErrorMessage: '',
  addEmailErrorMessage: '',
  addPasswordErrorMessage: '',
  addPasswordConfirmErrorMessage: ''
}

export default withStyles(styles)(LoginDialog);
