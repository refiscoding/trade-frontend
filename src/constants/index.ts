/* eslint-disable @typescript-eslint/camelcase */
import { IToast } from '@chakra-ui/core'
import { UploadFile } from '../generated/graphql'
import algoliasearch from 'algoliasearch/lite'
import { images } from '../theme'

export const TOTAL_UNITS_SOLD = 'Total Units Sold'
export const ACTIVE_PRODUCT_PROGRESS = 'Active Product Progress'
export const ACTIVE_PRODUCTS = 'Active Products'
export const MONTHS_OF_THE_YEAR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dev'
]

export const APP_NAME = 'tradeFed'

export const STRAPI_USER_STORAGE_KEY = 'strapi-user'

export const CLIENT_HOST = process.env.REACT_APP_CLIENT_HOST

export const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID || '',
  process.env.REACT_APP_ALGOLIA_API_KEY || ''
)

export const SEARCH_INDEX = `${process.env.REACT_APP_STAGE}_tradeFed`

export const zendeskWidgetScriptUrl =
  `https://static.zdassets.com/ekr/snippet.js?key=${process.env.REACT_APP_ZENDESK_WIDGET_KEY}` || ''

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
    RESET_PASSWORD: 'RESET_PASSWORD'
  },
  seller: {
    MERCHANT_REQUEST: 'MERCHANT_REQUEST',
    MERCHANT_REQUEST_APPROVED: 'MERCHANT_REQUEST_APPROVED',
    MERCHANT_REQUEST_REJECTED: 'MERCHANT_REQUEST_REJECTED'
  },
  order: {
    STALE_WISHLIST: 'STALE_WISHLIST',
    STALE_CART: 'STALE_CART',
    ORDER_RETURNED: 'ORDER_RETURNED',
    ORDER_CREATED: 'ORDER_CREATED'
  }
}

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

export const PROVINCES = [
  {
    label: 'Eastern cape',
    value: 'Eastern cape'
  },
  {
    label: 'Free state',
    value: 'Free state'
  },
  {
    label: 'Gauteng',
    value: 'Gauteng'
  },
  {
    label: 'KwaZulu natal',
    value: 'KwaZulu natal'
  },
  {
    label: 'Limpopo',
    value: 'Limpopo'
  },
  {
    label: 'Mpumalanga',
    value: 'Mpumalanga'
  },
  {
    label: 'Northern cape',
    value: 'Northern cape'
  },
  {
    label: 'North west',
    value: 'North west'
  },
  {
    label: 'Western cape',
    value: 'Western cape'
  }
]

export const QUANTITY = [
  {
    id: 1,
    label: 'Bulk',
    value: 'Bulk'
  },
  {
    id: 2,
    label: 'Single',
    value: 'Single'
  }
]

export const CATEGORIES = [
  {
    id: 1,
    name: 'Agriculture',
    categoryImage: `${images?.iconAgriculture}`
  },
  {
    id: 2,
    name: 'Automotive',
    categoryImage: `${images?.iconAutomotive}`
  },
  {
    id: 3,
    name: 'Electrical Equipment',
    categoryImage: `${images?.iconElectrical}`
  },
  {
    id: 4,
    name: 'Food Ingredients',
    categoryImage: `${images?.iconFood}`
  },
  {
    id: 5,
    name: 'Heavy Machinery',
    categoryImage: `${images?.iconHeavyDuty}`
  },
  {
    id: 6,
    name: 'Industrial',
    categoryImage: `${images?.iconIndustrial}`
  },
  {
    id: 7,
    name: 'Lighting',
    categoryImage: `${images?.iconLighting}`
  },
  {
    id: 8,
    name: 'Mining',
    categoryImage: `${images?.iconMining}`
  },
  {
    id: 9,
    name: 'Tools and Hardware',
    categoryImage: `${images?.iconTools}`
  }
]

export const BANNER_IMAGES = [
  {
    id: 1,
    image: `${images?.homeBanner2}`
  },
  {
    id: 2,
    image: `${images?.agricultureBanner}`
  },
  {
    id: 3,
    image: `${images?.automotiveBanner}`
  },
  {
    id: 4,
    image: `${images?.electricalBanner}`
  },
  {
    id: 5,
    image: `${images?.foodBanner}`
  },
  {
    id: 6,
    image: `${images?.heavyBanner}`
  },
  {
    id: 7,
    image: `${images?.lightingBanner}`
  },
  {
    id: 8,
    image: `${images?.toolsBanner}`
  },
  {
    id: 8,
    image: `${images?.miningBanner}`
  }
]

export const INDUSTRIES = [
  {
    label: 'Accommodation and food service activities',
    value: 'Accommodation and food service activities'
  },
  {
    label: 'Agriculture, foresty and fishing',
    value: 'Agriculture, foresty and fishing'
  },
  {
    label: 'Arts, entertainment and recreation',
    value: 'Arts, entertainment and recreation'
  },
  {
    label: 'Construction',
    value: 'Construction'
  },
  {
    label: 'Education',
    value: 'Education'
  },
  {
    label: 'Electricity, gas, steam and air conditioning supply',
    value: 'Electricity, gas, steam and air conditioning supply'
  },
  {
    label: 'Human health and social work activities',
    value: 'Human health and social work activities'
  },
  {
    label: 'Mining and quarrying',
    value: 'Mining and quarrying'
  },
  {
    label: 'Manufacturing',
    value: 'Manufacturing'
  },
  {
    label: 'Professional, scientific and technical activities',
    value: 'Professional, scientific and technical activities'
  },
  {
    label: 'Public administration and defence',
    value: 'Public administration and defence'
  },
  {
    label: 'Repair of motor vehicles and motorcycles',
    value: 'Repair of motor vehicles and motorcycles'
  },
  {
    label: 'Sewerage, waste management and remediation activities',
    value: 'Sewerage, waste management and remediation activities'
  },
  {
    label: 'Transportation and storage',
    value: 'Transportation and storage'
  },
  {
    label: 'Water supplier',
    value: 'Water supplier'
  },
  {
    label: 'Wholesale and retail trade',
    value: 'Wholesale and retail trade'
  },
  {
    label: 'Other service activities',
    value: 'Other service activities'
  }
]

export const BEESTATUS = [
  {
    label: 'Level 1',
    value: 'Level 1'
  },
  {
    label: 'Level 2',
    value: 'Level 2'
  },
  {
    label: 'Level 3',
    value: 'Level 3'
  },
  {
    label: 'Level 4',
    value: 'Level 4'
  },
  {
    label: 'Level 5',
    value: 'Level 5'
  },
  {
    label: 'Level 6',
    value: 'Level 6'
  },
  {
    label: 'Level 7',
    value: 'Level 7'
  },
  {
    label: 'Level 8',
    value: 'Level 8'
  },
  {
    label: 'Not applicable',
    value: 'Not applicable'
  }
]

export const TURNOVER = [
  {
    label: 'Less than 1 million',
    value: 'Less than 1 million'
  },
  {
    label: '1-2 million',
    value: '1-2 million'
  },
  {
    label: '2-5 million',
    value: '2-5 million'
  },
  {
    label: '5-10 million',
    value: '5-10 million'
  },
  {
    label: 'More than 10 million',
    value: 'More than 10 million'
  }
]

export const POSITIONS = [
  {
    label: 'CEO',
    value: 'CEO'
  },
  {
    label: 'Managing Director',
    value: 'Managing Director'
  },
  {
    label: 'Financial Manager',
    value: 'Financial Manager'
  },
  {
    label: 'Financial Director',
    value: 'Financial Director'
  },
  {
    label: 'Procurement Manager',
    value: 'Procurement Manager'
  },
  {
    label: 'Sales Manager',
    value: 'Sales Manager'
  },
  {
    label: 'Other',
    value: 'Other'
  }
]

export { NAV_ITEMS } from './navItems'
