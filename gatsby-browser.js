/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import FirebaseProvider from './src/containers/FirebaseProvider';

import firebase from './src/services/firebase';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export const wrapRootElement = ({ element }) => {
  const ConnectedRootElement = (
      <FirebaseProvider firebase={firebase}>
        {element}
      </FirebaseProvider>
  )

  return ConnectedRootElement;
}



