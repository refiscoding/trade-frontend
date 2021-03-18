import { Flex, FlexProps, Text } from '@chakra-ui/core'
import * as React from 'react'
import {useMediaQuery} from "react-responsive";

const Section: React.FC<FlexProps> = ({ children, ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      p={rest.p || '1rem'}
      ml="-1rem"
      width={isTabletOrMobile ? "100vw" : rest.width || "80%"}
      flexDirection="column"
      my={rest.my || 4}
      pb={rest.pb || 5}
      bg={rest.bg || "white"}
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
