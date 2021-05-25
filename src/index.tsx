import React from 'react'
import ReactDOM from 'react-dom'
import mixpanel from "mixpanel-browser";

import { Helmet } from 'react-helmet'
import { css, Global } from '@emotion/core'
import { ApolloProvider } from '@apollo/react-hooks'
import { CSSReset, ThemeProvider } from '@chakra-ui/core'

import App from './App'
import client from './apollo'
import * as serviceWorker from './serviceWorker'

import { theme } from './theme'
import { APP_NAME } from './constants'
import { AppProvider, AuthProvider } from './context'

import 'react-dates/initialize'

mixpanel.init(`${process.env.REACT_APP_MIXPANEL_KEY}`, {
  debug: process.env.REACT_APP_STAGE === "dev",
  ignore_dnt: true
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Helmet titleTemplate={`${APP_NAME} | %s`} />
          <AppProvider>
            <CSSReset />
            <Global
              styles={css`
                * {
                  font-family: ${theme.fonts.body};
                }
                body {
                  background: ${theme.colors.background};
                }
              `}
            />
            <App />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
