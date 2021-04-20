import { theme as chakraTheme } from '@chakra-ui/core'
import images from './images'

const theme = {
  ...chakraTheme,
  fonts: {
    body: 'Muli, sans-serif',
    mono: 'Muli, sans-serif',
    heading: 'Muli, sans-serif'
  },
  colors: {
    ...chakraTheme.colors,
    background: '#efefef',
    info: '#CEEDFF',
    blueText: '#355EC0',
    brand: {
      50: 'rgba(27,38,79,0.19)',
      100: '#8c8c8c',
      200: '#737373',
      300: '#595959',
      400: '#0976B4',
      500: '#1B264F',
      600: '#8c8c8c'
    },
    accent: {
      50: '#ffffff',
      100: '#ffe5ae',
      200: '#EDF2F7',
      300: '#fbc44e',
      400: '#bf0e08',
      500: '#0976B4',
      600: '#E2E4E8',
      700: '#C83E22',
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
  boxShadow: '0px 0px 4px 4px rgba(0,0,0,0.4)',
  gridGutter: 1 // rem - taken from Chakra UI space scale https://chakra-ui.com/theme#spacing
}

export { theme, images }
