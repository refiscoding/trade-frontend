import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { color, compose, space, typography } from 'styled-system'
import { TextProps } from './'

const props = compose(space, color, typography)

const H5 = styled(motion.h5)<TextProps>(props)

export default H5

H5.defaultProps = {
  fontSize: 'lg',
  color: 'text'
}
