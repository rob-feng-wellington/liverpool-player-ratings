import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { rhythm } from '../utils/typography'
import Header from './header'
import Auth from '../containers/Auth'


const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <Auth>
        {
          auth => {
            return (
              <div>
                <Helmet
                  title={data.site.siteMetadata.title}
                  meta={[
                    { name: 'description', content: 'Sample' },
                    { name: 'keywords', content: 'sample, something' },
                  ]}>
                  <html lang="en" />
                </Helmet>
                <Header 
                  siteTitle={data.site.siteMetadata.title}
                  background="background-image: linear-gradient(116deg, #08AEEA 0%, #2AF598 100%)"
                  {...auth} />
                <div
                  style={{
                    margin: '0 auto',
                    maxWidth: rhythm(24),
                    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
                    paddingTop: 0,
                  }}>
                  {children}
                </div>
              </div>
            )
          }
        }
        
      </Auth>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
