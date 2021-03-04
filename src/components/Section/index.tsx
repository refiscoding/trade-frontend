import { Flex, FlexProps, Text } from '@chakra-ui/core'
import * as React from 'react'

const Section: React.FC<FlexProps> = ({ children, ...rest }) => {
  return (
    <Flex
      p={rest.p || '1rem'}
      ml="-1rem"
      width="100vw"
      flexDirection="column"
      my={rest.my || 4}
      borderBottomColor="accent.600"
      borderBottomWidth={rest.borderBottomWidth || 0}
      pb={rest.pb || 5}
    >
      <Text mb={2} fontSize="18px" fontWeight={600}>
        {rest.title}
      </Text>
      <Flex width="100%" flexWrap="wrap" justifyContent="space-evenly">
        {children}
      </Flex>
    </Flex>
  )
}

export default Section
