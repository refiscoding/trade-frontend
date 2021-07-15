import styled from '@emotion/styled'
import {
  color,
  space,
  fontSize,
  textAlign,
  fontWeight,
  SpaceProps,
  ColorProps,
  FontSizeProps,
  TextAlignProps,
  FontWeightProps
} from 'styled-system'

export type LabelProps = SpaceProps &
  ColorProps &
  TextAlignProps &
  FontSizeProps &
  FontWeightProps & { color?: string }

export const Label = styled.label<LabelProps>`
  ${space};
  ${color};
  ${fontSize};
  ${textAlign};
  ${fontWeight}
`

Label.defaultProps = {
  mb: 2,
  fontSize: 'md',
  textAlign: 'left',
  color: 'text.dark'
}
