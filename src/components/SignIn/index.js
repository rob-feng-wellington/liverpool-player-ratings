import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import LoginDialog from '../loginDialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit/2
  }
})

const Signin = ({ classes, onClick, icon, text }) => (
  <Button
    variant="contained"
    color="primary"
    className={classes.button}
    onClick={onClick}
    >
    <div className={classes.leftIcon}>
      { icon && cloneElement(icon) }
    </div>
    {text}
  </Button>
)

Signin.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  text: PropTypes.string.isRequired
}

export default withStyles(styles)(Signin);
