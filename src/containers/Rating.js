import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';
import { navigate } from "@reach/router";
import LoginDialog from '../components/loginDialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContent from '../components/mySnackbarContent';

import { DEFAULT_RATING } from '../utils/Constant';

class RatingContainer extends Component {
  static contextTypes = {
    firebase: PropTypes.object
  }

  static propTypes = {
    uid: PropTypes.string,
    isAuthed: PropTypes.bool,
    signIn: PropTypes.func,
    gameId: PropTypes.string
  }

  state = {
    loading: true,
    submitting: false,
    homeOrAway: 'home',
    opponent: '',
    image: '',
    date: '',
    homeScore: 0,
    awayScore: 0,
    group: '',
    startingPlayers: [],
    subPlayers: [],
    ratingCount: 0,
    ratings: new Map,
    ratingsAverge: new Map,
    signInDialogIsOpen: false,
    hasRated: false,
    openSuccessSnack: false,
    openFailedSnack: false,
    emailErrorMessage: '',
    passwordErrorMessage: '',
    addEmailErrorMessage: '',
    addPasswordErrorMessage: '',
    addPasswordConfirmErrorMessage: ''
  }

  componentDidMount() {
    const { gameId } = this.props;
    // id in firebase is 20 characters 
    if(gameId.length === 20) {
      this.setState({
        loading: true,
      });

      this.initialProcess = this.doInitialDataFetch(gameId).then(newState => {
        this.setState(newState);
        return newState;
      })
      
    } else {
      navigate('/404');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { uid } = this.props;
    const { uid: nextUid } = nextProps;
    this.initialProcess.then(state => {
      if ((!uid && !nextUid) || (uid && !nextUid)) {
        //this.signInAnonymously();
      } else {
        if (this.state.submitting === true) {
          this.handleSubmit();
        }
        // a uid exists, check if the user has already voted
        this.checkMyRatings(nextUid, this.state.ratings);
      }
    })

  }

  doInitialDataFetch = (gameId) => {
    return new Promise((resolve, reject) => {
      this.game
        .get()
        .then(doc => {
          if (doc.exists) {
            const { opponent, homeOrAway, homeScore, awayScore, group, image, date, startingList, subList } = doc.data();
            this.allRatings
            .where('gameId', '==', gameId)
            .get()
            .then((querySnapshot) => {
              const ratings = new Map;
              querySnapshot.forEach(doc => {
                ratings.set(doc.id, doc.data())
              });

              let ratingsCount = 0;
              let ratingsAverge = new Map;
              let myRating = new Map;
              if(ratings.size > 0) {
                let ratingsArr = Array.from(ratings.values());
                let totalRatings = ratingsArr.map(rating => {
                  return rating.ratings;
                }).reduce((r, o) => {
                  Object.keys(o).map((id) => {
                    const previousValue = r.get(id) || 0;
                    const newRate = previousValue + o[id];
                    return r.set(id, newRate);
                  });
                  return r;
                }, new Map);
                totalRatings.forEach((value, key) => {
                  ratingsAverge.set(key, (value/ratings.size).toFixed(1));
                })
              }
              // playerId => player
              this.squad.get().then(querySnapshot => {
                const startingPlayers = querySnapshot
                  .docs
                  .filter(doc => startingList.indexOf(doc.id) > -1)
                  .map(doc => {
                    const player = doc.data();
                    player.id = doc.id;
                    player.rating = doc.rating || DEFAULT_RATING;
                    return player;
                  });
  
                const subPlayers = querySnapshot
                  .docs
                  .filter(doc => subList.indexOf(doc.id) > -1)
                  .map(doc => {
                    const player = doc.data();
                    player.id = doc.id;
                    player.rating = doc.rating || DEFAULT_RATING;
                    return player;
                  });

                const initialState = {
                  loading: false,
                  id: gameId,
                  opponent,
                  homeOrAway,
                  homeScore,
                  awayScore,
                  group,
                  image,
                  date,
                  myRating,
                  startingPlayers,
                  subPlayers,
                  ratingsCount,
                  ratingsAverge,
                  ratings
                }
                console.log('startingPlayers =>', startingPlayers);
                resolve(initialState);
              })
            })
            .catch(error => {
              console.log(error);
            })
          } else {
            reject('error')
          }
        })
        .catch(error => {
          // TODO: error handling here
          reject('error')
        })
    }) 
  }

  checkMyRatings = (uid, allRatings) => {
    if (uid && allRatings.size > 0) {
      const myRating = Array.from(allRatings.values()).filter(rating => {
        return rating.uid === uid
      }).map(rating => {
        return rating.ratings
      }).reduce((r, o) => {
        return o;
      },{});

      console.log('myRating => ', myRating);
      if(myRating && Object.keys(myRating).length > 0) {
        console.log('myRating 2 => ', myRating);
        const updatedStartingPlayer = this.state.startingPlayers.map(player => {
          return { ...player, rating: myRating[player.id]}
        })

        const updatedSubPlayer = this.state.subPlayers.map(player => {
          return { ...player, rating: myRating[player.id]}
        })

        this.setState({
          startingPlayers: updatedStartingPlayer,
          subPlayers: updatedSubPlayer,
          hasRated: true
        })
      } else {
        this.setState({
          hasRated: false
        })
      }
    } else {
      this.setState({
        hasRated: false
      })
    }
  }

  handleRating = (value, playerId) => {
    const { startingPlayers, subPlayers } = this.state;
    const newStartingPlayers = startingPlayers.map(player => {
      return player.id === playerId ?
        {...player, rating: value} :
        player
    })

    const newSubPlayers = subPlayers.map(player => {
      return player.id === playerId ?
        {...player, rating: value} :
        player
    })

    this.setState({
      startingPlayers: newStartingPlayers,
      subPlayers: newSubPlayers
    })
  }

  handleSubmit = () => {
    const { gameId, uid, isAuthed } = this.props;
    this.setState({
      submitting: true
    })
    if (!isAuthed) {
      //if no user id at this point, need to Sign in as anonymouse
      this.setState({
        signInDialogIsOpen: true
      })
    } else {
      // already login. Kick off submit process
      this.doSubmit(gameId, uid)
    }
  }

  doSubmit = (gameId, uid) => {
    const {startingPlayers, subPlayers} = this.state;
    const that = this;
    const myStartingRatings = startingPlayers.reduce((r, o) => {
      const key = o.id;
      const value = o.rating;
      r[key] = value;
      return r;
    }, {});
    const finalRatings = subPlayers.reduce((r, o) => {
      const key = o.id;
      const value = o.rating;
      r[key] = value;
      return r;
    }, myStartingRatings);
    this.allRatings
      .where('gameId', '==', gameId)
      .where('uid', '==', uid)
      .get()
      .then(function(querySnapshot) {
        if(querySnapshot.size > 0) {
          // already exist, do update
          querySnapshot.forEach(function(doc) {
            that.allRatings
              .doc(doc.id)
              .set({
                ratings: finalRatings
              },{merge: true})
              .then(function() {
                that.setState({
                  openSuccessSnack: true
                })
              })
              .catch(function(error) {
                console.log('error =>', error);
                that.setState({
                  openFailedSnack: true
                })
              })
          });
        } else {
          // does not exist, do insert
          that.allRatings
          .add({
            gameId,
            uid,
            ratings: finalRatings
          })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            that.setState({
              openSuccessSnack: true
            })
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            that.setState({
              openFailedSnack: true
            })
          })
        }
        that.setState({
          submitting: false
        })
      })


    
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
    this.setState(errorMessage);
  }

  handleSnackbarClose = () => {
    this.setState({
      openSuccessSnack: false,
      openFailedSnack: false
    })
  }

  get game() {
    const { firebase } = this.context;
    const { gameId } = this.props;

    return firebase.games.doc(gameId);
  }

  get allRatings() {
    const { firebase } = this.context;

    return firebase.ratings
  }

  get squad() {
    const { firebase } = this.context;
    return firebase.squad;
  }

  render() {
    const { loading, opponent, homeOrAway, homeScore, awayScore, group, image, date, startingPlayers, subPlayers, ratingCount, ratingsAverge, hasRated } = this.state;
    const { gameId, isAuthed } = this.props;
    console.log('isAuthed', isAuthed);
    return loading ?
      <>
      <br />
      <LinearProgress />
      </>
      :
      <>
        <Rating 
          loading={loading}
          id={gameId}
          opponent={opponent}
          homeOrAway={homeOrAway}
          homeScore={homeScore}
          awayScore={awayScore}
          group={group}
          image={image}
          date={date}
          startingPlayers={startingPlayers}
          subPlayers={subPlayers}
          ratingCount={ratingCount}
          ratingsAverge={ratingsAverge}
          onRate={this.handleRating}
          onSubmit={this.handleSubmit}
          isAuthed={isAuthed}
          hasRated={hasRated}
        />
        <LoginDialog
          open={this.state.signInDialogIsOpen}
          onClose={this.handleLoginDialogClose}
          showLogin={true}
          showSignUp={false}
          emailErrorMessage= {this.state.emailErrorMessage}
          passwordErrorMessage= {this.state.passwordErrorMessage}
          addEmailErrorMessage= {this.state.addEmailErrorMessage}
          addPasswordErrorMessage= {this.state.addPasswordErrorMessage}
          addPasswordConfirmErrorMessage= {this.state.addPasswordConfirmErrorMessage}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openSuccessSnack}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContent
            onClose={this.handleSnackbarClose}
            variant="success"
            message="Ratings submitted successfully!"
          />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openFailedSnack}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContent
            onClose={this.handleSnackbarClose}
            variant="error"
            message="Ratings submitted failed!"
          />
        </Snackbar>
      </>
  }

}

export default RatingContainer;