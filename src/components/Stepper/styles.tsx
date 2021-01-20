import styled from '@emotion/styled'
import { color, ColorProps, WidthProps } from 'styled-system'
import MotionFlex from '../MotionFlex'

type SpacerLineProps = ColorProps & WidthProps

export const SpacerLine = styled(MotionFlex)`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
`

export const Square = styled.div`
  width: 100%;
  height: 10px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`

export const OuterCircle = styled<'div', ColorProps>('div')`
  ${color};
  width: 100%;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`
