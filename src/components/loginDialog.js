import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle, List, ListItem, TextField, Button, Divider } from '@material-ui/core';
import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'inherit',
  },

  title: {
    paddingTop: 0,
    paddingBottom: 0
  },

  list: {
    paddingTop: 0,
    paddingBottom: 0,
  }
})

class LoginDialog extends Component{
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    showLogin: PropTypes.bool.isRequired,
    showSignUp: PropTypes.bool.isRequired
  }

  state = {
    email: {value: '', error: ''},
    password: {value: '', error: ''},
    addEmail: {value: '', error: ''},
    addPassword: {value: '', error: ''},
    confirmPassword: {value: '', error: ''}
  }

  handleChange = (attr) => event => {
    const newState = { ...this.state[attr], value: event.target.value};
    this.setState({
      [attr]: newState,
    });
  }
  
  handleEmailLogin = () => {
    this.props.onClose('email', this.state.email.value, this.state.password.value);
  }

  handleCreateUser = () => {
    this.props.onClose('signup', this.state.addEmail.value, this.state.addPassword.value);
  }

  render() {
    const { classes, onClose, showLogin, showSignUp, ...other } = this.props;
    return (
      <Dialog aria-labelledby="login-form" {...other}>
        {
          showLogin ?
          <div className={classes.root}>
            <DialogTitle className={classes.title}>Please login</DialogTitle>
            <List className={classes.list} disablePadding={true}>
              <ListItem className={classes.list} disablePadding={true}>
                <SignIn
                  onClick={() => onClose('google')}
                  icon={<GoogleIcon />}
                  text={'Sign in with Google'}
                />
              </ListItem>
            </List>
            <Divider />
            <div className={classes.root}>
              <List className={classes.list} disablePadding={true}>
                <DialogTitle>Or Login with Email and Password</DialogTitle>
                <ListItem className={classes.list} disablePadding={true}>
                  <form noValidate autoComplete="off" onSubmit={this.handleEmailLogin} >
                    <TextField
                      label="Email"
                      type="email"
                      value={this.state.email.value}
                      onChange={this.handleChange('email')}
                      margin="normal"
                      fullWidth={true}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={this.state.password.value}
                      onChange={this.handleChange('password')}
                      onKeyDown={this.onPasswordKeyPressed}
                      margin="normal"
                      fullWidth={true}
                    />
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
          <DialogTitle>Please create an account</DialogTitle>
          <List>
            <ListItem>
              <form autoComplete="off">
                <TextField
                  label="Email"
                  type="email"
                  value={this.state.addEmail.value}
                  onChange={this.handleChange('addEmail')}
                  margin="normal"
                  fullWidth={true}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={this.state.addPassword.value}
                  onChange={this.handleChange('addPassword')}
                  margin="normal"
                  fullWidth={true}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={this.state.confirmPassword.value}
                  onChange={this.handleChange('confirmPassword')}
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
        <Button variant="contained" color="primary">Not right now, take me back</Button>
      </Dialog>
    )
  }
}

LoginDialog.defaultProps = {
  showLogin: true,
  showSignUp: false
}

export default withStyles(styles)(LoginDialog);
