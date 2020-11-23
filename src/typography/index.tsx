import { ColorProps, SpaceProps, TypographyProps } from 'styled-system'
import H1 from './H1'
import H2 from './H2'
import H3 from './H3'
import H4 from './H4'
import H5 from './H5'
import Text from './Text'

export type TextProps = SpaceProps &
  ColorProps &
  TypographyProps & {
    color?: any
  }

export { H1, H2, H3, H4, H5, Text }
