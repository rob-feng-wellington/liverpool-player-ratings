import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types';

import SignIn from './SignIn';
import GoogleIcon from './icons/Google';

const BACKGROUND = 'background-color: #20232a';

const Header = ({ siteTitle, background, signIn, signOut, isAuthed }) => (
  <div
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
  </div>
)

Header.defaultProps = {
  background: BACKGROUND
};

Header.propTypes = {
  background: PropTypes.string,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  siteTitle: PropTypes.string,
  isAuthed: PropTypes.bool
};

export default Header
