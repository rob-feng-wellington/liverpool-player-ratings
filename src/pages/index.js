import React from 'react'
import Layout from '../components/layout'

import HomeContainer from '../containers/Home';

const IndexPage = (props) => {
  return (
    <Layout>
      {
        auth => (
          <HomeContainer 
            isAuthed={auth.isAuthed} 
            uid={auth.uid} 
          />
        )
      }
    </Layout>
  )
}

export default IndexPage;
