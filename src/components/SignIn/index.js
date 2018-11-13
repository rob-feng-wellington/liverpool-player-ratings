import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

const Signin = ({ onClick, icon, text }) => (
  <button
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '5px 10px',
      color: 'rgba(0, 0, 0, 0.54)',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'color 200ms liner',
      "&:hover": {
        color: 'rgba(0, 0, 0, 0.8)'
      }
    }}
    onClick={onClick}
    >
    { icon && cloneElement(icon) }
    <span>{text}</span>
  </button>
)

Signin.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  text: PropTypes.string.isRequired
}

export default Signin;
