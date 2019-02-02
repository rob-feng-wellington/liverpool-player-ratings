import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { rhythm } from '../utils/typography'
import Header from './header'
import Auth from '../containers/Auth'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  palette: {
    primary: { main: red[700] },
    secondary: purple,
  },
  typography: { useNextVariants: true },
});

const Layout = ({ children, ...props }) => (
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
      <MuiThemeProvider theme={theme}>
      <Auth>
        {
          auth => {
            return (
              <div>
                <Helmet
                  title={data.site.siteMetadata.title}
                  meta={[
                    { name: 'description', content: 'Liverpool players ratings' },
                    { name: 'keywords', content: 'liverpool, players, ratings' },
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
                    maxWidth: rhythm(40),
                    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
                    paddingTop: 0,
                  }}>
                  {children({
                    ...props,
                    ...auth,
                  })}
                </div>
              </div>
            )
          }
        }
      </Auth>
      </MuiThemeProvider>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.func.isRequired,
}

export default Layout
