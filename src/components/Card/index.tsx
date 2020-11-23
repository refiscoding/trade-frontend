import { FlexProps } from '@chakra-ui/core/dist/Flex'
import { MotionProps, Variants } from 'framer-motion'
import React from 'react'
import MotionFlex from '../MotionFlex'

export type CardProps = FlexProps & MotionProps

const Card: React.FC<CardProps> = ({ children, ...rest }) => {
  const variants: Variants = {
    show: {
      y: 0,
      opacity: 1
    },
    hide: {
      y: 50,
      opacity: 0
    }
  }

  return (
    <MotionFlex animate="show" initial="hide" variants={variants} {...rest}>
      {children}
    </MotionFlex>
  )
}

Card.defaultProps = {
  bg: 'white',
  width: 'auto',
  rounded: 'md',
  borderWidth: '1px',
  onClick: () => false,
  flexDirection: 'column'
}

export default Card
