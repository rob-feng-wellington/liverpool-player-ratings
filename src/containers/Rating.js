import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rating from '../components/Rating';
import { navigate } from "@reach/router";
import LoginDialog from '../components/loginDialog';

import { OUR_TEAM, DEFAULT_RATING } from '../utils/Constant';

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
    score: '',
    startingPlayers: [],
    subPlayers: [],
    ratingCount: 0,
    ratings: new Map,
    ratingsAverge: new Map,
    signInDialogIsOpen: false,
    hasRated: false,
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
            const { opponent, homeOrAway, score, image, date, startingList, subList } = doc.data();
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
                  score,
                  image,
                  date,
                  myRating,
                  startingPlayers,
                  subPlayers,
                  ratingsCount,
                  ratingsAverge,
                  ratings
                }

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
      if(myRating) {
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
    const { gameId, uid } = this.props;
    this.setState({
      submitting: true
    })
    if (!uid) {
      //if no user id at this point, need to sign in as anonymouse
      this.setState({
        signInDialogIsOpen: true
      })
    } else {
      // already login. Kick off submit process
      this.doSubmit(gameId, uid);

    }
  }

  doSubmit = (gameId, uid) => {
    const {startingPlayers, subPlayers} = this.state;
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
      .add({
        gameId,
        uid,
        ratings: finalRatings
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      })
  }

  handleSignIn = () => {
    if (signinOption === 'google') {
      this.props.signIn('google')
    } else if (signinOption === 'email') {
      this.props.signIn('email', email, password)
    } else if (signinOption === 'signup') {
      this.props.signIn('signup', email, password)
    }
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
    const { loading, opponent, homeOrAway, score, image, date, startingPlayers, subPlayers, ratingCount, ratingsAverge, hasRated } = this.state;
    const { gameId, isAuthed } = this.props;
    console.log('isAuthed', isAuthed);
    return loading ?
      <div>loading...</div>
      :
      <>
        <Rating 
          loading={loading}
          id={gameId}
          opponent={opponent}
          homeOrAway={homeOrAway}
          score={score}
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
          onClose={this.handleSignIn}
          showLogin={true}
          showSignUp={true}
        />
      </>
  }

}

export default RatingContainer;