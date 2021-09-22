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

export const APP_NAME = 'TradeFed'

export const STRAPI_USER_STORAGE_KEY = 'strapi-user'

export const CLIENT_HOST = process.env.REACT_APP_CLIENT_HOST

export const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID || '',
  process.env.REACT_APP_ALGOLIA_API_KEY || ''
)

export const SEARCH_INDEX = `${process.env.REACT_APP_STAGE}_TRADEFED`

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
  // eslint-disable-next-line @typescript-eslint/camelcase
  created_at: new Date().toISOString(),
  // eslint-disable-next-line @typescript-eslint/camelcase
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
    label: 'Eastern Cape',
    value: 'Eastern Cape'
  },
  {
    label: 'Free State',
    value: 'Free State'
  },
  {
    label: 'Gauteng',
    value: 'Gauteng'
  },
  {
    label: 'KwaZulu Natal',
    value: 'KwaZulu Natal'
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
    label: 'Northern Cape',
    value: 'Northern Cape'
  },
  {
    label: 'North West',
    value: 'North West'
  },
  {
    label: 'Western Cape',
    value: 'Western Cape'
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

export const INDUSTRIES = [
  {
    label: 'Agriculture, foresty and fishing',
    value: 'Eastern Cape'
  },
  {
    label: 'Mining and quarrying',
    value: 'Free State'
  },
  {
    label: 'Manufacturing',
    value: 'Gauteng'
  },
  {
    label: 'Electricity, gas, steam and air conditioning supply',
    value: 'KwaZulu Natal'
  },
  {
    label: 'Water supple',
    value: 'Limpopo'
  },
  {
    label: 'Sewerage, waste management and remediation activities',
    value: 'Mpumalanga'
  },
  {
    label: 'Construction',
    value: 'Northern Cape'
  },
  {
    label: 'Wholesale and retail trade',
    value: 'North West'
  },
  {
    label: 'Repair of motor vehicles and motorcycles',
    value: 'Western Cape'
  },
  {
    label: 'Transportation and storage',
    value: 'Western Cape'
  },
  {
    label: 'Accommodation and food service activities',
    value: 'Western Cape'
  },
  {
    label: 'Professional, scientific and technical activities',
    value: 'Western Cape'
  },
  {
    label: 'Public administration and defence',
    value: 'Western Cape'
  },
  {
    label: 'Education',
    value: 'Western Cape'
  },
  {
    label: 'Arts, entertainment and recreation',
    value: 'Western Cape'
  },
  {
    label: 'Human health and social work activities',
    value: 'Western Cape'
  },
  {
    label: 'Other service activities',
    value: 'Western Cape'
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

export { NAV_ITEMS } from './navItems'
