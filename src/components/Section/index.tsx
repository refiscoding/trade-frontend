import * as React from 'react'
import { useMediaQuery } from "react-responsive";

import { Flex, FlexProps, Text } from '@chakra-ui/core'

import { theme } from "../../theme";

type SectionProps = FlexProps & {
  card?: boolean
  ml?: string
};

const Section: React.FC<SectionProps> = ({ children, card, ml, ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });
  const boxShadow = card ? theme.boxShadowMedium : '';
  const borderRadius = card ? '3px' : '';
  return (
    <Flex
      p={rest.p || '1rem'}
      ml={ml ? ml : "-1rem"}
      width={isTabletOrMobile ? "100vw" : rest.width || "80%"}
      flexDirection="column"
      my={rest.my || 4}
      pb={rest.pb || 5}
      bg={rest.bg || "white"}
      boxShadow={boxShadow}
      borderRadius={borderRadius}
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
