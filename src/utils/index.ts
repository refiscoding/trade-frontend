import get from 'lodash/get'
import { STRAPI_USER_STORAGE_KEY } from '../constants'
/**
 * Gets JWT of authenticatedUser from either sessionStorage or localStorage
 */
export const fetchJwt = () => {
  const localUser = localStorage.getItem(STRAPI_USER_STORAGE_KEY)
  const sessionUser = sessionStorage.getItem(STRAPI_USER_STORAGE_KEY)
  const user = sessionUser || localUser

  return user ? JSON.parse(user).jwt : null
}

export function formatError({ response }: any) {
  return get(response, 'data.message[0].messages[0].message', 'An unknown error has occured.')
}
