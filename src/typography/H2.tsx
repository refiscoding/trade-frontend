import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { color, compose, space, typography } from 'styled-system'
import { TextProps } from './index'

const props = compose(space, color, typography)

const H2 = styled(motion.h2)<TextProps>(props)

export default H2

H2.defaultProps = {
  fontSize: ['2xl', '3xl'],
  color: 'text',
  fontWeight: 'normal'
}
