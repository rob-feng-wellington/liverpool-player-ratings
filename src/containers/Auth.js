import React from 'react';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  uid: '',
  isAnonymous: null,
  email: ''
};

class Auth extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  static contextTypes = {
    firebase: PropTypes.object
  };

  state = INITIAL_STATE;

  componentDidMount() {
    const { auth } = this.context.firebase
    
    this.stopAuthListener = auth().onAuthStateChanged(user => {
      if(user) {
        this.signIn(user);
      } else {
        this.signOut();
      }
    })
  }

  componentWillUnmount() {
    this.stopAuthListener();
  }

  handleSignIn = (provider, email, password) => {
    const { auth } = this.context.firebase;

    switch (provider) {
      case 'google':
        return auth()
          .signInWithPopup(new auth.GoogleAuthProvider())
          .catch(error => {
            console.error(error);
            return Promise.reject(error);
          });
      case 'email':
        return auth()
          .signInWithEmailAndPassword(email, password)
          .catch(error => {
            console.error(error);
            return Promise.reject(error);
          })
      case 'signup':
          return auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
              console.log(error);
              return Promise.reject(error);
            })
      case 'anonymous':
        return auth()
          .signInAnonymously()
          .catch(error => {
            console.error(error);
            return Promise.reject(error);
          });
      default: 
        const reason = 'Invalid provider passed to signIn method';
        console.error(reason);
        return Promise.reject(reason);
    }
  };

  handleSignOut = () => {
    const { auth } = this.context.firebase;

    return auth().signOut();
  };

  signIn = (user) => {
    const { uid, isAnonymous, email } = user;
    console.log('user =>', user);
    this.setState({
      uid,
      isAnonymous,
      email
    });
  }

  signOut = () => {
    this.setState(INITIAL_STATE);
  }

  render() {
    const isAuthed = !!(this.state.uid && !this.state.isAnonymous);
    return this.props.children({
      ...this.state,
      signIn: this.handleSignIn,
      signOut:this.handleSignOut,
      isAuthed
    });
  }

}

export default Auth;