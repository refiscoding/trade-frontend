import { theme as chakraTheme } from '@chakra-ui/core'
import images from './images'

const theme = {
  ...chakraTheme,
  fonts: {
    body: 'Gotham Bold, sans-serif',
    mono: 'Gotham Medium',
    heading: 'Gotham Book'
  },
  colors: {
    ...chakraTheme.colors,
    tag: '#B6DAF5',
    tagText: '#004A81',
    info: '#CEEDFF',
    blueText: '#5C88DA',
    background: '#efefef',
    dimText: '#6A6A6A',
    bodyText: '#4F4F4F',
    errorText: '#e30017',
    greenFill: '#63C035',
    brand: {
      50: 'rgba(27,38,79,0.19)',
      100: '#8c8c8c',
      200: '#737373',
      300: '#595959',
      400: '#0976B4',
      500: '#5C88DA',
      600: '#8c8c8c',
      700: '#231F20'
    },
    accent: {
      20: '#414042',
      50: '#ffffff',
      100: '#ffe5ae',
      200: '#EDF2F7',
      300: '#fbc44e',
      400: '#bf0e08',
      500: '#0976B4',
      600: '#E2E4E8',
      700: '#88DBDF',
      800: '#313130',
      900: '#1d1000'
    },
    success: {
      50: '##ffffff',
      100: '#c3ebd7',
      200: '#a0dcbf',
      300: '#7ccda7',
      400: '#59bf8e',
      500: '#40a674',
      600: '#30815a',
      700: '#205c40',
      800: '#0e3825',
      900: '#001509'
    }
  },
  boxShadowDark: '0px 0px 4px 4px rgba(0,0,0,0.4)',
  boxShadowLight: '0 2px 4px rgba(0, 0, 0, 0.25)',
  boxShadowMedium: '0 1px 2px 0 rgba(0, 0, 0, 0.17)',
  gridGutter: 1 // rem - taken from Chakra UI space scale https://chakra-ui.com/theme#spacing
}

export { theme, images }
