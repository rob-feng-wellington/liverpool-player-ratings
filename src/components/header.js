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

class Header extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    siteTitle: PropTypes.string,
    isAuthed: PropTypes.bool
  }

  state = {
    anchorEl: null,
  }

  handleMenu = (e) => {

  }

  handleClose = (e) => {

  }

  render() {
    const { signIn, signOut, siteTitle, isAuthed } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{
              flexGrow: 1,
            }}>
              {siteTitle}
            </Typography>
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
              </Menu>
            </div>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}



/* const Header = ({ siteTitle, background, signIn, signOut, isAuthed }) => {
  const handleMenu = (e) => {

  }

  const handleClose = (e) => {

  }
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" style={{
            flexGrow: 1,
          }}>
            {siteTitle}
          </Typography>
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
} */

  /* <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}>
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}>
          {siteTitle}
        </Link>
      </h1>
      <SignIn
        onClick={() => (isAuthed ? signOut() : signIn('google'))}
        icon={isAuthed ? null : <GoogleIcon />}
        text={isAuthed ? 'Sign Out' : 'Sign in with Google'}
      />
    </div>
  </div> */

/* Header.defaultProps = {
  background: BACKGROUND
};

Header.propTypes = {
  background: PropTypes.string,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  siteTitle: PropTypes.string,
  isAuthed: PropTypes.bool
};
 */
export default Header
