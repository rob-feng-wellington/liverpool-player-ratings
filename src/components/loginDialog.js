import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle, List, ListItem, TextField, Button, Divider, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';
import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'inherit',
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
    confirmPassword: ''
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
    const { classes, onClose, showLogin, showSignUp, ...other } = this.props;
    return (
      <Dialog aria-labelledby="login-form" {...other}>
        {
          showLogin ?
          <div className={classes.root}>
            <DialogTitle className={classes.title}>Login with Gooogle account</DialogTitle>
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
                <DialogTitle className={classes.title}>Login with Username and Password</DialogTitle>
                <ListItem className={classes.list} >
                  <form noValidate autoComplete="off" onSubmit={(e) => this.handleEmailLogin(e)} >
                    <FormControl className={classes.margin} error={this.props.emailErrorMessage === '' ? false : true}>
                      <InputLabel htmlFor="signinEmail">Email</InputLabel>
                      <Input
                        name="signinEmail"
                        type="email"
                        value={this.state.email}  
                        onChange={this.handleChange('email')}
                        fullWidth={true}
                      />
                      {
                        this.props.emailErrorMessage === ''
                        ? null
                        : <FormHelperText name="signin-email-error-text">{this.props.emailErrorMessage}</FormHelperText>
                      }

                    </FormControl>
                    <FormControl className={classes.margin} error={this.props.passwordErrorMessage === '' ? false : true}>
                      <InputLabel htmlFor="signinPassword">Password</InputLabel>
                      <Input
                        name="signinPassword"
                        type="password"
                        value={this.state.password}  
                        onChange={this.handleChange('password')}
                        onKeyDown={this.onPasswordKeyPressed}
                        fullWidth={true}
                      />
                      {
                        this.props.passwordErrorMessage === ''
                        ? null
                        : <FormHelperText name="signin-password-error-text">{this.props.passwordErrorMessage}</FormHelperText>
                      }
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit">
                      Login
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
          showSignUp ?
          <>
          <Divider variant="middle"/>
          <List>
            <DialogTitle className={classes.title}>Please create an account</DialogTitle>
            <ListItem>
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
          </>
          :
          null
        }
        <Button variant="outlined" color="primary" onClick={this.handleAnonymouseLogin}>Not right now, take me back</Button>
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
