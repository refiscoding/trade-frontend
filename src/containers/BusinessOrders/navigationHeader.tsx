import React from 'react'
import { Flex, Box, Text, Link } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

export type NavigationItemProps = FlexProps

const NavigationItem: React.FC<NavigationItemProps> = ({ children, ...rest }) => {
  return (
    <Flex {...rest}>
      <Text mb={{ base: 8, sm: 0 }} mr={{ base: 0, sm: 8 }} display="block">
        <Link href="#">{children}</Link>
      </Text>
    </Flex>
  )
}

const NavigationHeader: React.FC = () => {
  return (
    <Flex mb={8} p={8} as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      <Box display={{ base: 'block', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
        <Flex
          align="center"
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          pt={[4, 4, 0, 0]}
        >
          <NavigationItem>All</NavigationItem>
          <NavigationItem>Confirmation</NavigationItem>
          <NavigationItem>Processing</NavigationItem>
          <NavigationItem>Ready</NavigationItem>
          <NavigationItem>Dispatched</NavigationItem>
        </Flex>
      </Box>
    </Flex>
  )
}

export default NavigationHeader
