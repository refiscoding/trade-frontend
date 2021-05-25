import { IToast } from '@chakra-ui/core'
import { UploadFile } from '../generated/graphql'
import algoliasearch from 'algoliasearch/lite'

export const APP_NAME = 'TradeFed'

export const STRAPI_USER_STORAGE_KEY = 'strapi-user'

export const CLIENT_HOST = process.env.REACT_APP_CLIENT_HOST

export const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID || '',
  process.env.REACT_APP_ALGOLIA_API_KEY || ''
)

export const SEARCH_INDEX = `${process.env.REACT_APP_STAGE}_TRADEFED`

export const zendeskWidgetScriptUrl = `https://static.zdassets.com/ekr/snippet.js?key=${process.env.REACT_APP_ZENDESK_WIDGET_KEY}` || '';

export const mapsScriptUrl =
  `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places` ||
  ''

// Development
export const IS_PROD = process.env.NODE_ENV === 'production'

export const PASSWORD_REGEX_MESSAGE =
  'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1' +
  ' number and 1 special character'

export const SUCCESS_TOAST: IToast = {
  duration: 6000,
  isClosable: true,
  title: 'Success!',
  status: 'success',
  position: 'bottom-right'
}

export const ERROR_TOAST: IToast = {
  duration: 6000,
  title: 'Oops!',
  status: 'error',
  isClosable: true,
  position: 'bottom-right'
}

export const notificationsMap = {
  onboarding: {
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    SIGNUP_COMPLETE: 'SIGNUP_COMPLETE',
    RESET_PASSWORD: 'RESET_PASSWORD',
  },
  seller: {
    MERCHANT_REQUEST: 'MERCHANT_REQUEST',
    MERCHANT_REQUEST_APPROVED: 'MERCHANT_REQUEST_APPROVED',
    MERCHANT_REQUEST_REJECTED: 'MERCHANT_REQUEST_REJECTED',
  },
  order: {
    STALE_WISHLIST: 'STALE_WISHLIST',
    STALE_CART: 'STALE_CART',
    ORDER_RETURNED: 'ORDER_RETURNED',
    ORDER_CREATED: 'ORDER_CREATED',
  },
};

export const DATE_FORMAT = 'DD/MM/YYYY'

export const PHONE_NUMBER_REGEX = new RegExp('^([0]{1})?([1-9]{1}[0-9]{8})$')

export const COUNTRY_CODE = '+27'

export const EMPTY_FILE: UploadFile = {
  id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  name: '',
  hash: '',
  mime: '',
  size: 0,
  url: '',
  provider: ''
}

export { NAV_ITEMS } from './navItems'
