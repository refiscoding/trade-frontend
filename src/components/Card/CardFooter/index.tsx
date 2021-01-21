import { Flex } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import * as React from 'react'

type CardFooterProps = FlexProps

const CardFooter: React.FC<CardFooterProps> = ({ children, ...rest }) => {
  return (
    <Flex {...rest}>
      {children}
    </Flex>
  )
}

export default CardFooter

CardFooter.defaultProps = {
  bg: 'white',
  roundedBottomLeft: 4,
  roundedBottomRight: 4,
  flexDirection: 'column'
}
