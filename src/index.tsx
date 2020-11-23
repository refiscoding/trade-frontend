import { ApolloProvider } from '@apollo/react-hooks'
import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { css, Global } from '@emotion/core'
import React from 'react'
import 'react-dates/initialize'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import client from './apollo'
import App from './App'
import { APP_NAME } from './constants'
import { AppProvider, AuthProvider } from './context'
import * as serviceWorker from './serviceWorker'
import { theme } from './theme'

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
