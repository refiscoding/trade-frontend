import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { STRAPI_USER_STORAGE_KEY } from './constants/index'
import { fetchJwt } from './utils'

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_HOST + '/graphql',
  cache: new InMemoryCache(),
  request: (operation) => {
    const token = fetchJwt()
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  onError: ({ response }) => {
    if (response?.errors && response.errors[0].message === 'Invalid token.') {
      window.localStorage.removeItem(STRAPI_USER_STORAGE_KEY)
      window.sessionStorage.removeItem(STRAPI_USER_STORAGE_KEY)
      window.location.replace(process.env.REACT_APP_CLIENT_HOST || '')
    }
  }
})

export default client
