import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle, List, ListItem, TextField, Button, Divider } from '@material-ui/core';
import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

class LoginDialog extends Component{
  static propTypes = {
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

  render() {
    const { onClose, showLogin, showSignUp, ...other } = this.props;
    return (
      <Dialog aria-labelledby="login-form" {...other}>
        {
          showLogin ?
          <>
            <DialogTitle>Please login</DialogTitle>
            <div>
              <List>
                <ListItem>
                  <SignIn
                    onClick={() => onClose('google')}
                    icon={<GoogleIcon />}
                    text={'Sign in with Google'}
                  />
                </ListItem>
                <Divider />
                <h6>Or Login with Email and Password</h6>
                <ListItem>
                  <form noValidate autoComplete="off">
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
                      margin="normal"
                      fullWidth={true}
                    />
                    <Button variant="contained" color="primary" onClick={this.handleEmailLogin}>
                      Login
                    </Button>
                  </form>
                </ListItem>
              </List>
            </div>
          </>
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
              </form>
            </ListItem>
          </List>
          </>
          :
          null
        }
        <Button variant="contained">Not right now, take me back</Button>
      </Dialog>
    )
  }
}

LoginDialog.defaultProps = {
  showLogin: true,
  showSignUp: false
}

export default LoginDialog;
