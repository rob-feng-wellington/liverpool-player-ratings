/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import FirebaseProvider from './src/containers/FirebaseProvider';

import firebase from './src/services/firebase';

export const wrapRootElement = ({ element }) => (
  <FirebaseProvider firebase={firebase}>{element}</FirebaseProvider>
)
/* 
exports.replaceRouterComponent = ({ history }) => {
  const ConnectedRouterWrapper = ({ children }) => (
    <FirebaseProvider firebase={firebase}>
      <Router history={history}>{children}</Router>
    </FirebaseProvider>
  );

  return ConnectedRouterWrapper;
}; */


